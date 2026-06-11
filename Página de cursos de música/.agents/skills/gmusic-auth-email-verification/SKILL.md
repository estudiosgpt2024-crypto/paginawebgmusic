---
name: gmusic-auth-email-verification
description: >-
  Sistema de autenticación propio de Gmusic: JWT httpOnly cookie, bcrypt,
  registro real, estados de sesión (anonymous / registered_no_sub /
  authenticated), migración de progreso demo, relación con devStudentAuth y
  Fase 5. Leer antes de tocar cualquier archivo de auth, sesión o acceso.
---

# Gmusic Auth & Email Verification

Leer este Skill **antes de tocar cualquier archivo relacionado con auth, sesión, cookies, registro, acceso o estados de publicSession**. Aplica también a cambios en `usePublicStudentSession`, `useDemoUserState`, `StudentZoneGuard` y cualquier endpoint bajo `/api/v1/auth`.

No es el Skill para pagos/webhook (ver futuro `gmusic-payments-flow`) ni para lógica de XP/racha (ver `gmusic-learning-engine`).

---

## 1. Cookie de sesión real

### Nombre y atributos

| Atributo | Valor |
|----------|-------|
| Nombre | `gmusic_session` |
| Contenido | JWT firmado con `JWT_SECRET` |
| `HttpOnly` | **Sí — obligatorio** |
| `SameSite` | `Strict` |
| `Secure` | `true` en producción |
| `Path` | `/api/v1` |
| Max-Age | 28800 s (8 horas) |

### JWT payload

```json
{ "sub": "uuid-del-usuario", "iat": 1718000000, "exp": 1718028800 }
```

**Regla crítica — payload:** El payload del JWT contiene **únicamente `userId` en `sub`**. Nunca incluir email, name, role, ni ningún dato personal. El servidor resuelve al usuario con `prisma.user.findUnique({ where: { id: payload.sub } })`.

### Diferencia con la cookie dev

| Cookie | `gmusic_dev_student_email` | `gmusic_session` |
|--------|---------------------------|------------------|
| Sistema | dev only | real (Fase 4+) |
| Payload | `student:email@...` firmado con HMAC | JWT con `{ sub: userId }` |
| Secret | `GMUSIC_DEV_ACTIVATION_KEY` | `JWT_SECRET` |
| Path | `/api/v1` | `/api/v1` |
| Bloqueado en prod | Sí (`NODE_ENV === "production"`) | No |

### Variables de entorno

| Variable | Uso | Obligatoria |
|----------|-----|-------------|
| `JWT_SECRET` | Firmado/verificado de `gmusic_session` | **Sí** |
| `GMUSIC_DEV_ACTIVATION_KEY` | `gmusic_dev_student_email` (dev only) | Solo en dev |
| `GMUSIC_DEV_USER_EMAIL` | Fallback de `devStudentAuth` (dev only) | Solo en dev |

**Regla crítica:** Si `JWT_SECRET` no está configurada y `NODE_ENV !== "development"`, el servidor debe fallar al arrancar con un error explícito, no silenciosamente.

---

## 2. Relación con devStudentAuth

`devStudentAuth` (server/middleware/devStudentAuth.ts) es el mecanismo **temporal de desarrollo**.

### Qué cambia en Fase 4

| Ruta | Middleware antes | Middleware después |
|------|------------------|--------------------|
| `GET /me/access` | `devStudentAuth` | `realStudentAuth` |
| `GET /me/dashboard` | `devStudentAuth` | `realStudentAuth` |
| `GET /me/path` | `devStudentAuth` | `realStudentAuth` |
| `POST /dev/activate-semestral` | `devStudentAuth` | `devStudentAuth` (conservado) |
| `POST /dev/logout` | — | — (reemplazado por `/auth/logout`) |
| `POST /dev/login` | nuevo | `devStudentAuth` (emite JWT para Carlos) |

### Invariante de compatibilidad dev

Carlos (alumno seeded, `carlos@gmusic.academy`) debe seguir accediendo a Mi Estudio en desarrollo. El flujo tras Fase 4:

