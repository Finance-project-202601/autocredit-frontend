import { backendFetch } from "@/src/shared/infrastructure/backend";
import type { Product, Vehicle } from "@/src/shared/domain/types";
import { SimulatorForm } from "@/src/modules/financing/presentation/SimulatorForm";

export default async function NewSimulation({
  searchParams,
}: {
  searchParams: Promise<{ vehicle?: string }>;
}) {
  const [vehicles, products, query] = await Promise.all([
    backendFetch<Vehicle[]>("/api/vehicles"),
    backendFetch<Product[]>("/api/products"),
    searchParams,
  ]);
  return (
    <>
      <div className="section-header">
        <div>
          <h1>Simulador de crédito vehicular</h1>
          <div className="sub">
            Configura tu Compra Inteligente y conoce su costo real.
          </div>
        </div>
        <span className="badge action">
          <span className="dot" />
          Compra Inteligente
        </span>
      </div>
      <SimulatorForm
        vehicles={vehicles}
        products={products}
        selected={query.vehicle}
      />
    </>
  );
}
