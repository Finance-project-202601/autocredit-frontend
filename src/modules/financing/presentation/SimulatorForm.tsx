"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Product, Vehicle } from "@/src/shared/domain/types";
import { money, percent } from "@/src/shared/presentation/format";
import { HelpTip } from "@/src/shared/presentation/HelpTip";
import { buildSchedule } from "@/src/shared/application/finance";
import { ChevronRight } from "lucide-react";

const CAP_OPTIONS: [string, string][] = [
  ["30", "Mensual"],
  ["60", "Bimestral"],
  ["90", "Trimestral"],
  ["180", "Semestral"],
  ["360", "Anual"],
];

export function SimulatorForm({
  vehicles,
  products,
  selected,
}: {
  vehicles: Vehicle[];
  products: Product[];
  selected?: string;
}) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const [vehicleId, setVehicleId] = useState(selected ?? vehicles[0]?.id ?? "");
  const [productId, setProductId] = useState(products[0]?.id ?? "");
  const [rateType, setRateType] = useState<"EFFECTIVE" | "NOMINAL">("EFFECTIVE");
  const [graceType, setGraceType] = useState<"NONE" | "PARTIAL" | "TOTAL">("NONE");
  const [capDays, setCapDays] = useState("30");

  const vehicle = vehicles.find((x) => x.id === vehicleId);
  const product = products.find((x) => x.id === productId);

  const minTerm = product?.minTerm ?? 12;
  const maxTerm = product?.maxTerm ?? 84;
  const maxGrace = product?.maxGraceMonths ?? 12;
  const minBalloon = (product?.minBalloonPct ?? 0.2) * 100;
  const maxBalloon = (product?.maxBalloonPct ?? 0.5) * 100;

  const [downPayment, setDownPayment] = useState("20");
  const [term, setTerm] = useState(String(Math.min(Math.max(48, minTerm), maxTerm)));
  const [rate, setRate] = useState("14.8");
  const [balloon, setBalloon] = useState("40");
  const [graceMonths, setGraceMonths] = useState("3");
  const [financedExpenses, setFinancedExpenses] = useState("0");
  const [commission, setCommission] = useState("0");
  const [discountRate, setDiscountRate] = useState("14.8");

  const price = vehicle?.price ?? 0;
  const downPct = (Number(downPayment) || 0) / 100;
  const initialAmount = price * downPct;

  const preview =
    !vehicle || !product
      ? null
      : buildSchedule({
          price,
          downPct,
          financedExpenses: Number(financedExpenses) || 0,
          balloonPct: (Number(balloon) || 0) / 100,
          term: Number(term) || 0,
          graceType,
          graceMonths: graceType === "NONE" ? 0 : Number(graceMonths) || 0,
          rateType,
          enteredRate: (Number(rate) || 0) / 100,
          ratePeriodDays: 360,
          capitalizationDays: rateType === "NOMINAL" ? Number(capDays) : 30,
          lifeRate: product.lifeInsuranceRate,
          vehRate: product.vehicleInsuranceRate,
          postage: product.postage,
          initialCommission: Number(commission) || 0,
        });

  const monthlyRateValue = preview?.i ?? 0;
  const effectiveAnnual = preview?.effectiveAnnual ?? 0;
  const financed = preview ? preview.financed : price * (1 - downPct);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!vehicle || !product) return;
    setPending(true);
    setError("");
    const annualDiscount = (Number(discountRate) || 0) / 100;
    const body = {
      vehicleId,
      productId,
      vehiclePrice: vehicle.price,
      downPaymentPercentage: downPct,
      financedExpenses: Number(financedExpenses) || 0,
      rateType,
      enteredRate: (Number(rate) || 0) / 100,
      ratePeriodDays: 360,
      capitalizationDays: rateType === "NOMINAL" ? Number(capDays) : null,
      termMonths: Number(term),
      graceType,
      graceMonths: graceType === "NONE" ? 0 : Number(graceMonths),
      balloonPercentage: (Number(balloon) || 0) / 100,
      lifeInsuranceRate: product.lifeInsuranceRate,
      vehicleInsuranceRate: product.vehicleInsuranceRate,
      postage: product.postage,
      initialCommission: Number(commission) || 0,
      discountRate: Math.pow(1 + annualDiscount, 1 / 12) - 1,
    };
    const r = await fetch("/api/backend/simulations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await r.json().catch(() => ({}));
    if (r.ok) router.push(`/simulations/${data.id}`);
    else setError(data.message ?? "No se pudo calcular la simulación");
    setPending(false);
  }

  return (
    <form onSubmit={submit} className="sim-grid">
      {/* ---------- Parameters ---------- */}
      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Parámetros del crédito</div>
            <div className="card-sub">
              Define vehículo, monto, tasa, plazo y periodo de gracia
            </div>
          </div>
          <span className="badge action">
            <span className="dot" />
            Compra Inteligente
          </span>
        </div>
        <div className="card-pad">
          {/* Vehicle + product */}
          <div className="form-row">
            <Select
              label="Vehículo"
              value={vehicleId}
              onChange={setVehicleId}
              options={vehicles.map((v) => [
                v.id,
                `${v.brand} ${v.model} — ${money.format(v.price)}`,
              ])}
            />
            <Select
              label="Producto"
              value={productId}
              onChange={setProductId}
              options={products.map((p) => [p.id, p.name])}
            />
          </div>

          {/* Moneda */}
          <div className="row-between mb-20">
            <label className="fw-600" style={{ fontSize: 12.5, color: "var(--text-primary)" }}>
              Moneda de la operación
            </label>
            <span className="badge navy">
              <span className="dot" />
              Soles (PEN)
            </span>
          </div>

          {/* Price + inicial */}
          <div className="form-row">
            <div className="field">
              <label>Precio del vehículo</label>
              <div className="input-wrap">
                <span className="input-prefix">S/</span>
                <input
                  className="input with-prefix"
                  value={price ? price.toFixed(2) : "0.00"}
                  readOnly
                />
              </div>
            </div>
            <Field
              label="Cuota inicial"
              value={downPayment}
              onChange={setDownPayment}
              prefix="%"
              hint={`S/ ${initialAmount.toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              help={
                <span>
                  <strong>Cuota inicial.</strong> Porcentaje del precio que se
                  paga al contado. A mayor inicial, menor monto a financiar y
                  menor cuota mensual.
                </span>
              }
            />
          </div>

          {/* Monto a financiar highlight */}
          <div className="finance-box mb-24">
            <div>
              <div className="tiny fw-600" style={{ color: "var(--text-primary)" }}>
                Monto a financiar
              </div>
              <div className="tiny muted">
                {(100 - (Number(downPayment) || 0)).toFixed(0)}% del valor
                {Number(financedExpenses) > 0 ? " + gastos" : ""}
              </div>
            </div>
            <div className="tnum navy-text" style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em" }}>
              {money.format(financed)}
            </div>
          </div>

          {/* Rate type */}
          <div className="row-between mb-16">
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <label className="fw-600" style={{ fontSize: 12.5, color: "var(--text-primary)" }}>
                Tipo de tasa
              </label>
              <HelpTip width={250}>
                <span>
                  <strong>Tipo de tasa.</strong> La efectiva (TEA) ya incluye la
                  capitalización; la nominal (TNA) se convierte a efectiva según
                  el periodo de capitalización.
                </span>
              </HelpTip>
            </span>
            <div className="toggle-group">
              <button
                type="button"
                className={rateType === "NOMINAL" ? "active" : ""}
                onClick={() => setRateType("NOMINAL")}
              >
                Nominal
              </button>
              <button
                type="button"
                className={rateType === "EFFECTIVE" ? "active" : ""}
                onClick={() => setRateType("EFFECTIVE")}
              >
                Efectiva
              </button>
            </div>
          </div>
          <div className="info-tip mb-16">
            {rateType === "NOMINAL" ? (
              <span>
                <strong>Tasa Nominal (TNA).</strong> No considera la
                capitalización; se convierte a efectiva según el periodo
                indicado.
              </span>
            ) : (
              <span>
                <strong>Tasa Efectiva (TEA).</strong> Ya incorpora la
                capitalización; refleja el costo real anual del dinero.
              </span>
            )}
          </div>

          <div className="form-row">
            <Field
              label={rateType === "NOMINAL" ? "Tasa Nominal Anual (TNA)" : "Tasa Efectiva Anual (TEA)"}
              value={rate}
              onChange={setRate}
              prefix="%"
              help={
                rateType === "NOMINAL" ? (
                  <span>
                    <strong>TNA.</strong> Tasa anunciada sin capitalización. Se
                    convierte a efectiva según el periodo indicado.
                  </span>
                ) : (
                  <span>
                    <strong>TEA.</strong> Costo real anual del crédito; ya
                    incorpora la capitalización de intereses.
                  </span>
                )
              }
            />
            {rateType === "NOMINAL" ? (
              <Select
                label="Periodo de capitalización"
                value={capDays}
                onChange={setCapDays}
                options={CAP_OPTIONS}
              />
            ) : (
              <ReadOnly label="Tasa Efectiva Mensual" hint="calculada" value={percent(monthlyRateValue)} />
            )}
          </div>

          {rateType === "NOMINAL" && (
            <div className="form-row" style={{ marginTop: -2 }}>
              <ReadOnly label="TEA equivalente" hint="conversión automática" value={percent(effectiveAnnual)} />
              <ReadOnly label="TEM equivalente" hint="tasa mensual" value={percent(monthlyRateValue)} />
            </div>
          )}

          {/* Term slider */}
          <div className="field mb-20">
            <div className="label-row">
              <label>Plazo del crédito</label>
              <span className="hint">
                {term} meses · {(Number(term) / 12).toFixed(1)} años
              </span>
            </div>
            <input
              type="range"
              min={minTerm}
              max={maxTerm}
              step={6}
              value={term}
              onChange={(e) => setTerm(e.target.value)}
            />
            <div className="flex-between tiny" style={{ color: "var(--text-muted)", marginTop: 4 }}>
              <span>{minTerm}m</span>
              <span>{maxTerm}m</span>
            </div>
          </div>

          {/* Grace */}
          <div className="field">
            <label>Periodo de gracia</label>
            <div className="grace-grid">
              <GraceCard active={graceType === "NONE"} onClick={() => setGraceType("NONE")} title="Sin gracia" desc="Pagos regulares desde el mes 1" color="muted" />
              <GraceCard active={graceType === "PARTIAL"} onClick={() => setGraceType("PARTIAL")} title="Gracia parcial" desc="Solo se paga el interés" color="warning" />
              <GraceCard active={graceType === "TOTAL"} onClick={() => setGraceType("TOTAL")} title="Gracia total" desc="No se realiza ningún pago" color="error" />
            </div>
            <div className="info-tip">
              <strong>Periodo de gracia.</strong> Meses iniciales en que se
              difiere el pago. En la <strong>parcial</strong> solo se paga el
              interés; en la <strong>total</strong> no se paga nada y el interés
              se capitaliza al saldo.
            </div>
          </div>

          {graceType !== "NONE" && (
            <div className="form-row" style={{ marginTop: 18 }}>
              <Select
                label="Meses de gracia"
                value={graceMonths}
                onChange={setGraceMonths}
                options={Array.from({ length: maxGrace }, (_, k) => [
                  String(k + 1),
                  String(k + 1),
                ])}
              />
              <ReadOnly label="Inicio de cuotas regulares" hint="automático" value={`Mes ${(Number(graceMonths) || 0) + 1}`} />
            </div>
          )}

          {/* Balloon */}
          <div className="form-row" style={{ marginTop: 18 }}>
            <Field
              label="Cuota balón"
              value={balloon}
              onChange={setBalloon}
              prefix="%"
              hint={`S/ ${(price * ((Number(balloon) || 0) / 100)).toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} · residual (${minBalloon.toFixed(0)}–${maxBalloon.toFixed(0)}%)`}
              help={
                <span>
                  <strong>Cuota balón.</strong> Parte del monto que se difiere al
                  final. Reduce las cuotas mensuales pero exige un pago grande en
                  la última cuota.
                </span>
              }
            />
            <ReadOnly
              label="Última cuota (con balón)"
              hint="cuota + residual"
              value={preview ? money.format(preview.basePayment + preview.balloon) : "—"}
            />
          </div>

          {/* Otros costos */}
          <div className="field" style={{ marginTop: 18 }}>
            <label>Otros costos y descuento</label>
            <div className="tiny muted mb-8">
              Gastos que se financian o que afectan el costo efectivo (TCEA) y el
              VAN.
            </div>
          </div>
          <div className="form-row form-row-3">
            <Field
              label="Gastos financiados"
              value={financedExpenses}
              onChange={setFinancedExpenses}
              prefix="S/"
              hint="se suman al monto"
              help={
                <span>
                  <strong>Gastos financiados.</strong> Gastos que se agregan al
                  monto del préstamo (p. ej. trámites) en lugar de pagarse al
                  contado.
                </span>
              }
            />
            <Field
              label="Comisión inicial"
              value={commission}
              onChange={setCommission}
              prefix="S/"
              hint="al desembolso"
              help={
                <span>
                  <strong>Comisión inicial.</strong> Cargo cobrado al inicio.
                  Afecta la TCEA porque reduce el neto recibido.
                </span>
              }
            />
            <Field
              label="Tasa de descuento anual"
              value={discountRate}
              onChange={setDiscountRate}
              prefix="%"
              hint="COK para el VAN"
              help={
                <span>
                  <strong>Tasa de descuento (COK).</strong> Costo de oportunidad
                  usado para calcular el VAN del préstamo.
                </span>
              }
            />
          </div>

          {error && <div className="alert alert-error mt-16">{error}</div>}
        </div>
      </div>

      {/* ---------- Live summary ---------- */}
      <aside className="stack gap-16" style={{ gap: 16, position: "sticky", top: 84 }}>
        <div
          className="card"
          style={{
            background: "linear-gradient(135deg, #1a3a6b 0%, #2a5bc4 100%)",
            color: "white",
            border: "none",
          }}
        >
          <div className="card-pad">
            <div style={{ fontSize: 12, opacity: 0.8, letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 500 }}>
              Cuota base estimada
            </div>
            <div className="tnum" style={{ fontSize: 34, fontWeight: 700, letterSpacing: "-0.025em", marginTop: 6 }}>
              {preview ? money.format(preview.basePayment) : "—"}
            </div>
            {preview && (
              <div className="tnum" style={{ fontSize: 12, opacity: 0.85, marginTop: 4 }}>
                ≈ {money.format(preview.firstRegularPayment)}/mes con seguros y
                portes
              </div>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 22, paddingTop: 18, borderTop: "1px solid rgba(255,255,255,0.18)" }}>
              <div>
                <div style={{ fontSize: 11, opacity: 0.75 }}>Total a pagar</div>
                <div className="tnum" style={{ fontWeight: 600, fontSize: 15, marginTop: 3 }}>
                  {preview ? money.format(preview.totalPaid) : "—"}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 11, opacity: 0.75 }}>Intereses</div>
                <div className="tnum" style={{ fontWeight: 600, fontSize: 15, marginTop: 3 }}>
                  {preview ? money.format(preview.totalInterest) : "—"}
                </div>
              </div>
            </div>
            <button
              disabled={pending || !preview}
              className="btn btn-block"
              style={{ marginTop: 20, background: "white", color: "var(--navy)" }}
            >
              {pending ? "Calculando…" : "Calcular simulación"}
              {!pending && <ChevronRight />}
            </button>
            <p style={{ marginTop: 10, fontSize: 11, opacity: 0.8 }}>
              Estimación local. Al calcular, el backend confirma la cuota, VAN,
              TIR y TCEA exactos.
            </p>
          </div>
        </div>

        <div className="card card-pad">
          <div className="card-title mb-12">Resumen de condiciones</div>
          <KV k="Precio del vehículo" v={money.format(price)} />
          <KV k={`Cuota inicial (${Number(downPayment) || 0}%)`} v={money.format(initialAmount)} />
          <KV k="Monto a financiar" v={<span className="action-text">{money.format(financed)}</span>} />
          <KV k="Plazo" v={`${term} meses`} />
          <KV k="Tasa efectiva anual" v={percent(effectiveAnnual)} />
          <KV k="Tasa efectiva mensual" v={percent(monthlyRateValue)} />
          <KV
            k="Gracia"
            v={
              graceType === "NONE" ? (
                <span className="badge muted"><span className="dot" />No aplica</span>
              ) : graceType === "PARTIAL" ? (
                <span className="badge warning"><span className="dot" />{graceMonths}m parcial</span>
              ) : (
                <span className="badge error"><span className="dot" />{graceMonths}m total</span>
              )
            }
          />
          {preview && preview.balloon > 0 && (
            <KV k={`Cuota balón (${Number(balloon) || 0}%)`} v={money.format(preview.balloon)} />
          )}
          <KV
            k="TCEA estimada"
            v={preview?.tcea != null ? percent(preview.tcea) : "—"}
          />
        </div>
      </aside>
    </form>
  );
}

/* ---------- pieces ---------- */

function KV({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="kv">
      <span className="k">{k}</span>
      <span className="v">{v}</span>
    </div>
  );
}

function ReadOnly({ label, hint, value }: { label: string; hint?: string; value: React.ReactNode }) {
  return (
    <div className="field">
      <div className="label-row">
        <label>{label}</label>
        {hint && <span className="hint">{hint}</span>}
      </div>
      <div className="input" style={{ background: "var(--bg)", color: "var(--text-primary)", fontWeight: 600 }}>
        {value}
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  prefix,
  hint,
  help,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  prefix?: string;
  hint?: string;
  help?: React.ReactNode;
}) {
  return (
    <div className="field">
      <div className="label-row">
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <label>{label}</label>
          {help && <HelpTip>{help}</HelpTip>}
        </span>
        {hint && <span className="hint">{hint}</span>}
      </div>
      <div className="input-wrap">
        {prefix && <span className="input-prefix">{prefix}</span>}
        <input
          type="number"
          step="0.0001"
          className={`input ${prefix ? "with-prefix" : ""}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required
        />
      </div>
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (x: string) => void;
  options: (readonly [string, string])[];
}) {
  return (
    <div className="field">
      <label>{label}</label>
      <select className="select" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
    </div>
  );
}

function GraceCard({
  active,
  onClick,
  title,
  desc,
  color,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  desc: string;
  color: "muted" | "warning" | "error";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="grace-card"
      style={{
        border: `1.5px solid ${active ? "var(--action)" : "var(--border)"}`,
        background: active ? "var(--surface)" : "var(--white)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
        <span className={`badge ${color}`} style={{ padding: "2px 6px" }}>
          <span className="dot" />
        </span>
        <span className="fw-600" style={{ fontSize: 12.5, color: "var(--text-primary)" }}>
          {title}
        </span>
      </div>
      <div className="tiny muted" style={{ lineHeight: 1.35 }}>
        {desc}
      </div>
    </button>
  );
}
