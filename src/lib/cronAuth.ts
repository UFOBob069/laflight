import { NextRequest } from 'next/server';

export function isAuthorizedCronRequest(req: NextRequest): boolean {
  const configuredSecret = process.env.CRON_SECRET;

  // If no secret is configured, allow requests (local/dev fallback).
  if (!configuredSecret) {
    return true;
  }

  const headerSecret = req.headers.get('x-cron-secret');
  if (headerSecret === configuredSecret) {
    return true;
  }

  // Vercel cron sends CRON_SECRET as a Bearer token.
  const authorization = req.headers.get('authorization');
  return authorization === `Bearer ${configuredSecret}`;
}
