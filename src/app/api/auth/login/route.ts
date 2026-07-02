import { NextResponse } from "next/server";
const base = process.env.BACKEND_URL ?? "http://localhost:8080";
export async function POST(request: Request) {
  const response = await fetch(`${base}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: await request.text(),
  });
  const data = await response
    .json()
    .catch(() => ({ message: "Credenciales inválidas" }));
  if (!response.ok) return NextResponse.json(data, { status: response.status });
  const out = NextResponse.json({
    userId: data.userId,
    email: data.email,
    role: data.role,
  });
  out.cookies.set("autocredit_session", data.accessToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: data.expiresIn,
  });
  return out;
}
