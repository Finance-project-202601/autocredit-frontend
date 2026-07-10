"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ExchangeRate } from "@/src/shared/domain/types";

export function ExchangeRateForm({ rate }: { rate: ExchangeRate }) {
  const [value, setValue] = useState(rate.rateToPen.toFixed(4));
  const [pending, setPending] = useState(false);
  const router = useRouter();

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (
      !confirm(
        "¿Actualizar el tipo de cambio USD/PEN? Las simulaciones existentes conservarán el tipo de cambio congelado.",
      )
    )
      return;
    setPending(true);
    const r = await fetch("/api/backend/admin/exchange-rates/usd", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rateToPen: Number(value) }),
    });
    if (!r.ok)
      alert((await r.json().catch(() => ({}))).message ?? "No se pudo actualizar el tipo de cambio");
    setPending(false);
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="card card-pad">
      <div className="card-title mb-8">Tipo de cambio referencial</div>
      <div className="card-sub mb-16">
        Se usa para nuevas simulaciones en USD. Las simulaciones ya creadas conservan su TC congelado.
      </div>
      <div className="form-row">
        <div className="field">
          <label>USD → PEN</label>
          <div className="input-wrap">
            <span className="input-prefix">S/</span>
            <input
              className="input with-prefix"
              type="number"
              min="0.000001"
              step="0.000001"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="field">
          <label>Última actualización</label>
          <div className="input" style={{ background: "var(--bg)" }}>
            {new Intl.DateTimeFormat("es-PE", {
              dateStyle: "medium",
              timeStyle: "short",
            }).format(new Date(rate.updatedAt))}
          </div>
        </div>
      </div>
      <button className="btn btn-primary" disabled={pending}>
        {pending ? "Guardando…" : "Guardar tipo de cambio"}
      </button>
    </form>
  );
}
