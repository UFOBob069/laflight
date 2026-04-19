/** Emails allowed to use /admin and /api/admin/trigger. */
export const ADMIN_EMAILS = [
  'david.eagan@gmail.com',
  'admin@bestlaxdeals.com',
] as const;

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return (ADMIN_EMAILS as readonly string[]).includes(email.toLowerCase());
}
