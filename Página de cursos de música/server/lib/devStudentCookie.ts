import { createHmac, timingSafeEqual } from "node:crypto";
import { isDevActivationKeyConfigured } from "./devActivationGate.js";

export const DEV_STUDENT_COOKIE_NAME = "gmusic_dev_student_email";
export const DEV_STUDENT_COOKIE_PATH = "/api/v1";
export const DEV_STUDENT_COOKIE_MAX_AGE_SECONDS = 28800;
export const DEV_STUDENT_EMAIL_MAX_LENGTH = 254;
export const DEV_STUDENT_COOKIE_SIGNATURE_HEX_LENGTH = 64;
export const DEV_STUDENT_COOKIE_MAX_PAYLOAD_LENGTH = 400;
export const DEV_STUDENT_SESSION_LOGGED_OUT_BODY = "logged_out";
export const DEV_STUDENT_SESSION_STUDENT_PREFIX = "student:";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SIGNATURE_HEX_RE = /^[a-f0-9]{64}$/;

export type DevStudentSessionPayload =
  | { kind: "student"; email: string }
  | { kind: "logged_out" };

function normalizeDevStudentEmail(email: string): string | null {
  const normalized = email.trim().toLowerCase();
  if (!normalized || normalized.length > DEV_STUDENT_EMAIL_MAX_LENGTH) return null;
  if (!EMAIL_RE.test(normalized)) return null;
  return normalized;
}

export function parseCookieHeader(header: string | undefined): Map<string, string> {
  const cookies = new Map<string, string>();
  if (!header) return cookies;

  for (const segment of header.split(";")) {
    const trimmed = segment.trim();
    if (!trimmed) continue;

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex <= 0) continue;

    const name = trimmed.slice(0, separatorIndex).trim();
    const rawValue = trimmed.slice(separatorIndex + 1).trim();
    if (!name) continue;

    cookies.set(name, rawValue);
  }

  return cookies;
}

function computeSessionSignature(body: string, signingKey: string): string {
  return createHmac("sha256", signingKey).update(body).digest("hex");
}

function signaturesMatch(expectedHex: string, providedHex: string): boolean {
  if (!SIGNATURE_HEX_RE.test(expectedHex) || !SIGNATURE_HEX_RE.test(providedHex)) {
    return false;
  }

  const expectedBuffer = Buffer.from(expectedHex, "hex");
  const providedBuffer = Buffer.from(providedHex, "hex");
  if (expectedBuffer.length !== providedBuffer.length) return false;
  return timingSafeEqual(expectedBuffer, providedBuffer);
}

function sessionBodyFromPayload(payload: DevStudentSessionPayload): string {
  if (payload.kind === "logged_out") {
    return DEV_STUDENT_SESSION_LOGGED_OUT_BODY;
  }

  const normalized = normalizeDevStudentEmail(payload.email);
  if (!normalized) {
    throw new Error("Email inválido para firmar cookie de sesión de desarrollo.");
  }

  return `${DEV_STUDENT_SESSION_STUDENT_PREFIX}${normalized}`;
}

export function signDevStudentSessionPayload(
  payload: DevStudentSessionPayload,
  signingKey: string
): string {
  const body = sessionBodyFromPayload(payload);
  const signature = computeSessionSignature(body, signingKey);
  return `${body}.${signature}`;
}

/** @deprecated Usar signDevStudentSessionPayload({ kind: "student", email }, key). */
export function signDevStudentCookiePayload(email: string, signingKey: string): string {
  return signDevStudentSessionPayload({ kind: "student", email }, signingKey);
}

export function verifyDevStudentSessionPayload(
  rawPayload: string,
  signingKey: string
): DevStudentSessionPayload | null {
  if (!rawPayload || rawPayload.length > DEV_STUDENT_COOKIE_MAX_PAYLOAD_LENGTH) {
    return null;
  }

  if (rawPayload.length <= DEV_STUDENT_COOKIE_SIGNATURE_HEX_LENGTH + 1) {
    return null;
  }

  const separatorIndex = rawPayload.length - DEV_STUDENT_COOKIE_SIGNATURE_HEX_LENGTH - 1;
  if (rawPayload.charAt(separatorIndex) !== ".") {
    return null;
  }

  const body = rawPayload.slice(0, separatorIndex);
  const signature = rawPayload.slice(separatorIndex + 1);
  const expectedSignature = computeSessionSignature(body, signingKey);

  if (!signaturesMatch(expectedSignature, signature)) {
    return null;
  }

  if (body === DEV_STUDENT_SESSION_LOGGED_OUT_BODY) {
    return { kind: "logged_out" };
  }

  if (!body.startsWith(DEV_STUDENT_SESSION_STUDENT_PREFIX)) {
    return null;
  }

  const email = body.slice(DEV_STUDENT_SESSION_STUDENT_PREFIX.length);
  const normalized = normalizeDevStudentEmail(email);
  if (!normalized) return null;

  return { kind: "student", email: normalized };
}

