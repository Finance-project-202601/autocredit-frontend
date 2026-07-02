import Link from "next/link";
import { backendFetch } from "@/src/shared/infrastructure/backend";
import type { Simulation } from "@/src/shared/domain/types";
import { money, percent, date } from "@/src/shared/presentation/format";
export default async function Simulations() {
  const rows = await backendFetch<Simulation[]>("/api/simulations");
  return (
    <>
      <div className="flex items-end justify-between">
        <div className="page-title">
          <h1>Mis simulaciones</h1>
          <p>Compara tus escenarios de financiamiento.</p>
        </div>
        <Link href="/simulations/new" className="btn btn-primary">
          Nueva simulación
        </Link>
      </div>
      <div className="card table-wrap mt-6">
        <table className="data-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Monto</th>
              <th>Cuota base</th>
              <th>Balón</th>
              <th>TCEA</th>
              <th>Estado</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((x) => (
              <tr key={x.id}>
                <td>{date(x.createdAt)}</td>
                <td>{money.format(x.financedAmount)}</td>
                <td>{money.format(x.basePayment)}</td>
                <td>{money.format(x.balloonAmount)}</td>
                <td>{percent(x.tcea)}</td>
                <td>
                  <span className="badge">{x.status}</span>
                </td>
                <td>
                  <Link
                    className="font-semibold text-blue-700"
                    href={`/simulations/${x.id}`}
                  >
                    Ver detalle
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!rows.length && (
          <div className="py-14 text-center text-slate-500">
            Aún no tienes simulaciones.
          </div>
        )}
      </div>
    </>
  );
}
