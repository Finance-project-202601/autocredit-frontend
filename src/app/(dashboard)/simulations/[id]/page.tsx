import { backendFetch } from "@/src/shared/infrastructure/backend";
import type { Simulation } from "@/src/shared/domain/types";
import { money, percent, date } from "@/src/shared/presentation/format";
export default async function Detail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const x = await backendFetch<Simulation>(`/api/simulations/${id}`);
  return (
    <>
      <div className="page-title">
        <h1>Resultado de simulación</h1>
        <p>
          {date(x.createdAt)} · <span className="badge">{x.status}</span>
        </p>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-3 xl:grid-cols-6">
        {[
          ["Monto financiado", money.format(x.financedAmount)],
          ["Cuota base", money.format(x.basePayment)],
          ["Cuota balón", money.format(x.balloonAmount)],
          ["TEM", percent(x.monthlyRate)],
          ["TCEA", percent(x.tcea)],
          ["VAN", money.format(x.npv)],
        ].map(([a, b]) => (
          <div className="card metric" key={a}>
            <small>{a}</small>
            <strong>{b}</strong>
          </div>
        ))}
      </div>
      <section className="card mt-6">
        <div className="p-5">
          <h2 className="font-bold">Cronograma de pagos</h2>
          <p className="help mt-1">
            Incluye intereses, seguros, portes y cuota balón.
          </p>
        </div>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>N°</th>
                <th>Estado</th>
                <th>Saldo inicial</th>
                <th>Interés</th>
                <th>Amortización</th>
                <th>Seguros</th>
                <th>Portes</th>
                <th>Balón</th>
                <th>Cuota total</th>
                <th>Saldo final</th>
              </tr>
            </thead>
            <tbody>
              {x.schedule?.map((i) => (
                <tr key={i.number}>
                  <td>{i.number}</td>
                  <td>{i.state}</td>
                  <td>{money.format(i.openingBalance)}</td>
                  <td>{money.format(i.interest)}</td>
                  <td>{money.format(i.amortization)}</td>
                  <td>{money.format(i.lifeInsurance + i.vehicleInsurance)}</td>
                  <td>{money.format(i.postage)}</td>
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
      </section>
    </>
  );
}
