import { redirect } from "next/navigation";
import { backendFetch } from "../infrastructure/backend";
import type { Session } from "../domain/types";
export async function getSession() {
  try {
    return await backendFetch<Session>("/api/auth/session");
  } catch {
    return null;
  }
}
export async function requireSession(role?: "ADMIN") {
  const session = await getSession();
  if (!session) redirect("/login");
  if (role && session.role !== role) redirect("/dashboard");
  return session;
}
