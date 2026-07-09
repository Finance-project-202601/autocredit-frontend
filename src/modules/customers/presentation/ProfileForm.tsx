"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { HelpTip } from "@/src/shared/presentation/HelpTip";

export function ProfileForm({
  initial,
}: {
  initial?: Record<string, string | number>;
}) {
  const [message, setMessage] = useState("");
  const [ok, setOk] = useState(false);
  const router = useRouter();
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");
    const f = new FormData(e.currentTarget);
    const body = {
      dni: f.get("dni"),
      firstName: f.get("firstName"),
      lastName: f.get("lastName"),
      birthDate: f.get("birthDate"),
      phone: f.get("phone"),
      address: f.get("address"),
      monthlyIncome: Number(f.get("monthlyIncome")),
    };
    const r = await fetch("/api/backend/me", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await r.json().catch(() => ({}));
    setOk(r.ok);
    setMessage(
      r.ok
        ? "Perfil guardado correctamente"
        : (data.message ?? "No se pudo guardar"),
    );
    if (r.ok) router.refresh();
  }
  return (
    <div className="card">
      <div className="card-header">
        <div>
          <div className="card-title">Datos del titular</div>
          <div className="card-sub">
            Información personal y financiera asociada a tus créditos
          </div>
        </div>
      </div>
      <form onSubmit={submit} className="card-pad">
        {message && (
          <div
            className={`alert ${ok ? "alert-success" : "alert-error"} mb-16`}
          >
            {message}
          </div>
        )}
        <div className="form-row">
          <Field
            name="dni"
            label="DNI"
            maxLength={8}
            hint="8 dígitos"
            value={initial?.dni}
            help={
              <span>
                <strong>DNI.</strong> Documento Nacional de Identidad del
                titular: exactamente 8 dígitos.
              </span>
            }
          />
          <Field
            name="birthDate"
            label="Fecha de nacimiento"
            type="date"
            value={initial?.birthDate}
          />
        </div>
        <div className="form-row">
          <Field name="firstName" label="Nombres" value={initial?.firstName} />
          <Field name="lastName" label="Apellidos" value={initial?.lastName} />
        </div>
        <div className="form-row">
          <Field
            name="phone"
            label="Teléfono"
            value={initial?.phone}
          />
          <Field
            name="monthlyIncome"
            label="Ingreso mensual (S/)"
            type="number"
            value={initial?.monthlyIncome}
            help={
              <span>
                <strong>Ingreso mensual.</strong> Se usa para evaluar tu
                capacidad de pago frente a la cuota del crédito.
              </span>
            }
          />
        </div>
        <div className="form-row form-row-single">
          <div className="field">
            <label>Dirección</label>
            <input
              required
              name="address"
              className="input"
              defaultValue={initial?.address}
            />
          </div>
        </div>
        <div className="flex" style={{ justifyContent: "flex-end" }}>
          <button className="btn btn-primary">Guardar perfil</button>
        </div>
      </form>
    </div>
  );
}

function Field({
  name,
  label,
  type = "text",
  value,
  maxLength,
  hint,
  help,
}: {
  name: string;
  label: string;
  type?: string;
  value?: string | number;
  maxLength?: number;
  hint?: string;
  help?: React.ReactNode;
}) {
  return (
    <div className="field">
      <div className="label-row">
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <label>{label}</label>
          {help && <HelpTip>{help}</HelpTip>}
        </span>
        {hint && <span className="hint">{hint}</span>}
      </div>
      <input
        required
        name={name}
        type={type}
        maxLength={maxLength}
        min={type === "number" ? 1 : undefined}
        className="input"
        defaultValue={value}
      />
    </div>
  );
}
