import Link from "next/link";
import { requireSession } from "@/src/shared/application/session";
import { backendFetch } from "@/src/shared/infrastructure/backend";
import type { Installment, Simulation } from "@/src/shared/domain/types";
import { money, moneyByCurrency, percent, date } from "@/src/shared/presentation/format";
import { Indicator, StatusBadge, KV } from "@/src/shared/presentation/ui";
import { ApproveButton } from "@/src/modules/admin/presentation/ApproveButton";

function rowClass(state: string) {
  const s = state?.toUpperCase();
  if (s?.includes("TOTAL")) return "row-grace-total";
  if (s?.includes("PARTIAL") || s?.includes("PARCIAL")) return "row-grace-partial";
  return "";
}

export default async function AdminSimulationDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireSession("ADMIN");
  const { id } = await params;
  const x = await backendFetch<Simulation>(`/api/simulations/${id}`);
  const schedule: Installment[] = x.schedule ?? [];
  return (
    <>
      <div className="section-header">
        <div>
          <h1>Detalle de simulación</h1>
          <div className="sub" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {date(x.createdAt)} <StatusBadge status={x.status} />
          </div>
        </div>
        <div className="flex-gap-8 flex-wrap">
          <Link href="/admin/simulations" className="btn btn-secondary">
            Volver
          </Link>
          <ApproveButton id={x.id} disabled={x.status !== "DRAFT"} />
        </div>
      </div>

      <div className="six-col mb-24">
        <Indicator label="Financiado" sub="monto en PEN" value={money.format(x.financedAmount)} tone="navy" />
        <Indicator label="Cuota base" sub="mensual" value={money.format(x.basePayment)} tone="navy" />
        <Indicator label="Cuota balón" sub="pago final" value={money.format(x.balloonAmount)} tone="warning" />
        <Indicator label="TCEA" sub="costo efectivo" value={percent(x.tcea)} tone="action" />
        <Indicator label="VAN" sub="valor actual neto" value={money.format(x.npv)} tone={x.npv >= 0 ? "success" : "error"} />
        <Indicator label="TIR mensual" sub="flujo cliente" value={percent(x.monthlyIrr)} tone="navy" />
      </div>

      <div className="card card-pad mb-24">
        <div className="card-title mb-12">Condiciones congeladas</div>
        <div className="grid gap-12 md:grid-cols-2">
          <KV k="Precio original" v={moneyByCurrency(x.vehiclePriceOriginal, x.currency)} />
          <KV k="Moneda origen" v={x.currency} />
          <KV k="Tipo de cambio usado" v={`S/ ${x.exchangeRate.toFixed(4)}`} />
          <KV k="Precio equivalente PEN" v={money.format(x.vehiclePricePen)} />
          <KV k="Total intereses" v={money.format(x.totalInterest)} />
          <KV k="Total seguros" v={money.format(x.totalInsurance)} />
          <KV k="Total pagado" v={money.format(x.totalPaid)} />
          <KV k="TEM" v={percent(x.monthlyRate)} />
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Cronograma de pagos</div>
            <div className="card-sub">
              {schedule.length} cuotas · cálculo oficial en soles
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
                  <td className="num">{money.format(i.lifeInsurance + i.vehicleInsurance)}</td>
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
