"use client";
export default function ErrorPage({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="card mx-auto mt-20 max-w-lg p-8 text-center">
      <h2 className="text-xl font-bold">No pudimos cargar esta pantalla</h2>
      <p className="mt-2 text-slate-500">{error.message}</p>
      <button onClick={reset} className="btn btn-primary mt-5">
        Intentar nuevamente
      </button>
    </div>
  );
}
