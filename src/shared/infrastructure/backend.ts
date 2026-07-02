import "server-only";
import { cookies } from "next/headers";
const base = process.env.BACKEND_URL ?? "http://localhost:8080";
export async function backendFetch<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const token = (await cookies()).get("autocredit_session")?.value;
  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (init.body && !headers.has("Content-Type"))
    headers.set("Content-Type", "application/json");
  const response = await fetch(`${base}${path}`, {
    ...init,
    headers,
    cache: "no-store",
  });
  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: "No se pudo completar la operación" }));
    throw new Error(error.message ?? "Error de AutoCredit");
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}
