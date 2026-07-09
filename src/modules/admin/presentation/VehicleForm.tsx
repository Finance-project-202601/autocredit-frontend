"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";

export function VehicleForm() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const body = {
      brand: f.get("brand"),
      model: f.get("model"),
      modelYear: Number(f.get("year")),
      condition: f.get("condition"),
      price: Number(f.get("price")),
      plate: null,
      sku: f.get("sku"),
      mileage: 0,
      active: true,
    };
    const r = await fetch("/api/backend/admin/vehicles", {
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
        <Plus /> Nuevo vehículo
      </button>
      {open && (
        <div className="modal-overlay" onClick={() => setOpen(false)}>
          <form
            className="modal"
            onClick={(e) => e.stopPropagation()}
            onSubmit={submit}
          >
            <div className="modal-header">
              <div className="card-title">Registrar vehículo</div>
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
              <div className="form-row">
                <Input name="brand" label="Marca" />
                <Input name="model" label="Modelo" />
              </div>
              <div className="form-row form-row-3">
                <Input name="year" label="Año" type="number" />
                <Input name="price" label="Precio (S/)" type="number" />
                <Input name="sku" label="SKU" />
              </div>
              <div className="form-row-single">
                <div className="field">
                  <label>Condición</label>
                  <select name="condition" className="select">
                    <option value="NEW">Nuevo</option>
                    <option value="USED">Usado</option>
                  </select>
                </div>
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
              <button className="btn btn-primary">Guardar vehículo</button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

function Input({
  name,
  label,
  type = "text",
}: {
  name: string;
  label: string;
  type?: string;
}) {
  return (
    <div className="field">
      <label>{label}</label>
      <input required name={name} type={type} className="input" />
    </div>
  );
}
