import { requireSession } from "@/src/shared/application/session";
import { backendFetch } from "@/src/shared/infrastructure/backend";
import type { Product } from "@/src/shared/domain/types";
import { Badge, Empty } from "@/src/shared/presentation/ui";
import { ProductForm } from "@/src/modules/admin/presentation/ProductForm";

export default async function Products() {
  await requireSession("ADMIN");
  const rows = await backendFetch<Product[]>("/api/admin/products");
  return (
    <>
      <div className="section-header">
        <div>
          <h1>Productos financieros</h1>
          <div className="sub">
            Configura límites y costos de Compra Inteligente.
          </div>
        </div>
        <ProductForm />
      </div>

      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Catálogo de productos</div>
            <div className="card-sub">{rows.length} productos configurados</div>
          </div>
        </div>
        {rows.length ? (
          <div className="table-wrap">
            <table className="t">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Plazo</th>
                  <th>Balón permitido</th>
                  <th>Gracia</th>
                  <th className="num">Portes</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((x) => (
                  <tr key={x.id}>
                    <td className="fw-600" style={{ color: "var(--text-primary)" }}>
                      {x.name}
                    </td>
                    <td>
                      {x.minTerm}–{x.maxTerm} meses
                    </td>
                    <td>
                      {(x.minBalloonPct * 100).toFixed(0)}%–
                      {(x.maxBalloonPct * 100).toFixed(0)}%
                    </td>
                    <td>{x.maxGraceMonths} meses</td>
                    <td className="num">S/ {x.postage.toFixed(2)}</td>
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
          <Empty>No hay productos configurados.</Empty>
        )}
      </div>
    </>
  );
}
