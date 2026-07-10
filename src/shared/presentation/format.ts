export const money = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
  minimumFractionDigits: 2,
});
export const usdMoney = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});
export const moneyByCurrency = (value: number, currency: "PEN" | "USD") =>
  (currency === "USD" ? usdMoney : money).format(value);
export const percent = (value: number, digits = 4) =>
  new Intl.NumberFormat("es-PE", {
    style: "percent",
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
export const date = (value: string) =>
  new Intl.DateTimeFormat("es-PE", { dateStyle: "medium" }).format(
    new Date(value),
  );
