import { requireSession } from "@/src/shared/application/session";
import { backendFetch } from "@/src/shared/infrastructure/backend";
import type { Simulation } from "@/src/shared/domain/types";
import { money, percent, date } from "@/src/shared/presentation/format";
import { StatusBadge, Empty } from "@/src/shared/presentation/ui";
import { ApproveButton } from "@/src/modules/admin/presentation/ApproveButton";

export default async function Approvals() {
  await requireSession("ADMIN");
  const rows = await backendFetch<Simulation[]>("/api/simulations");
  const pending = rows.filter((x) => x.status === "DRAFT").length;
  return (
    <>
      <div className="section-header">
        <div>
          <h1>Aprobaciones</h1>
          <div className="sub">Revisa y formaliza simulaciones de clientes.</div>
        </div>
        <span className="badge warning">
          <span className="dot" />
          {pending} pendientes
        </span>
      </div>

      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Solicitudes de crédito</div>
            <div className="card-sub">{rows.length} operaciones en total</div>
          </div>
        </div>
        {rows.length ? (
          <div className="table-wrap">
            <table className="t">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th className="num">Financiado</th>
                  <th className="num">Cuota</th>
                  <th className="num">Balón</th>
                  <th className="num">TCEA</th>
                  <th>Estado</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((x) => (
                  <tr key={x.id}>
                    <td className="muted">{date(x.createdAt)}</td>
                    <td className="num fw-600">{money.format(x.financedAmount)}</td>
                    <td className="num">{money.format(x.basePayment)}</td>
                    <td className="num">{money.format(x.balloonAmount)}</td>
                    <td className="num">{percent(x.tcea)}</td>
                    <td>
                      <StatusBadge status={x.status} />
                    </td>
                    <td className="num">
                      <ApproveButton id={x.id} disabled={x.status !== "DRAFT"} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <Empty>No hay simulaciones registradas.</Empty>
        )}
      </div>
    </>
  );
}
