import { requireSession } from "@/src/shared/application/session";
import { backendFetch } from "@/src/shared/infrastructure/backend";
import { date } from "@/src/shared/presentation/format";
import { Badge, Empty } from "@/src/shared/presentation/ui";

type Audit = {
  id: string;
  actorId?: string;
  action: string;
  aggregateType: string;
  aggregateId?: string;
  details?: string;
  occurredAt: string;
};

export default async function Audit() {
  await requireSession("ADMIN");
  const rows = await backendFetch<Audit[]>("/api/admin/audit");
  return (
    <>
      <div className="section-header">
        <div>
          <h1>Auditoría</h1>
          <div className="sub">Trazabilidad de operaciones relevantes.</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Bitácora de actividad</div>
            <div className="card-sub">{rows.length} eventos registrados</div>
          </div>
        </div>
        {rows.length ? (
          <div className="table-wrap">
            <table className="t">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Acción</th>
                  <th>Entidad</th>
                  <th>Detalle</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((x) => (
                  <tr key={x.id}>
                    <td className="muted">{date(x.occurredAt)}</td>
                    <td>
                      <Badge tone="action">{x.action}</Badge>
                    </td>
                    <td className="fw-600" style={{ color: "var(--text-primary)" }}>
                      {x.aggregateType}
                    </td>
                    <td className="muted">{x.details ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <Empty>No hay eventos de auditoría.</Empty>
        )}
      </div>
    </>
  );
}
