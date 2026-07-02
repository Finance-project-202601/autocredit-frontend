import Link from "next/link";
import { requireSession } from "@/src/shared/application/session";
import { backendFetch } from "@/src/shared/infrastructure/backend";
import type { Loan, Simulation } from "@/src/shared/domain/types";
import { money, date } from "@/src/shared/presentation/format";
export default async function Dashboard() {
  const s = await requireSession();
  if (s.role === "ADMIN") return <AdminRedirect />;
  let simulations: Simulation[] = [],
    loans: Loan[] = [];
  try {
    [simulations, loans] = await Promise.all([
      backendFetch<Simulation[]>("/api/simulations"),
      backendFetch<Loan[]>("/api/loans"),
    ]);
  } catch {}
  const latest = simulations[0];
  return (
    <>
      <div className="page-title">
        <h1>Hola, {s.email.split("@")[0]}</h1>
        <p>Revisa tus operaciones y crea una nueva simulación.</p>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Metric label="Simulaciones" value={String(simulations.length)} />
        <Metric
          label="Préstamos activos"
          value={String(loans.filter((x) => x.status === "ACTIVE").length)}
        />
        <Metric
          label="Último monto financiado"
          value={latest ? money.format(latest.financedAmount) : "—"}
        />
      </div>
      <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_320px]">
        <section className="card p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-bold">Operaciones recientes</h2>
            <Link
              className="text-sm font-semibold text-blue-700"
              href="/simulations"
            >
              Ver todas
            </Link>
          </div>
          {simulations.length ? (
            <div className="table-wrap mt-4">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Financiado</th>
                    <th>Cuota base</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {simulations.slice(0, 5).map((x) => (
                    <tr key={x.id}>
                      <td>{date(x.createdAt)}</td>
                      <td>{money.format(x.financedAmount)}</td>
                      <td>{money.format(x.basePayment)}</td>
                      <td>
                        <span className="badge">{x.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <Empty />
          )}
        </section>
        <aside className="card bg-blue-700 p-6 text-white">
          <h2 className="text-xl font-bold">¿Listo para tu próximo auto?</h2>
          <p className="mt-2 text-sm text-blue-100">
            Compara cuotas, gracia y balón antes de tomar una decisión.
          </p>
          <Link
            className="btn mt-6 w-full bg-white text-blue-700"
            href="/simulations/new"
          >
            Nueva simulación
          </Link>
        </aside>
      </div>
    </>
  );
}
function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="card metric">
      <small>{label}</small>
      <strong>{value}</strong>
    </div>
  );
}
function Empty() {
  return (
    <div className="py-12 text-center text-sm text-slate-500">
      Todavía no tienes simulaciones.
    </div>
  );
}
function AdminRedirect() {
  return (
    <div className="card p-8">
      <h1 className="text-xl font-bold">Panel administrativo</h1>
      <p className="mt-2 text-slate-500">
        Usa el menú para gestionar AutoCredit.
      </p>
      <Link href="/admin" className="btn btn-primary mt-5">
        Ir al resumen
      </Link>
    </div>
  );
}
