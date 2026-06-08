export const SESSION_TTL_MS = 3 * 60 * 60 * 1000;

export function sessionExpiresAt(startedAt: Date): Date {
  return new Date(startedAt.getTime() + SESSION_TTL_MS);
}

export function isSessionExpired(startedAt: Date, now: Date = new Date()): boolean {
  return now.getTime() >= sessionExpiresAt(startedAt).getTime();
}
