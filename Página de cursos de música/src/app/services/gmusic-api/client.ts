import type { ApiErrorBody } from "./types";

export class GmusicApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code: string
  ) {
    super(message);
    this.name = "GmusicApiError";
  }
}

export function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === "AbortError";
}

export async function apiGet<T>(
  path: string,
  options?: { signal?: AbortSignal }
): Promise<T> {
  const response = await fetch(path, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
    signal: options?.signal,
  });

  if (!response.ok) {
    let code = "INTERNAL_ERROR";
    let message = `Error ${response.status} al consultar la API.`;

    try {
      const body = (await response.json()) as ApiErrorBody;
      if (body.error?.code) code = body.error.code;
      if (body.error?.message) message = body.error.message;
    } catch {
      // Respuesta no JSON; mantener mensaje genérico.
    }

    throw new GmusicApiError(message, response.status, code);
  }

  return (await response.json()) as T;
}
