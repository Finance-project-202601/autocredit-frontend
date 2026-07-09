"use client";
export default function ErrorPage({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div
      className="card card-pad"
      style={{
        maxWidth: 480,
        margin: "80px auto",
        textAlign: "center",
        padding: 32,
      }}
    >
      <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--text-primary)", margin: 0 }}>
        No pudimos cargar esta pantalla
      </h2>
      <p className="muted mt-8">{error.message}</p>
      <button onClick={reset} className="btn btn-primary mt-20">
        Intentar nuevamente
      </button>
    </div>
  );
}
