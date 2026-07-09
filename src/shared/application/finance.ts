// Client-side mirror of the backend FinancialEngine, used only for a live
// preview in the simulator. The authoritative calculation always runs on the
// backend when the user presses "Calcular"; these numbers are an estimate.

export type GraceType = "NONE" | "PARTIAL" | "TOTAL";
export type RateType = "EFFECTIVE" | "NOMINAL";

export interface ScheduleInput {
  price: number;
  downPct: number; // 0..1
  financedExpenses: number;
  balloonPct: number; // 0..1
  term: number;
  graceType: GraceType;
  graceMonths: number;
  rateType: RateType;
  enteredRate: number; // 0..1 annual
  ratePeriodDays: number; // 360
  capitalizationDays: number; // e.g. 30
  lifeRate: number; // monthly, 0..1
  vehRate: number; // monthly, 0..1
  postage: number;
  initialCommission: number;
}

export interface ScheduleRow {
  n: number;
  state: string;
  opening: number;
  interest: number;
  amortization: number;
  life: number;
  vehicle: number;
  postage: number;
  balloon: number;
  total: number;
  closing: number;
}

export interface ScheduleResult {
  i: number; // effective monthly rate
  effectiveAnnual: number;
  financed: number;
  balloon: number;
  basePayment: number;
  firstRegularPayment: number;
  totalInterest: number;
  totalInsurance: number;
  totalPaid: number;
  tcea: number | null;
  rows: ScheduleRow[];
}

export function monthlyRate(
  rateType: RateType,
  r: number,
  ratePeriodDays: number,
  capitalizationDays: number,
): number {
  if (!r) return 0;
  if (rateType === "EFFECTIVE")
    return Math.pow(1 + r, 30 / ratePeriodDays) - 1;
  const annualNominal = (r * 360) / ratePeriodDays;
  const capitalizations = 360 / capitalizationDays;
  const periodic = annualNominal / capitalizations;
  return Math.pow(1 + periodic, 30 / capitalizationDays) - 1;
}

function irr(flows: number[]): number | null {
  const npv = (rate: number) =>
    flows.reduce((acc, f, t) => acc + f / Math.pow(1 + rate, t), 0);
  let low = -0.999999,
    high = 1.0;
  while (npv(high) > 0 && high < 1024) high *= 2;
  let fLow = npv(low),
    fHigh = npv(high);
  if (Math.sign(fLow) === Math.sign(fHigh)) return null;
  for (let n = 0; n < 200; n++) {
    const mid = (low + high) / 2,
      f = npv(mid);
    if (Math.abs(f) < 1e-10) return mid;
    if (Math.sign(f) === Math.sign(fLow)) {
      low = mid;
      fLow = f;
    } else {
      high = mid;
      fHigh = f;
    }
  }
  return (low + high) / 2;
}

export function buildSchedule(input: ScheduleInput): ScheduleResult | null {
  const {
    price,
    downPct,
    financedExpenses,
    balloonPct,
    term,
    graceType,
    graceMonths,
    lifeRate,
    vehRate,
    postage,
    initialCommission,
  } = input;

  if (!price || term <= 0 || graceMonths >= term) return null;

  const i = monthlyRate(
    input.rateType,
    input.enteredRate,
    input.ratePeriodDays,
    input.capitalizationDays,
  );
  const financed = price * (1 - downPct) + financedExpenses;
  const balloon = price * balloonPct;
  let balance = financed;
  const rows: ScheduleRow[] = [];
  const flows: number[] = [financed - initialCommission];
  let totalInterest = 0,
    totalInsurance = 0,
    totalPaid = initialCommission;

  for (let k = 1; k <= graceMonths; k++) {
    const opening = balance;
    const interest = opening * i;
    const life = opening * lifeRate;
    const vehicle = price * vehRate;
    let payment: number;
    let state: string;
    if (graceType === "TOTAL") {
      payment = 0;
      balance = balance + interest + life + vehicle + postage;
      state = "TOTAL_GRACE";
    } else {
      payment = interest + life + vehicle + postage;
      state = "PARTIAL_GRACE";
    }
    rows.push({
      n: k,
      state,
      opening,
      interest,
      amortization: 0,
      life,
      vehicle,
      postage,
      balloon: 0,
      total: payment,
      closing: balance,
    });
    flows.push(-payment);
    totalInterest += interest;
    totalInsurance += life + vehicle;
    totalPaid += payment;
  }

  const regularPeriods = term - graceMonths;
  const discountFactor = Math.pow(1 + i, regularPeriods);
  const balloonPv = balloon / discountFactor;
  if (balloonPv >= balance) return null;
  const annuityFactor =
    i === 0 ? regularPeriods : (1 - 1 / discountFactor) / i;
  const basePayment = (balance - balloonPv) / annuityFactor;

  let firstRegularPayment = 0;
  for (let p = 1; p <= regularPeriods; p++) {
    const k = graceMonths + p;
    const last = p === regularPeriods;
    const opening = balance;
    const interest = opening * i;
    let amortization = basePayment - interest;
    const balloonPayment = last ? balloon : 0;
    if (last) amortization = opening - balloonPayment;
    balance = opening - amortization - balloonPayment;
    if (last || Math.abs(balance) < 1e-8) balance = 0;
    const life = opening * lifeRate;
    const vehicle = price * vehRate;
    const actualBase = interest + amortization;
    const payment = actualBase + life + vehicle + postage + balloonPayment;
    if (p === 1) firstRegularPayment = payment - balloonPayment;
    rows.push({
      n: k,
      state: "PENDING",
      opening,
      interest,
      amortization,
      life,
      vehicle,
      postage,
      balloon: balloonPayment,
      total: payment,
      closing: balance,
    });
    flows.push(-payment);
    totalInterest += interest;
    totalInsurance += life + vehicle;
    totalPaid += payment;
  }

  const irrValue = irr(flows);
  const tcea = irrValue === null ? null : Math.pow(1 + irrValue, 12) - 1;

  return {
    i,
    effectiveAnnual: Math.pow(1 + i, 12) - 1,
    financed,
    balloon,
    basePayment,
    firstRegularPayment,
    totalInterest,
    totalInsurance,
    totalPaid,
    tcea,
    rows,
  };
}
