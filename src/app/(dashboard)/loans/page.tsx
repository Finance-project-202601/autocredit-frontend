import Link from "next/link";
import { backendFetch } from "@/src/shared/infrastructure/backend";
import type { Loan } from "@/src/shared/domain/types";
import { date } from "@/src/shared/presentation/format";
import { StatusBadge, Empty } from "@/src/shared/presentation/ui";
import { FileText } from "lucide-react";

export default async function Loans() {
  const rows = await backendFetch<Loan[]>("/api/loans");
  return (
    <>
      <div className="section-header">
        <div>
          <h1>Mis préstamos</h1>
          <div className="sub">
            Consulta condiciones aprobadas y descarga tu plan de pagos.
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Préstamos formalizados</div>
            <div className="card-sub">
              {rows.length} {rows.length === 1 ? "préstamo" : "préstamos"}
            </div>
          </div>
        </div>
        {rows.length ? (
          <div className="table-wrap">
            <table className="t">
              <thead>
                <tr>
                  <th>Préstamo</th>
                  <th>Aprobación</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((x) => (
                  <tr key={x.id}>
                    <td className="fw-600" style={{ color: "var(--text-primary)" }}>
                      {x.id.slice(0, 8).toUpperCase()}
                    </td>
                    <td className="muted">{date(x.approvedAt)}</td>
                    <td>
                      <StatusBadge status={x.status} />
                    </td>
                    <td>
                      <div className="flex-gap-12">
                        <Link className="fw-600 action-text" href={`/loans/${x.id}`}>
                          Cronograma
                        </Link>
                        <a
                          className="fw-600 action-text"
                          style={{ display: "inline-flex", alignItems: "center", gap: 4 }}
                          href={`/api/backend/loans/${x.id}/report`}
                        >
                          <FileText style={{ width: 14, height: 14 }} /> PDF
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <Empty>Todavía no tienes préstamos aprobados.</Empty>
        )}
      </div>
    </>
  );
}
