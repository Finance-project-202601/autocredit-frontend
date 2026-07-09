"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LoaderCircle } from "lucide-react";
import { HelpTip } from "@/src/shared/presentation/HelpTip";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError("");
    const form = new FormData(e.currentTarget);
    const body = {
      email: String(form.get("email")),
      password: String(form.get("password")),
    };
    try {
      const r = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.message ?? "No se pudo continuar");
      if (mode === "register") {
        const login = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!login.ok)
          throw new Error("Cuenta creada. Inicia sesión para continuar.");
      }
      router.replace("/dashboard");
      router.refresh();
    } catch (x) {
      setError(x instanceof Error ? x.message : "Ocurrió un error");
    } finally {
      setPending(false);
    }
  }
  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: 28,
          }}
        >
          <div
            className="brand-logo"
            style={{ width: 48, height: 48, borderRadius: 12, marginBottom: 14 }}
          >
            <svg
              viewBox="0 0 24 24"
              width="24"
              height="24"
              fill="none"
              stroke="white"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 13l1.5-4a2 2 0 0 1 2-1.5h7a2 2 0 0 1 2 1.5L19 13" />
              <path d="M3 13h18v5a1 1 0 0 1-1 1h-2v-2H6v2H4a1 1 0 0 1-1-1z" />
            </svg>
          </div>
          <div className="fw-700 navy-text" style={{ fontSize: 20 }}>
            AutoCredit
          </div>
          <div className="muted" style={{ fontSize: 13, marginTop: 4 }}>
            {mode === "login"
              ? "Inicia sesión en tu cuenta"
              : "Crea tu cuenta para empezar a simular"}
          </div>
        </div>

        <div className="card card-pad" style={{ padding: 28 }}>
          <form className="stack gap-16" onSubmit={submit}>
            {error && <div className="alert alert-error">{error}</div>}
            <div className="field">
              <div className="label-row">
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <label htmlFor="auth-email">Correo electrónico</label>
                  <HelpTip below width={230}>
                    <span>
                      <strong>Correo.</strong> Usa un correo válido; será tu
                      usuario para iniciar sesión en AutoCredit.
                    </span>
                  </HelpTip>
                </span>
              </div>
              <input
                id="auth-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="input"
              />
            </div>
            <div className="field">
              <div className="label-row">
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <label htmlFor="auth-password">Contraseña</label>
                  <HelpTip below width={230}>
                    <span>
                      <strong>Contraseña.</strong> Mínimo 8 caracteres. Combina
                      letras y números para mayor seguridad.
                    </span>
                  </HelpTip>
                </span>
                <span className="hint">Mínimo 8 caracteres</span>
              </div>
              <input
                id="auth-password"
                name="password"
                type="password"
                minLength={8}
                required
                autoComplete={
                  mode === "login" ? "current-password" : "new-password"
                }
                className="input"
              />
            </div>
            <button
              type="submit"
              disabled={pending}
              className="btn btn-primary btn-lg btn-block"
            >
              {pending ? <LoaderCircle className="animate-spin" size={18} /> : null}
              {mode === "login" ? "Iniciar sesión" : "Crear cuenta"}
            </button>
          </form>
        </div>

        <p
          className="muted"
          style={{ textAlign: "center", marginTop: 18, fontSize: 13 }}
        >
          {mode === "login" ? "¿Aún no tienes cuenta? " : "¿Ya tienes cuenta? "}
          <Link
            className="fw-600 action-text"
            href={mode === "login" ? "/register" : "/login"}
          >
            {mode === "login" ? "Regístrate" : "Ingresa"}
          </Link>
        </p>
      </div>
    </div>
  );
}
