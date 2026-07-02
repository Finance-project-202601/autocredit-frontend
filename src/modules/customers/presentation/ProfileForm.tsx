"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
export function ProfileForm({
  initial,
}: {
  initial?: Record<string, string | number>;
}) {
  const [message, setMessage] = useState("");
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
    setMessage(
      r.ok
        ? "Perfil guardado correctamente"
        : (data.message ?? "No se pudo guardar"),
    );
    if (r.ok) router.refresh();
  }
  return (
    <form onSubmit={submit} className="card mt-6 grid gap-4 p-6 md:grid-cols-2">
      {message && (
        <div className="md:col-span-2 rounded-lg bg-blue-50 p-3 text-sm text-blue-800">
          {message}
        </div>
      )}
      <Field name="dni" label="DNI" maxLength={8} value={initial?.dni} />
      <Field name="firstName" label="Nombres" value={initial?.firstName} />
      <Field name="lastName" label="Apellidos" value={initial?.lastName} />
      <Field
        name="birthDate"
        label="Fecha de nacimiento"
        type="date"
        value={initial?.birthDate}
      />
      <Field name="phone" label="Teléfono" value={initial?.phone} />
      <Field
        name="monthlyIncome"
        label="Ingreso mensual (S/)"
        type="number"
        value={initial?.monthlyIncome}
      />
      <div className="field md:col-span-2">
        <label>Dirección</label>
        <input required name="address" defaultValue={initial?.address} />
      </div>
      <div className="md:col-span-2 flex justify-end">
        <button className="btn btn-primary">Guardar perfil</button>
      </div>
    </form>
  );
}
function Field({
  name,
  label,
  type = "text",
  value,
  maxLength,
}: {
  name: string;
  label: string;
  type?: string;
  value?: string | number;
  maxLength?: number;
}) {
  return (
    <div className="field">
      <label>{label}</label>
      <input
        required
        name={name}
        type={type}
        maxLength={maxLength}
        min={type === "number" ? 1 : undefined}
        defaultValue={value}
      />
    </div>
  );
}
