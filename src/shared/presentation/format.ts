export const money = new Intl.NumberFormat("es-PE", {
  style: "currency",
  currency: "PEN",
  minimumFractionDigits: 2,
});
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