1. `POST /api/v1/dev/login` → servidor busca a Carlos por `GMUSIC_DEV_USER_EMAIL`, emite `gmusic_session` JWT
2. `GET /me/*` con cookie `gmusic_session` → `realStudentAuth` resuelve a Carlos
3. Carlos tiene Subscription ACTIVE → `canAccessStudentZone: true` → Mi Estudio funciona

**Regla:** `devStudentAuth` no se elimina del codebase en Fase 4. Se mantiene en `/dev/*` routes y se conserva como middleware del `devRouter`.

### Qué NO hace `realStudentAuth`

- No tiene fallback a `GMUSIC_DEV_USER_EMAIL`
- No acepta cookies `gmusic_dev_student_email`
- Si no hay cookie `gmusic_session` válida → 401 inmediato

---

## 3. Estados de publicSession

El hook `usePublicStudentSession` expone `status` al frontend. Después de Fase 4 hay 4 estados:

| Estado | Condición HTTP | Causa | CTA en AcademiaSection |
|--------|---------------|-------|------------------------|
| `loading` | — | Cargando | — |
| `anonymous` | 401 (sin cookie válida) | Sin cuenta ni sesión | Según progreso demo |
| `registered_no_sub` | 200 + `canAccessStudentZone: false` | Cuenta creada, sin suscripción activa | "Completar mi suscripción" → `inscripcion-pendiente` |
| `authenticated` | 200 + `canAccessStudentZone: true` | Suscripción ACTIVE vigente | "Entrar a mi academia" → `mi-estudio` |

### Mapeo en `loadPublicStudentSessionOnce`

```typescript
// Caso nuevo Fase 4:
if (!data.access.canAccessStudentZone) {
  return { type: "registered_no_sub", user: data.user };
}
// (antes devolvía type: "anonymous" siempre — cambio quirúrgico)
```

### Tipo `PublicStudentSessionState`

```typescript
type PublicStudentSessionState =
  | { status: "loading" }
  | { status: "anonymous" }
  | { status: "registered_no_sub"; user: AccessUser }  // nuevo
  | { status: "authenticated"; user: AccessUser; subscription: AccessSubscription }
  | { status: "error"; message: string };
```

### `useDemoUserState` — tabla completa

| `publicSession.status` | Progreso demo | Label | Destino |
|------------------------|--------------|-------|---------|
| `authenticated` | cualquiera | "Entrar a mi academia" | `mi-estudio` |
| `registered_no_sub` | cualquiera | "Completar mi suscripción" | `inscripcion-pendiente` |
| `anonymous` o `error` | demo completo (≥5) | "Inscribirme para continuar" | `inscripcion-gate` |
| `anonymous` o `error` | demo iniciado (1-4) | "Continuar clase gratuita" | `mi-camino-demo` |
| `anonymous` o `error` | sin progreso (0) | "Ver clase gratuita" | `mi-camino-demo` |

**Regla crítica:** Un alumno con suscripción activa nunca ve "Ver clase gratuita" como CTA principal.

---

## 4. Campos de User y DemoProgress

### Campos nuevos en User (todos nullable — no rompen datos existentes)

| Campo | Tipo Prisma | Nullable | Descripción |
|-------|-------------|----------|-------------|
| `passwordHash` | `String?` | Sí | bcrypt hash. Null para usuarios seeded sin contraseña |
| `lastName` | `String?` | Sí | Apellido del alumno |
| `username` | `String? @unique` | Sí | Handle único de display |
| `phone` | `String?` | Sí | Teléfono / WhatsApp |
| `weeklyDedication` | `String?` | Sí | Opción seleccionada ("1-2h", "3-5h", "5h+") |
| `intendedPlanId` | `String?` | Sí | Plan elegido antes de pagar. Para Fase 5 |

**Regla crítica:** `passwordHash` nunca sale por ningún endpoint público. `buildAccessResponse`, `buildDashboardResponse` y `buildPathResponse` no incluyen este campo. Verificar en code review.

