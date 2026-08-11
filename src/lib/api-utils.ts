import { NextResponse } from 'next/server';
import { errorToApiCode } from './errors';

export function jsonError(err: unknown, fallbackStatus = 500) {
  const message = err instanceof Error ? err.message : 'Something went wrong';
  const code = errorToApiCode(err);
  const status = code === 'VALIDATION' ? 400 : code === 'CONFLICT' ? 409 : code === 'NOT_FOUND' ? 404 : code === 'UNAUTHORIZED' ? 401 : fallbackStatus;
  return NextResponse.json({ error: message, code }, { status });
}
