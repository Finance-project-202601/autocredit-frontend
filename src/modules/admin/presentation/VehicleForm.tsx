"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
export function VehicleForm() {
  const [open, setOpen] = useState(false),
    router = useRouter();
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget),
      body = {
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
      {
        <button onClick={() => setOpen(!open)} className="btn btn-primary">
          Nuevo vehículo
        </button>
      }
      {open && (
        <form
          onSubmit={submit}
          className="card mt-5 grid gap-3 p-5 md:grid-cols-3"
        >
          <Input name="brand" label="Marca" />
          <Input name="model" label="Modelo" />
          <Input name="year" label="Año" type="number" />
          <Input name="price" label="Precio S/" type="number" />
          <Input name="sku" label="SKU" />
          <div className="field">
            <label>Condición</label>
            <select name="condition">
              <option value="NEW">Nuevo</option>
              <option value="USED">Usado</option>
            </select>
          </div>
          <div className="md:col-span-3 flex justify-end">
            <button className="btn btn-primary">Guardar</button>
          </div>
        </form>
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
      <input required name={name} type={type} />
    </div>
  );
}
