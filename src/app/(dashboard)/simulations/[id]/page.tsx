import { backendFetch } from "@/src/shared/infrastructure/backend";
import type { Installment, Simulation } from "@/src/shared/domain/types";
import { money, percent, date } from "@/src/shared/presentation/format";
import { Indicator, StatusBadge } from "@/src/shared/presentation/ui";
import { HelpTip } from "@/src/shared/presentation/HelpTip";

function rowClass(state: string) {
  const s = state?.toUpperCase();
  if (s?.includes("TOTAL")) return "row-grace-total";
  if (s?.includes("PARTIAL") || s?.includes("PARCIAL")) return "row-grace-partial";
  if (s?.includes("BALLOON") || s?.includes("BALON")) return "row-upcoming";
  return "";
}

export default async function Detail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const x = await backendFetch<Simulation>(`/api/simulations/${id}`);
  const schedule: Installment[] = x.schedule ?? [];
  return (
    <>
      <div className="section-header">
        <div>
          <h1>Resultado de simulación</h1>
          <div className="sub" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {date(x.createdAt)} <StatusBadge status={x.status} />
          </div>
        </div>
      </div>

      <div className="six-col mb-24">
        <Indicator
          label="VAN"
          sub="valor actual neto"
          value={money.format(x.npv)}
          tone={x.npv >= 0 ? "success" : "error"}
          info={
            <span>
              <strong>Valor Actual Neto.</strong> Valor presente de los flujos
              descontados a la tasa de descuento.
            </span>
          }
        />
        <Indicator
          label="TIR (mensual)"
          sub="tasa interna"
          value={percent(x.monthlyIrr)}
          tone="action"
          info={
            <span>
              <strong>Tasa Interna de Retorno.</strong> Tasa mensual que iguala
              el VAN a cero.
            </span>
          }
        />
        <Indicator
          label="TCEA"
          sub="costo efectivo"
          value={percent(x.tcea)}
          tone="navy"
          info={
            <span>
              <strong>Tasa de Costo Efectivo Anual.</strong> Costo real del
              crédito incluyendo seguros y portes.
            </span>
          }
        />
        <Indicator
          label="Cuota base"
          sub="mensual"
          value={money.format(x.basePayment)}
          tone="navy"
        />
        <Indicator
          label="Cuota balón"
          sub="pago final"
          value={money.format(x.balloonAmount)}
          tone="warning"
        />
        <Indicator
          label="Financiado"
          sub={`TEM ${percent(x.monthlyRate)}`}
          value={money.format(x.financedAmount)}
          tone="navy"
        />
      </div>

      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title" style={{ display: "flex", alignItems: "center", gap: 7 }}>
              Cronograma de pagos
              <HelpTip below width={250}>
                <span>
                  <strong>Cronograma de pagos.</strong> Detalle cuota por cuota:
                  cómo cada pago se reparte entre interés y amortización hasta
                  saldar la deuda.
                </span>
              </HelpTip>
            </div>
            <div className="card-sub">
              {schedule.length} cuotas · incluye intereses, seguros, portes y
              cuota balón
            </div>
          </div>
        </div>
        <div className="table-wrap" style={{ maxHeight: 560, overflowY: "auto" }}>
          <table className="t amort-table">
            <thead style={{ position: "sticky", top: 0, zIndex: 1 }}>
              <tr>
                <th>N°</th>
                <th>Estado</th>
                <th className="num">Saldo inicial</th>
                <th className="num">Interés</th>
                <th className="num">Amortización</th>
                <th className="num">Seguros</th>
                <th className="num">Portes</th>
                <th className="num">Balón</th>
                <th className="num">Cuota total</th>
                <th className="num">Saldo final</th>
              </tr>
            </thead>
            <tbody>
              {schedule.map((i) => (
                <tr key={i.number} className={rowClass(i.state)}>
                  <td className="fw-600">{String(i.number).padStart(2, "0")}</td>
                  <td className="muted tiny">{i.state}</td>
                  <td className="num">{money.format(i.openingBalance)}</td>
                  <td className="num">{money.format(i.interest)}</td>
                  <td className="num">{money.format(i.amortization)}</td>
                  <td className="num">
                    {money.format(i.lifeInsurance + i.vehicleInsurance)}
                  </td>
                  <td className="num">{money.format(i.postage)}</td>
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
