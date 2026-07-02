import { requireSession } from "@/src/shared/application/session";
import { backendFetch } from "@/src/shared/infrastructure/backend";
import type { Product } from "@/src/shared/domain/types";
import { ProductForm } from "@/src/modules/admin/presentation/ProductForm";
export default async function Products() {
  await requireSession("ADMIN");
  const rows = await backendFetch<Product[]>("/api/admin/products");
  return (
    <>
      <div className="flex items-end justify-between">
        <div className="page-title">
          <h1>Productos financieros</h1>
          <p>Configura límites y costos de Compra Inteligente.</p>
        </div>
        <ProductForm />
      </div>
      <div className="card table-wrap mt-6">
        <table className="data-table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Plazo</th>
              <th>Balón permitido</th>
              <th>Gracia</th>
              <th>Portes</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((x) => (
              <tr key={x.id}>
                <td>{x.name}</td>
                <td>
                  {x.minTerm}–{x.maxTerm} meses
                </td>
                <td>
                  {x.minBalloonPct * 100}%–{x.maxBalloonPct * 100}%
                </td>
                <td>{x.maxGraceMonths} meses</td>
                <td>S/ {x.postage.toFixed(2)}</td>
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
