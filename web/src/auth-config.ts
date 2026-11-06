export function accountRole(
  appMetadata: Record<string, unknown> | undefined,
): "student" | "instructor" {
  return appMetadata?.role === "instructor" ? "instructor" : "student";
}
export function accountStorageKey(userId: string | null) {
  return userId ? `kaizen-account:${userId}` : "kaizen-demo-v3";
}
export function validateNewPassword(password: string, confirmation?: string) {
  if (password.length < 8) return "Use a password with at least 8 characters.";
  if (password.length > 128)
    return "Use a password with no more than 128 characters.";
  if (confirmation !== undefined && password !== confirmation)
    return "The passwords do not match.";
  return "";
}
