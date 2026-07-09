import Link from "next/link";
export default function NotFound() {
  return (
    <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24 }}>
      <div style={{ textAlign: "center" }}>
        <b className="navy-text" style={{ fontSize: 64 }}>
          404
        </b>
        <h1 style={{ marginTop: 12, fontSize: 22, fontWeight: 700, color: "var(--text-primary)" }}>
          Página no encontrada
        </h1>
        <Link className="btn btn-primary mt-24" href="/dashboard">
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
