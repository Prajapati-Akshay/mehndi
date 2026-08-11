// Isomorphic error types shared between the server (src/domain/booking.ts, API routes) and
// the client repos (src/services/*.repo.ts), so callers can keep using `instanceof` checks
// the same way they did when everything ran against Dexie in-process.
export class BookingValidationError extends Error {}
export class BookingConflictError extends Error {}
export class NotFoundError extends Error {}

export type ApiErrorCode = 'VALIDATION' | 'CONFLICT' | 'NOT_FOUND' | 'UNAUTHORIZED' | 'INTERNAL';

export function errorToApiCode(err: unknown): ApiErrorCode {
  if (err instanceof BookingValidationError) return 'VALIDATION';
  if (err instanceof BookingConflictError) return 'CONFLICT';
  if (err instanceof NotFoundError) return 'NOT_FOUND';
  return 'INTERNAL';
}

/** Reconstructs the right error class client-side from an API error response body. */
export function apiErrorFromCode(code: string | undefined, message: string): Error {
  if (code === 'VALIDATION') return new BookingValidationError(message);
  if (code === 'CONFLICT') return new BookingConflictError(message);
  if (code === 'NOT_FOUND') return new NotFoundError(message);
  return new Error(message);
}
