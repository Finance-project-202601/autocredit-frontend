import { backendFetch } from "@/src/shared/infrastructure/backend";
import type { Simulation } from "@/src/shared/domain/types";
import { money, percent } from "@/src/shared/presentation/format";
export default async function LoanDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const x = await backendFetch<Simulation>(`/api/loans/${id}/schedule`);
  return (
    <>
      <div className="flex items-end justify-between">
        <div className="page-title">
          <h1>Plan de pagos</h1>
          <p>Préstamo {id.slice(0, 8).toUpperCase()}</p>
        </div>
        <a href={`/api/backend/loans/${id}/report`} className="btn btn-primary">
          Descargar PDF
        </a>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-4">
        <div className="card metric">
          <small>Cuota base</small>
          <strong>{money.format(x.basePayment)}</strong>
        </div>
        <div className="card metric">
          <small>Balón final</small>
          <strong>{money.format(x.balloonAmount)}</strong>
        </div>
        <div className="card metric">
          <small>TCEA</small>
          <strong>{percent(x.tcea)}</strong>
        </div>
        <div className="card metric">
          <small>Total pagado</small>
          <strong>{money.format(x.totalPaid)}</strong>
        </div>
      </div>
      <div className="card table-wrap mt-6">
        <table className="data-table">
          <thead>
            <tr>
              <th>N°</th>
              <th>Saldo inicial</th>
              <th>Interés</th>
              <th>Amortización</th>
              <th>Balón</th>
              <th>Cuota total</th>
              <th>Saldo final</th>
            </tr>
          </thead>
          <tbody>
            {x.schedule?.map((i) => (
              <tr key={i.number}>
                <td>{i.number}</td>
                <td>{money.format(i.openingBalance)}</td>
                <td>{money.format(i.interest)}</td>
                <td>{money.format(i.amortization)}</td>
                <td>{money.format(i.balloon)}</td>
                <td>
                  <b>{money.format(i.totalPayment)}</b>
                </td>
                <td>{money.format(i.closingBalance)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
