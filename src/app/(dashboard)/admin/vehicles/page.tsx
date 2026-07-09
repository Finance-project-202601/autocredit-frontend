import { requireSession } from "@/src/shared/application/session";
import { backendFetch } from "@/src/shared/infrastructure/backend";
import type { Vehicle } from "@/src/shared/domain/types";
import { money } from "@/src/shared/presentation/format";
import { Badge, Empty } from "@/src/shared/presentation/ui";
import { VehicleForm } from "@/src/modules/admin/presentation/VehicleForm";

export default async function AdminVehicles() {
  await requireSession("ADMIN");
  const rows = await backendFetch<Vehicle[]>("/api/admin/vehicles");
  return (
    <>
      <div className="section-header">
        <div>
          <h1>Vehículos</h1>
          <div className="sub">Administra el catálogo disponible.</div>
        </div>
        <VehicleForm />
      </div>

      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Catálogo vehicular</div>
            <div className="card-sub">{rows.length} unidades registradas</div>
          </div>
        </div>
        {rows.length ? (
          <div className="table-wrap">
            <table className="t">
              <thead>
                <tr>
                  <th>SKU</th>
                  <th>Vehículo</th>
                  <th>Año</th>
                  <th className="num">Precio</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((x) => (
                  <tr key={x.id}>
                    <td className="fw-600 tnum" style={{ color: "var(--text-primary)" }}>
                      {x.sku}
                    </td>
                    <td>
                      {x.brand} {x.model}
                    </td>
                    <td>{x.modelYear}</td>
                    <td className="num fw-600">{money.format(x.price)}</td>
                    <td>
                      <Badge tone={x.active ? "success" : "muted"}>
                        {x.active ? "Activo" : "Inactivo"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <Empty>No hay vehículos registrados.</Empty>
        )}
      </div>
    </>
  );
}
