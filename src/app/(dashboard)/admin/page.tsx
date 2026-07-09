import Link from "next/link";
import { requireSession } from "@/src/shared/application/session";
import { backendFetch } from "@/src/shared/infrastructure/backend";
import type { Simulation, Vehicle, Product } from "@/src/shared/domain/types";
import { Stat } from "@/src/shared/presentation/ui";
import { ClipboardCheck, Users, CarFront, Package } from "lucide-react";

export default async function Admin() {
  await requireSession("ADMIN");
  const [sims, vehicles, products, users] = await Promise.all([
    backendFetch<Simulation[]>("/api/simulations"),
    backendFetch<Vehicle[]>("/api/admin/vehicles"),
    backendFetch<Product[]>("/api/admin/products"),
    backendFetch<unknown[]>("/api/admin/users"),
  ]);
  return (
    <>
      <div className="section-header">
        <div>
          <h1>Panel administrativo</h1>
          <div className="sub">Control operativo de AutoCredit.</div>
        </div>
      </div>

      <div className="stat-grid mb-24">
        <Stat
          label="Pendientes"
          value={sims.filter((x) => x.status === "DRAFT").length}
          sub="por aprobar"
          icon={<ClipboardCheck />}
          iconBg="var(--warning-soft)"
          iconColor="var(--warning)"
        />
        <Stat
          label="Usuarios"
          value={users.length}
          sub="registrados"
          icon={<Users />}
          iconBg="var(--surface)"
          iconColor="var(--action)"
        />
        <Stat
          label="Vehículos"
          value={vehicles.length}
          sub="en catálogo"
          icon={<CarFront />}
          iconBg="var(--success-soft)"
          iconColor="var(--success)"
        />
        <Stat
          label="Productos activos"
          value={products.filter((x) => x.active).length}
          sub="configurados"
          icon={<Package />}
          iconBg="#e2e8f0"
          iconColor="var(--navy)"
        />
      </div>

      <div className="card card-pad">
        <div className="card-title mb-16">Acciones prioritarias</div>
        <div className="flex-gap-8 flex-wrap">
          <Link className="btn btn-primary" href="/admin/simulations">
            Revisar aprobaciones
          </Link>
          <Link className="btn btn-secondary" href="/admin/vehicles">
            Gestionar vehículos
          </Link>
          <Link className="btn btn-secondary" href="/admin/products">
            Gestionar productos
          </Link>
        </div>
      </div>
    </>
  );
}
