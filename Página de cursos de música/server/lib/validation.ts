import { ApiError } from "./errors.js";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function parseLessonSessionBody(body: unknown): { nodeId: string } {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw new ApiError(400, "VALIDATION_ERROR", "nodeId es requerido.");
  }

  const nodeId = (body as { nodeId?: unknown }).nodeId;

  if (typeof nodeId !== "string" || !UUID_RE.test(nodeId)) {
    throw new ApiError(400, "VALIDATION_ERROR", "nodeId debe ser un UUID válido.");
  }

  return { nodeId };
}