### Modelo DemoProgress (nuevo)

```prisma
model DemoProgress {
  id           String   @id @default(uuid())
  userId       String
  lessonNumber Int      // 1..5
  completedAt  DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, lessonNumber])
  @@index([userId])
}
```

### `intendedPlanId` vs `Subscription.planId`

| Campo | Tabla | Cuándo se escribe | Quién lo activa |
|-------|-------|-------------------|-----------------|
| `intendedPlanId` | User | Al registrarse (Fase 4) | `registerService` |
| `planId` | Subscription | Al confirmar pago (Fase 5) | webhook de Flow |

**Son dos campos distintos.** `intendedPlanId` es solo una intención del usuario. La suscripción real la crea exclusivamente el webhook de pago en Fase 5.

---

## 5. Flujo de registro

### Secuencia completa

```
[InscripcionRegistroPage]
  ↓ usuario completa formulario
  ↓ validación frontend (client-side, no confiable)
  ↓
POST /api/v1/auth/register
  Body: {
    firstName, lastName, username, email, phone,
    password, weeklyDedication,
    planId,              ← leído de localStorage, validado en servidor
    demoProgress: [1..5] ← leído de localStorage, validado en servidor
  }
  ↓
[registerService]
  1. Validar body (parseRegisterBody)
  2. Verificar unicidad de email → 409 si duplicado
  3. Verificar unicidad de username → 409 si duplicado
  4. Validar planId contra lista del servidor (no confiar en frontend)
  5. Validar demoProgress: array de Int 1-5, sin duplicados, max 5 elementos
  6. bcrypt.hash(password, 10) → passwordHash
  7. prisma.$transaction:
       a. crear User (con passwordHash, intendedPlanId, campos nuevos)
       b. insertar DemoProgress records
  8. signJwt({ sub: user.id }) → token
  ↓
Response 201:
  Set-Cookie: gmusic_session=<JWT>; HttpOnly; SameSite=Strict; Path=/api/v1; Max-Age=28800
  Body: { user: { id, name, email } }  ← nunca incluir passwordHash
  ↓
[Frontend]
  publicSession.refresh()
  → GET /me/access → 200 + canAccessStudentZone: false
  → publicSession.status = "registered_no_sub"
  → navegar a "inscripcion-pendiente"
```

### Logout

```
POST /api/v1/auth/logout
  → Set-Cookie: gmusic_session=; Max-Age=0; HttpOnly; SameSite=Strict; Path=/api/v1
  → 204
```

### Casos de error del registro

| Condición | HTTP | Código |
|-----------|------|--------|
| Email ya existe | 409 | `EMAIL_TAKEN` |
| Username ya existe | 409 | `USERNAME_TAKEN` |
| planId inválido | 422 | `INVALID_PLAN` |
| demoProgress inválido | 422 | `INVALID_DEMO_PROGRESS` |
| Contraseña muy corta (< 8) | 422 | `WEAK_PASSWORD` |
| Body malformado | 400 | `VALIDATION_ERROR` |

---

## 6. Reglas de seguridad (no negociables)

1. **JWT en httpOnly cookie.** Nunca devolver el token en el body de la respuesta; nunca leerlo desde JavaScript del frontend.

2. **Payload del JWT = userId únicamente.** El campo `sub` es el UUID del User. Nunca incluir email, rol, ni plan en el JWT.

3. **JWT_SECRET obligatorio.** Si no está en las env vars y `NODE_ENV !== "development"`, el servidor no debe arrancar. Lanzar `Error("JWT_SECRET no configurada")` antes de llamar al primer `listen()`.

4. **bcrypt mínimo 10 rounds.** No reducir por performance. No usar md5, sha1 ni ningún algoritmo de hash no diseñado para contraseñas.

5. **`passwordHash` nunca sale por API pública.** Todos los selectores de Prisma que devuelven datos de usuario (`buildAccessResponse`, etc.) deben usar `select` explícito sin incluir `passwordHash`. Verificar con `grep -r passwordHash server/services/`.

