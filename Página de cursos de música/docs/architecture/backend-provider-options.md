# Backend Provider Options — Gmusic MVP

Comparación breve para elegir dónde hospedar **PostgreSQL** del motor de aprendizaje.  
Contexto: Prisma + Node.js + REST. **Fase actual:** documentación y schema; aún **sin conexión a base real**.

Referencias: `learning-engine.md`, `database-schema.md`, skill `gmusic-learning-engine`.

---

## Criterios Gmusic

| Criterio | Peso MVP |
|----------|----------|
| PostgreSQL nativo (Prisma) | Obligatorio |
| Migraciones `prisma migrate` | Obligatorio |
| Costo bajo / free tier | Alto |
| Setup rápido para desarrollo | Alto |
| Auth incluido | Medio (MVP puede usar JWT propio después) |
| Región / latencia Chile | Medio |
| Portabilidad (evitar lock-in) | Alto |

---

## Opciones

### Supabase

**Qué es:** PostgreSQL gestionado + Auth, Storage, Realtime y SDK.

| Pros | Contras |
|------|---------|
| PostgreSQL real con URL estándar para Prisma | Realtime/Auth de Supabase no son necesarios en MVP REST |
| Free tier generoso para prototipo | Tentación de mezclar lógica en RLS/Edge Functions |
| Dashboard SQL, backups, branches (plan pago) | Vendor coupling si se usa Auth/Storage como core |
| Buena DX para equipos pequeños | Latencia depende de región elegida al crear proyecto |

**Encaje Gmusic:** Bueno si quieres **solo la base** y mantener el backend Node/Prisma separado. Usar Supabase como **host Postgres**, no como backend principal.

**DATABASE_URL ejemplo:** `postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres`

---

### Neon

**Qué es:** PostgreSQL serverless con branching, scale-to-zero y pooling.

| Pros | Contras |
|------|---------|
| Pensado para Prisma y serverless | Cold start / sleep en free tier |
| Branches de DB por PR (útil más adelante) | Menos extras (sin Auth/Storage integrados) |
| Connection pooling incluido | Límites de compute en free |
| SQL estándar, poco lock-in | |

**Encaje Gmusic:** Muy bueno para **MVP web + Prisma**. Base limpia sin features que compitan con tu API REST.

**DATABASE_URL ejemplo:** `postgresql://[user]:[password]@[endpoint]-pooler.neon.tech/[db]?sslmode=require`

---

### Railway

**Qué es:** Plataforma para deploy de servicios (API Node, Postgres, Redis) con un solo proyecto.

| Pros | Contras |
|------|---------|
| Postgres + API Node en un mismo lugar | Free tier limitado / créditos mensuales |
| Deploy desde GitHub sencillo | Menos especializado en DB que Neon/Supabase |
| Variables de entorno unificadas | Costo puede subir con tráfico |
| Bueno cuando backend y DB van juntos | |

**Encaje Gmusic:** Bueno si el **backend MVP** (Express/Fastify) y Postgres viven en el mismo proveedor desde el día uno.

**DATABASE_URL:** generada automáticamente al provisionar plugin PostgreSQL en Railway.

---

### Docker local

**Qué es:** PostgreSQL en contenedor en tu máquina (`docker compose`).

| Pros | Contras |
|------|---------|
| Cero costo, offline, control total | No compartible con equipo sin más setup |
| Ideal para `prisma migrate` y seeds locales | Tú gestionas backups y versiones |
| Sin cold starts | No sirve para demo/staging sin otro host |
| Misma URL en `.env` para todos los devs (con compose) | Requiere Docker instalado |

**Encaje Gmusic:** **Recomendado para fase 1** mientras no conectes producción. Permite validar schema, seeds y endpoints mock sin cuenta cloud.

**DATABASE_URL ejemplo:** `postgresql://gmusic:gmusic@localhost:5432/gmusic_dev`

---

## Matriz resumida

| | Supabase | Neon | Railway | Docker local |
|---|:---:|:---:|:---:|:---:|
| PostgreSQL + Prisma | ✓ | ✓ | ✓ | ✓ |
| Setup rápido dev | ✓ | ✓ | ✓ | ✓✓ |
| Free tier MVP | ✓ | ✓ | ~ | ✓✓ |
| Sin vendor lock-in (solo DB) | ~ | ✓✓ | ✓ | ✓✓ |
| Deploy API mismo proveedor | — | — | ✓✓ | — |
| Branches de DB | pago | ✓ | — | manual |
| Auth incluido | ✓ | — | — | — |
| Offline / sin cloud | — | — | — | ✓✓ |

---

## Recomendación por fase

| Fase | Proveedor sugerido | Motivo |
|------|-------------------|--------|
| **Ahora** (schema, contrato API, mocks) | **Docker local** | Sin dependencias cloud; `DATABASE_URL` en `.env` local cuando toque migrar |
| **Staging / primer deploy** | **Neon** o **Railway** | Neon si priorizas DB; Railway si despliegas API + DB juntos |
| **Producción temprana** | **Neon** + API en Railway/Vercel | Separar compute y datos; Prisma en Node |
| **Si más adelante necesitas Auth/Storage** | Evaluar **Supabase** solo para esos módulos | Mantener motor de aprendizaje en API propia |

---

## Decisión pendiente (no bloqueante)

No hace falta elegir proveedor para continuar con:

- `prisma/schema.prisma` ✓
- `docs/architecture/api-contract.md`
- Endpoints mock in-memory o fixtures JSON

La elección importa cuando ejecutes:

```bash
npx prisma migrate dev
npx prisma db seed
```

---

## Variables de entorno (referencia futura)

```env
# Solo documentación — no commitear secretos
DATABASE_URL=postgresql://...
# Opcional según proveedor
DIRECT_URL=postgresql://...   # Neon/Supabase: migraciones sin pooler
```

---

## Enlaces

- [Supabase — Database](https://supabase.com/docs/guides/database)
- [Neon — Prisma](https://neon.tech/docs/guides/prisma)
- [Railway — PostgreSQL](https://docs.railway.app/databases/postgresql)
- [Prisma — PostgreSQL](https://www.prisma.io/docs/orm/overview/databases/postgresql)
