/** Display label for the logged-in user — email only, never username or full name. */
export function getUserEmail(user: { email?: string } | null | undefined): string {
  return user?.email?.trim() ?? "";
}

/** Initials derived from email (e.g. infonet20th@gmail.com → "IN"). */
export function getEmailInitials(email: string): string {
  const local = email.split("@")[0] ?? "";
  if (!local) return "?";
  return local.slice(0, 2).toUpperCase();
}