6. **El frontend nunca activa suscripciones.** El body de `POST /auth/register` no crea ningún registro en la tabla `Subscription`. Solo crea `User` y `DemoProgress`.

7. **`registerService` nunca crea una `Subscription` activa.** La única forma de crear una Subscription es vía webhook de Flow (Fase 5). Si se detecta código en `registerService` que toca `prisma.subscription`, es un bug crítico.

8. **Estado post-registro = `registered_no_sub` o `payment_pending`, nunca `subscribed_active`.** El flujo de registro termina sin Subscription. `GET /me/access` devolverá `canAccessStudentZone: false` correctamente.

9. **`StudentZoneGuard` no desbloquea sin suscripción activa.** El Guard usa `useStudentAccess` → `GET /me/access` → `canAccessStudentZone`. Un usuario `registered_no_sub` obtiene `canAccessStudentZone: false` → `status: "denied"` → redirige a home. No se modifica el Guard.

10. **El modo dev de Carlos no se rompe.** La secuencia `POST /dev/login → GET /me/access` debe seguir funcionando después de que `meRouter` use `realStudentAuth`. Carlos tiene Subscription ACTIVE → accede a Mi Estudio. Tests de integración deben cubrir este flujo.

---

## 7. Archivos protegidos

Estos archivos NO se deben modificar sin leer este Skill y declararlo explícitamente:

