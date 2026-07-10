import { backendFetch } from "@/src/shared/infrastructure/backend";
import type { Installment, Simulation } from "@/src/shared/domain/types";
import { money, moneyByCurrency, percent } from "@/src/shared/presentation/format";
import { Indicator, KV } from "@/src/shared/presentation/ui";
import { Download } from "lucide-react";

export default async function LoanDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const x = await backendFetch<Simulation>(`/api/loans/${id}/schedule`);
  const schedule: Installment[] = x.schedule ?? [];
  return (
    <>
      <div className="section-header">
        <div>
          <h1>Plan de pagos</h1>
          <div className="sub">Préstamo {id.slice(0, 8).toUpperCase()}</div>
        </div>
        <a href={`/api/backend/loans/${id}/report`} className="btn btn-primary">
          <Download /> Descargar PDF
        </a>
      </div>

      <div className="four-col mb-24">
        <Indicator label="Cuota base" sub="mensual" value={money.format(x.basePayment)} tone="navy" />
        <Indicator label="Balón final" sub="pago final" value={money.format(x.balloonAmount)} tone="warning" />
        <Indicator label="TCEA" sub="costo efectivo" value={percent(x.tcea)} tone="action" />
        <Indicator label="Total pagado" sub="durante el plazo" value={money.format(x.totalPaid)} tone="navy" />
      </div>

      <div className="card card-pad mb-24">
        <div className="card-title mb-12">Moneda y condiciones congeladas</div>
        <div className="grid gap-12 md:grid-cols-2">
          <KV k="Precio original" v={moneyByCurrency(x.vehiclePriceOriginal, x.currency)} />
          <KV k="Tipo de cambio usado" v={`S/ ${x.exchangeRate.toFixed(4)}`} />
          <KV k="Precio equivalente PEN" v={money.format(x.vehiclePricePen)} />
          <KV k="Moneda de cálculo" v="PEN" />
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Cronograma de pagos</div>
            <div className="card-sub">{schedule.length} cuotas</div>
          </div>
        </div>
        <div className="table-wrap" style={{ maxHeight: 560, overflowY: "auto" }}>
          <table className="t amort-table">
            <thead style={{ position: "sticky", top: 0, zIndex: 1 }}>
              <tr>
                <th>N°</th>
                <th className="num">Saldo inicial</th>
                <th className="num">Interés</th>
                <th className="num">Amortización</th>
                <th className="num">Balón</th>
                <th className="num">Cuota total</th>
                <th className="num">Saldo final</th>
              </tr>
            </thead>
            <tbody>
              {schedule.map((i) => (
                <tr key={i.number}>
                  <td className="fw-600">{String(i.number).padStart(2, "0")}</td>
                  <td className="num">{money.format(i.openingBalance)}</td>
                  <td className="num">{money.format(i.interest)}</td>
                  <td className="num">{money.format(i.amortization)}</td>
                  <td className="num">{money.format(i.balloon)}</td>
                  <td className="num fw-600" style={{ color: "var(--text-primary)" }}>
                    {money.format(i.totalPayment)}
                  </td>
                  <td className="num">{money.format(i.closingBalance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
