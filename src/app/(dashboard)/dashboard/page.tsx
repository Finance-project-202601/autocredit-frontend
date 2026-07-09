import Link from "next/link";
import { requireSession } from "@/src/shared/application/session";
import { backendFetch } from "@/src/shared/infrastructure/backend";
import type { Loan, Simulation } from "@/src/shared/domain/types";
import { money, date } from "@/src/shared/presentation/format";
import { Stat, StatusBadge, Empty } from "@/src/shared/presentation/ui";
import { HelpTip } from "@/src/shared/presentation/HelpTip";
import {
  Wallet,
  ClipboardCheck,
  Landmark,
  Calculator,
  CarFront,
  UserRound,
  ChevronRight,
} from "lucide-react";

export default async function Dashboard() {
  const s = await requireSession();
  if (s.role === "ADMIN") return <AdminRedirect />;
  let simulations: Simulation[] = [];
  let loans: Loan[] = [];
  try {
    [simulations, loans] = await Promise.all([
      backendFetch<Simulation[]>("/api/simulations"),
      backendFetch<Loan[]>("/api/loans"),
    ]);
  } catch {}
  const latest = simulations[0];
  const activeLoans = loans.filter((x) => x.status === "ACTIVE").length;

  return (
    <>
      <div className="section-header">
        <div>
          <h1>Hola, {s.email.split("@")[0]}</h1>
          <div className="sub">
            Revisa tus operaciones y crea una nueva simulación.
          </div>
        </div>
        <Link href="/simulations/new" className="btn btn-primary">
          <Calculator /> Nueva simulación
        </Link>
      </div>

      <div className="stat-grid mb-24">
        <Stat
          label="Simulaciones"
          value={simulations.length}
          sub="registradas"
          icon={<ClipboardCheck />}
          iconBg="var(--surface)"
          iconColor="var(--action)"
        />
        <Stat
          label="Préstamos activos"
          value={activeLoans}
          sub="en curso"
          icon={<Landmark />}
          iconBg="var(--success-soft)"
          iconColor="var(--success)"
        />
        <Stat
          label="Último financiado"
          value={latest ? money.format(latest.financedAmount) : "—"}
          sub="monto"
          icon={<Wallet />}
          iconBg="var(--warning-soft)"
          iconColor="var(--warning)"
        />
        <Stat
          label="Préstamos totales"
          value={loans.length}
          sub="históricos"
          icon={<CarFront />}
          iconBg="#e2e8f0"
          iconColor="var(--navy)"
        />
      </div>

      <div className="two-col">
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title" style={{ display: "flex", alignItems: "center", gap: 7 }}>
                Operaciones recientes
                <HelpTip width={244}>
                  <span>
                    <strong>Operaciones recientes.</strong> Tus últimas
                    simulaciones. El color del estado indica en qué etapa está
                    cada una.
                  </span>
                </HelpTip>
              </div>
              <div className="card-sub">
                Últimas simulaciones registradas en la plataforma
              </div>
            </div>
            <Link className="btn btn-secondary btn-sm" href="/simulations">
              Ver todas <ChevronRight />
            </Link>
          </div>
          {simulations.length ? (
            <div className="table-wrap">
              <table className="t">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th className="num">Financiado</th>
                    <th className="num">Cuota base</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {simulations.slice(0, 6).map((x) => (
                    <tr key={x.id}>
                      <td className="muted">{date(x.createdAt)}</td>
                      <td className="num fw-600">{money.format(x.financedAmount)}</td>
                      <td className="num">{money.format(x.basePayment)}</td>
                      <td>
                        <StatusBadge status={x.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <Empty>Todavía no tienes simulaciones.</Empty>
          )}
        </div>

        <div className="stack gap-16">
          <div
            className="card"
            style={{
              background: "linear-gradient(135deg, #1a3a6b 0%, #2a5bc4 100%)",
              color: "white",
              border: "none",
            }}
          >
            <div className="card-pad">
              <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>
                ¿Listo para tu próximo auto?
              </h2>
              <p
                style={{
                  marginTop: 8,
                  fontSize: 13,
                  color: "rgba(255,255,255,0.82)",
                }}
              >
                Compara cuotas, gracia y balón antes de tomar una decisión.
              </p>
              <Link
                href="/simulations/new"
                className="btn btn-block"
                style={{ marginTop: 20, background: "white", color: "var(--navy)" }}
              >
                Nueva simulación
              </Link>
            </div>
          </div>

          <div className="card card-pad">
            <div className="card-title mb-16">Acciones rápidas</div>
            <div className="stack gap-8" style={{ gap: 8 }}>
              <QuickAction icon={<Calculator />} label="Simular crédito vehicular" href="/simulations/new" />
              <QuickAction icon={<CarFront />} label="Ver vehículos" href="/vehicles" />
              <QuickAction icon={<ClipboardCheck />} label="Mis simulaciones" href="/simulations" />
              <QuickAction icon={<UserRound />} label="Completar mi perfil" href="/profile" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function QuickAction({
  icon,
  label,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 12px",
        border: "1px solid var(--border)",
        borderRadius: 8,
        background: "var(--white)",
        fontSize: 13,
        fontWeight: 500,
        color: "var(--text-primary)",
      }}
    >
      <span
        style={{
          width: 28,
          height: 28,
          borderRadius: 7,
          background: "var(--surface)",
          color: "var(--action)",
          display: "grid",
          placeItems: "center",
        }}
      >
        <span style={{ width: 14, height: 14, display: "grid" }}>{icon}</span>
      </span>
      <span style={{ flex: 1 }}>{label}</span>
      <ChevronRight style={{ width: 14, height: 14, color: "var(--text-muted)" }} />
    </Link>
  );
}

function AdminRedirect() {
  return (
    <div className="card card-pad" style={{ padding: 32 }}>
      <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: "var(--text-primary)" }}>
        Panel administrativo
      </h1>
      <p className="muted mt-8">Usa el menú para gestionar AutoCredit.</p>
      <Link href="/admin" className="btn btn-primary mt-16">
        Ir al resumen
      </Link>
    </div>
  );
}