| Archivo | Por qué está protegido |
|---------|------------------------|
| `server/middleware/devStudentAuth.ts` | Conservar intacto; solo meRouter lo reemplaza |
| `server/lib/devStudentCookie.ts` | Conservar para /dev/* routes; no eliminar |
| `server/lib/studentAccess.ts` | Lógica de acceso correcta; no modificar |
| `server/services/accessService.ts` | No incluir passwordHash; no modificar lógica de acceso |
| `src/app/components/gmusic/StudentZoneGuard.tsx` | Comportamiento ya correcto; no modificar |
| `src/app/hooks/useStudentAccess.ts` | No modificar; lógica correcta |
| `src/app/services/gmusic-api/access.ts` | Modificación quirúrgica solo para `registered_no_sub` |
| `src/app/services/gmusic-api/public-student-session.ts` | Modificación quirúrgica solo para nuevo estado |

**Archivos que SÍ se tocan en Fase 4 (requieren declarar este Skill):**

- `server/routes/me.ts` — cambiar middleware
- `server/routes/auth.ts` — nuevo
- `server/middleware/realStudentAuth.ts` — nuevo
- `server/lib/jwtSession.ts` — nuevo
- `server/services/registerService.ts` — nuevo
- `server/config.ts` — agregar `jwtSecret`
- `prisma/schema.prisma` — campos nuevos + DemoProgress
- `src/app/services/gmusic-api/public-student-session.ts` — nuevo estado
- `src/app/services/gmusic-api/access.ts` — assertValidAccessResponse
- `src/app/hooks/useDemoUserState.ts` — nuevo branch
- `src/app/pages/InscripcionRegistroPage.tsx` — reemplazar placeholder
- `src/app/pages/InscripcionPendientePage.tsx` — nuevo

---

## 8. Relación con Fase 5

Fase 4 deja preparado para Fase 5 (Flow + Resend):

| Qué deja Fase 4 | Cómo lo usa Fase 5 |
|-----------------|---------------------|
| `User.intendedPlanId` | Webhook Flow lee el plan para crear Subscription |
| `DemoProgress` en DB | Path real puede mostrar nodos del demo ya completados |
| Estado `registered_no_sub` en frontend | `InscripcionPendientePage` tiene CTA de pago (Fase 5) |
| `gmusic_session` JWT en cookie | Webhook no lo necesita, pero el frontend ya puede autenticarse |
| `POST /auth/logout` | Fase 5 no cambia el logout |

**Lo que Fase 5 AGREGA (fuera del scope de Fase 4):**
- Webhook `POST /api/v1/webhooks/flow` → `activateSubscriptionService` → crea Subscription ACTIVE
- Email de bienvenida vía Resend
- `InscripcionPendientePage` → CTA real de pago que llama a Flow
- Nuevo estado `subscribed_active` en frontend (cuando `canAccessStudentZone: true`)

**Regla de transición:** El webhook de Flow es la **única** forma de crear un registro en `Subscription`. Si en Fase 5 se detecta que `registerService` o cualquier otro handler crea una Subscription, es un bug de seguridad.

---

## 9. Compatibilidad con devStudentAuth

### Invariante

> Después de Fase 4, `POST /dev/login → GET /me/access → Mi Estudio` funciona para Carlos en desarrollo.

### Flujo de Carlos post-Fase 4

```
POST /api/v1/dev/login
  (devActivationGate: bloquea si !GMUSIC_DEV_ACTIVATION_KEY o NODE_ENV=production)
  → busca user por GMUSIC_DEV_USER_EMAIL
  → signJwt({ sub: user.id })
  → Set-Cookie: gmusic_session=<JWT>; HttpOnly; ...
  → 200 { user: { id, name, email } }

GET /api/v1/me/access
  → realStudentAuth lee gmusic_session cookie
  → jwt.verify → payload.sub = Carlos.id
  → prisma.user.findUnique → Carlos (STUDENT, tiene Subscription ACTIVE)
  → buildAccessResponse → canAccessStudentZone: true
  → frontend: publicSession.status = "authenticated" → Mi Estudio
```

### Qué NO cambia para Carlos

- `GET /me/dashboard`, `GET /me/path` — siguen funcionando vía `gmusic_session`
- Datos seeded (XP, racha, módulos) — no se tocan
- `POST /dev/activate-semestral` — sigue usando `devStudentAuth`

### Por qué se conserva devStudentAuth

`devStudentAuth` sigue siendo el middleware de `/dev/*` routes porque:
1. `/dev/login` mismo necesita verificar `GMUSIC_DEV_ACTIVATION_KEY`
2. `/dev/activate-semestral` usa el `devActivationGate` + `devStudentAuth` — arquitectura que no cambia hasta Fase 5

---

## 10. QA mínima

### Backend (node:test con DB real)

1. `POST /auth/register` → 201 + cookie `gmusic_session` presente
2. `POST /auth/register` email duplicado → 409 `EMAIL_TAKEN`
3. `POST /auth/register` username duplicado → 409 `USERNAME_TAKEN`
4. `POST /auth/register` planId inválido → 422 `INVALID_PLAN`
5. `POST /auth/register` demoProgress con número > 5 → 422 `INVALID_DEMO_PROGRESS`
6. `POST /auth/register` nunca crea registro en Subscription
7. `GET /me/access` con cookie de usuario sin Subscription → 200 + `canAccessStudentZone: false`
8. `GET /me/access` sin cookie → 401
9. `GET /me/access` con JWT expirado → 401
10. `POST /auth/logout` → 204 + cookie expirada (Max-Age=0)
11. `POST /dev/login` → 200 + cookie `gmusic_session` → `GET /me/access` → `canAccessStudentZone: true` (Carlos)

### Frontend (src/app, fuente-level)

12. `publicSession` con respuesta 200 + `canAccessStudentZone: false` → `status: "registered_no_sub"`
13. `useDemoUserState` con `registered_no_sub` → label "Completar mi suscripción", destino `inscripcion-pendiente`
14. `useDemoUserState` con `authenticated` → label "Entrar a mi academia"
15. `InscripcionRegistroPage` incluye todos los campos requeridos en el formulario
16. `registerService` envía `demoProgress` leído de localStorage `gmusic:demo_v1`
17. `registerService` envía `planId` leído de localStorage `gmusic:selected_plan_v1`
18. Ningún selector en `buildAccessResponse` devuelve `passwordHash`

### Regresión

19. `npm run app:test` — 351+ tests pasando, 0 fallos después de cambios de frontend
20. `npm run api:test` (o equivalente) — todos los tests de servidor pasando
21. TypeScript limpio en frontend y backend
22. `grep -r passwordHash server/services/` → sin resultados en respuestas de API