/** @deprecated Usar verifyDevStudentSessionPayload. */
export function verifyDevStudentCookiePayload(
  rawPayload: string,
  signingKey: string
): string | null {
  const payload = verifyDevStudentSessionPayload(rawPayload, signingKey);
  if (!payload || payload.kind !== "student") return null;
  return payload.email;
}

function decodeCookieRawValue(rawValue: string): string | null {
  if (!rawValue) return null;

  try {
    return decodeURIComponent(rawValue);
  } catch {
    return null;
  }
}

export type DevStudentSessionResolution =
  | { kind: "student"; email: string }
  | { kind: "logged_out" }
  | { kind: "invalid_cookie" }
  | { kind: "fallback" };

/** @deprecated Usar resolveDevStudentSession. */
export type DevStudentEmailResolution =
  | { kind: "resolved"; email: string }
  | { kind: "invalid_cookie" }
  | { kind: "fallback" };

export function resolveDevStudentSession(
  cookieHeader: string | undefined
): DevStudentSessionResolution {
  const cookies = parseCookieHeader(cookieHeader);
  if (!cookies.has(DEV_STUDENT_COOKIE_NAME)) {
    return { kind: "fallback" };
  }

  const signingKey = process.env.GMUSIC_DEV_ACTIVATION_KEY;
  if (!isDevActivationKeyConfigured(signingKey)) {
    return { kind: "invalid_cookie" };
  }

  const payload = decodeCookieRawValue(cookies.get(DEV_STUDENT_COOKIE_NAME) ?? "");
  if (!payload) {
    return { kind: "invalid_cookie" };
  }

  const session = verifyDevStudentSessionPayload(payload, signingKey);
  if (!session) {
    return { kind: "invalid_cookie" };
  }

  if (session.kind === "logged_out") {
    return { kind: "logged_out" };
  }

  return { kind: "student", email: session.email };
}

/** @deprecated Usar resolveDevStudentSession. */
export function resolveDevStudentEmail(
  cookieHeader: string | undefined
): DevStudentEmailResolution {
  const resolution = resolveDevStudentSession(cookieHeader);
  if (resolution.kind === "student") {
    return { kind: "resolved", email: resolution.email };
  }
  if (resolution.kind === "logged_out") {
    return { kind: "invalid_cookie" };
  }
  return resolution;
}

function buildSignedSessionCookie(payload: DevStudentSessionPayload): string {
  const signingKey = process.env.GMUSIC_DEV_ACTIVATION_KEY;
  if (!isDevActivationKeyConfigured(signingKey)) {
    throw new Error("GMUSIC_DEV_ACTIVATION_KEY no está configurada para emitir sesión.");
  }

  const signedPayload = signDevStudentSessionPayload(payload, signingKey);
  const encoded = encodeURIComponent(signedPayload);
  return `${DEV_STUDENT_COOKIE_NAME}=${encoded}; HttpOnly; SameSite=Strict; Path=${DEV_STUDENT_COOKIE_PATH}; Max-Age=${DEV_STUDENT_COOKIE_MAX_AGE_SECONDS}`;
}

export function buildDevStudentSessionCookie(email: string): string {
  return buildSignedSessionCookie({ kind: "student", email });
}

export function buildDevStudentLoggedOutSessionCookie(): string {
  return buildSignedSessionCookie({ kind: "logged_out" });
}

export function buildDevStudentCookieHeaderValue(
  email: string,
  signingKey: string
): string {
  return encodeURIComponent(
    signDevStudentSessionPayload({ kind: "student", email }, signingKey)
  );
}

export function buildDevStudentLoggedOutCookieHeaderValue(signingKey: string): string {
  return encodeURIComponent(
    signDevStudentSessionPayload({ kind: "logged_out" }, signingKey)
  );
}
