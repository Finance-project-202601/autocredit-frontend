import Link from "next/link";
import { backendFetch } from "@/src/shared/infrastructure/backend";
import type { Simulation } from "@/src/shared/domain/types";
import { money, percent, date } from "@/src/shared/presentation/format";
import { StatusBadge, Empty } from "@/src/shared/presentation/ui";
import { Calculator, ChevronRight } from "lucide-react";

export default async function Simulations() {
  const rows = await backendFetch<Simulation[]>("/api/simulations");
  return (
    <>
      <div className="section-header">
        <div>
          <h1>Mis simulaciones</h1>
          <div className="sub">Compara tus escenarios de financiamiento.</div>
        </div>
        <Link href="/simulations/new" className="btn btn-primary">
          <Calculator /> Nueva simulación
        </Link>
      </div>

      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Historial de simulaciones</div>
            <div className="card-sub">
              {rows.length} {rows.length === 1 ? "simulación" : "simulaciones"} · ordenadas por fecha
            </div>
          </div>
        </div>
        {rows.length ? (
          <div className="table-wrap">
            <table className="t">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th className="num">Monto</th>
                  <th className="num">Cuota base</th>
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
                      <Link
                        className="fw-600 action-text"
                        style={{ display: "inline-flex", alignItems: "center", gap: 4 }}
                        href={`/simulations/${x.id}`}
                      >
                        Ver detalle <ChevronRight style={{ width: 14, height: 14 }} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <Empty>Aún no tienes simulaciones.</Empty>
        )}
      </div>
    </>
  );
}
