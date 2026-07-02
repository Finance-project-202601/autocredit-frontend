import { requireSession } from "@/src/shared/application/session";
import { backendFetch } from "@/src/shared/infrastructure/backend";
import type { Vehicle } from "@/src/shared/domain/types";
import { money } from "@/src/shared/presentation/format";
import { VehicleForm } from "@/src/modules/admin/presentation/VehicleForm";
export default async function AdminVehicles() {
  await requireSession("ADMIN");
  const rows = await backendFetch<Vehicle[]>("/api/admin/vehicles");
  return (
    <>
      <div className="flex items-end justify-between">
        <div className="page-title">
          <h1>Vehículos</h1>
          <p>Administra el catálogo disponible.</p>
        </div>
        <VehicleForm />
      </div>
      <div className="card table-wrap mt-6">
        <table className="data-table">
          <thead>
            <tr>
              <th>SKU</th>
              <th>Vehículo</th>
              <th>Año</th>
              <th>Precio</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((x) => (
              <tr key={x.id}>
                <td>{x.sku}</td>
                <td>
                  {x.brand} {x.model}
                </td>
                <td>{x.modelYear}</td>
                <td>{money.format(x.price)}</td>
                <td>
                  <span className="badge">
                    {x.active ? "Activo" : "Inactivo"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
