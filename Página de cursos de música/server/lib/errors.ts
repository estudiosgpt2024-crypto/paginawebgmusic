export type ApiErrorCode =
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "COURSE_NOT_FOUND"
  | "VALIDATION_ERROR"
  | "INVALID_NODE"
  | "INTERNAL_ERROR";

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: ApiErrorCode,
    message: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function errorBody(code: ApiErrorCode, message: string) {
  return { error: { code, message } };
}
