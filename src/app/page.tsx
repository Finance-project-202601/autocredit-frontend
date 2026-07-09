import Link from "next/link";
import { CarFront, ChartNoAxesCombined, ShieldCheck, Clock } from "lucide-react";

export default function Home() {
  return (
    <main style={{ minHeight: "100vh", background: "var(--white)" }}>
      <header
        style={{
          maxWidth: 1120,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "20px 24px",
        }}
      >
        <Logo />
        <div className="flex-gap-8">
          <Link className="btn btn-secondary" href="/login">
            Ingresar
          </Link>
          <Link className="btn btn-primary" href="/register">
            Crear cuenta
          </Link>
        </div>
      </header>

      <section
        style={{
          maxWidth: 1120,
          margin: "0 auto",
          display: "grid",
          gap: 48,
          alignItems: "center",
          padding: "72px 24px",
        }}
        className="landing-hero"
      >
        <div>
          <span className="badge">
            <span className="dot" />
            Compra Inteligente en soles
          </span>
          <h1
            style={{
              marginTop: 20,
              fontSize: 44,
              fontWeight: 750,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              color: "var(--text-primary)",
            }}
          >
            Tu próximo auto, con números que sí puedes entender.
          </h1>
          <p
            className="muted"
            style={{ marginTop: 20, fontSize: 17, lineHeight: 1.6 }}
          >
            Simula cuotas con balón, seguros y periodos de gracia. Conoce la
            TCEA real, el VAN y la TIR antes de decidir.
          </p>
          <div className="flex-gap-8" style={{ marginTop: 28 }}>
            <Link href="/register" className="btn btn-primary btn-lg">
              Simular mi crédito
            </Link>
            <Link href="/login" className="btn btn-secondary btn-lg">
              Ya tengo cuenta
            </Link>
          </div>
        </div>

        <div
          style={{
            borderRadius: 24,
            background: "linear-gradient(135deg, #1a3a6b 0%, #2a5bc4 100%)",
            padding: 32,
            color: "white",
            boxShadow: "var(--shadow-lg)",
          }}
        >
          <CarFront size={52} />
          <h2 style={{ marginTop: 32, fontSize: 28, fontWeight: 700 }}>
            Compra Inteligente
          </h2>
          <p style={{ marginTop: 12, color: "rgba(255,255,255,0.82)" }}>
            Cuotas mensuales reducidas y una cuota balón transparente al final
            del plazo.
          </p>
          <div
            style={{
              marginTop: 28,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
            }}
          >
            <Feature icon={<ChartNoAxesCombined />} title="TCEA, VAN y TIR" />
            <Feature icon={<ShieldCheck />} title="Costos completos" />
            <Feature icon={<Clock />} title="Periodos de gracia" />
            <Feature icon={<CarFront />} title="Catálogo vehicular" />
          </div>
        </div>
      </section>
    </main>
  );
}

function Logo() {
  return (
    <div className="brand" style={{ padding: 0 }}>
      <div className="brand-logo">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 13l1.5-4a2 2 0 0 1 2-1.5h7a2 2 0 0 1 2 1.5L19 13" />
          <path d="M3 13h18v5a1 1 0 0 1-1 1h-2v-2H6v2H4a1 1 0 0 1-1-1z" />
        </svg>
      </div>
      <div className="brand-name" style={{ fontSize: 18 }}>
        AutoCredit
      </div>
    </div>
  );
}

function Feature({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div
      style={{
        borderRadius: 12,
        background: "rgba(255,255,255,0.1)",
        padding: 16,
      }}
    >
      {icon}
      <div style={{ marginTop: 8, fontWeight: 600, fontSize: 13.5 }}>
        {title}
      </div>
    </div>
  );
}
