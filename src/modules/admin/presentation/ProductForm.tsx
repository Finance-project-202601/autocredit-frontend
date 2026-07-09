"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";

export function ProductForm() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const num = (x: string) => Number(f.get(x));
    const body = {
      name: f.get("name"),
      minTerm: num("minTerm"),
      maxTerm: num("maxTerm"),
      minBalloonPct: num("minBalloon") / 100,
      maxBalloonPct: num("maxBalloon") / 100,
      maxGraceMonths: num("grace"),
      lifeInsuranceRate: num("life") / 100,
      vehicleInsuranceRate: num("vehicle") / 100,
      postage: num("postage"),
      active: true,
    };
    const r = await fetch("/api/backend/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (r.ok) {
      setOpen(false);
      router.refresh();
    } else alert((await r.json()).message);
  }
  return (
    <>
      <button onClick={() => setOpen(true)} className="btn btn-primary">
        <Plus /> Nuevo producto
      </button>
      {open && (
        <div className="modal-overlay" onClick={() => setOpen(false)}>
          <form
            className="modal"
            onClick={(e) => e.stopPropagation()}
            onSubmit={submit}
          >
            <div className="modal-header">
              <div className="card-title">Nuevo producto financiero</div>
              <button
                type="button"
                className="icon-btn"
                onClick={() => setOpen(false)}
                aria-label="Cerrar"
              >
                <X style={{ width: 16, height: 16 }} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-row-single" style={{ marginBottom: 18 }}>
                <F n="name" l="Nombre" t="text" v="Compra Inteligente PEN" />
              </div>
              <div className="form-row form-row-3">
                <F n="minTerm" l="Plazo mínimo (meses)" v="12" />
                <F n="maxTerm" l="Plazo máximo (meses)" v="84" />
                <F n="grace" l="Gracia máxima (meses)" v="12" />
              </div>
              <div className="form-row">
                <F n="minBalloon" l="Balón mínimo (%)" v="20" />
                <F n="maxBalloon" l="Balón máximo (%)" v="50" />
              </div>
              <div className="form-row form-row-3">
                <F n="life" l="Desgravamen mensual (%)" v="0.028" />
                <F n="vehicle" l="Seguro vehicular mensual (%)" v="0.3" />
                <F n="postage" l="Portes (S/)" v="10" />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setOpen(false)}
              >
                Cancelar
              </button>
              <button className="btn btn-primary">Guardar producto</button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

function F({
  n,
  l,
  v,
  t = "number",
}: {
  n: string;
  l: string;
  v: string;
  t?: string;
}) {
  return (
    <div className="field">
      <label>{l}</label>
      <input
        required
        name={n}
        type={t}
        step="0.001"
        className="input"
        defaultValue={v}
      />
    </div>
  );
}
