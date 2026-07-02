import Link from "next/link";
import { backendFetch } from "@/src/shared/infrastructure/backend";
import type { Vehicle } from "@/src/shared/domain/types";
import { money } from "@/src/shared/presentation/format";
import { CarFront } from "lucide-react";
export default async function Vehicles() {
  const vehicles = await backendFetch<Vehicle[]>("/api/vehicles");
  return (
    <>
      <div className="page-title">
        <h1>Vehículos disponibles</h1>
        <p>Elige un vehículo para iniciar tu simulación.</p>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {vehicles.map((v) => (
          <article className="card overflow-hidden" key={v.id}>
            <div className="grid h-36 place-items-center bg-gradient-to-br from-slate-100 to-blue-50 text-blue-700">
              <CarFront size={64} />
            </div>
            <div className="p-5">
              <span className="badge">
                {v.condition === "NEW" ? "Nuevo" : "Usado"}
              </span>
              <h2 className="mt-3 text-lg font-bold">
                {v.brand} {v.model}
              </h2>
              <p className="text-sm text-slate-500">
                {v.modelYear} · {v.sku}
              </p>
              <strong className="mt-4 block text-xl">
                {money.format(v.price)}
              </strong>
              <Link
                href={`/simulations/new?vehicle=${v.id}`}
                className="btn btn-primary mt-4 w-full"
              >
                Simular este vehículo
              </Link>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
