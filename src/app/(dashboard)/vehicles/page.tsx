import Link from "next/link";
import { backendFetch } from "@/src/shared/infrastructure/backend";
import type { Vehicle } from "@/src/shared/domain/types";
import { money } from "@/src/shared/presentation/format";
import { Badge } from "@/src/shared/presentation/ui";
import { CarFront } from "lucide-react";

export default async function Vehicles() {
  const vehicles = await backendFetch<Vehicle[]>("/api/vehicles");
  return (
    <>
      <div className="section-header">
        <div>
          <h1>Vehículos disponibles</h1>
          <div className="sub">
            Elige un vehículo para iniciar tu simulación de crédito.
          </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gap: 18,
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
        }}
      >
        {vehicles.map((v) => (
          <article
            key={v.id}
            className="card"
            style={{ overflow: "hidden", display: "flex", flexDirection: "column" }}
          >
            <div className="vehicle-hero">
              <CarFront size={60} />
            </div>
            <div className="card-pad" style={{ display: "flex", flexDirection: "column", flex: 1 }}>
              <Badge tone={v.condition === "NEW" ? "action" : "muted"}>
                {v.condition === "NEW" ? "Nuevo" : "Usado"}
              </Badge>
              <h2
                style={{
                  marginTop: 12,
                  fontSize: 17,
                  fontWeight: 700,
                  color: "var(--text-primary)",
                }}
              >
                {v.brand} {v.model}
              </h2>
              <div className="tiny muted mt-4">
                {v.modelYear} · SKU {v.sku}
              </div>
              <strong
                className="tnum"
                style={{
                  marginTop: 14,
                  fontSize: 20,
                  color: "var(--text-primary)",
                }}
              >
                {money.format(v.price)}
              </strong>
              <Link
                href={`/simulations/new?vehicle=${v.id}`}
                className="btn btn-primary btn-block"
                style={{ marginTop: 16 }}
              >
                Simular este vehículo
              </Link>
            </div>
          </article>
        ))}
      </div>

      {!vehicles.length && (
        <div className="card">
          <div className="empty">No hay vehículos en el catálogo.</div>
        </div>
      )}
    </>
  );
}
