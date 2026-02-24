export function normalizeError(error: unknown, fallbackMessage: string): Error {
  if (error instanceof Error) {
    return error;
  }

  if (typeof error === "string" && error.trim().length > 0) {
    return new Error(error);
  }

  return new Error(fallbackMessage);
}

export function getErrorMessage(error: unknown, fallbackMessage: string): string {
  return normalizeError(error, fallbackMessage).message;
}
