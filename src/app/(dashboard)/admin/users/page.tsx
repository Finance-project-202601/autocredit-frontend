import { requireSession } from "@/src/shared/application/session";
import { backendFetch } from "@/src/shared/infrastructure/backend";
import { date } from "@/src/shared/presentation/format";
import { Badge, Empty } from "@/src/shared/presentation/ui";

type User = {
  id: string;
  email: string;
  role: string;
  enabled: boolean;
  createdAt: string;
};

export default async function Users() {
  await requireSession("ADMIN");
  const rows = await backendFetch<User[]>("/api/admin/users");
  return (
    <>
      <div className="section-header">
        <div>
          <h1>Usuarios</h1>
          <div className="sub">Cuentas registradas en AutoCredit.</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div>
            <div className="card-title">Directorio de usuarios</div>
            <div className="card-sub">{rows.length} cuentas</div>
          </div>
        </div>
        {rows.length ? (
          <div className="table-wrap">
            <table className="t">
              <thead>
                <tr>
                  <th>Correo</th>
                  <th>Rol</th>
                  <th>Registro</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((x) => (
                  <tr key={x.id}>
                    <td className="fw-600" style={{ color: "var(--text-primary)" }}>
                      {x.email}
                    </td>
                    <td>
                      <Badge tone={x.role === "ADMIN" ? "navy" : "muted"}>
                        {x.role === "ADMIN" ? "Administrador" : "Cliente"}
                      </Badge>
                    </td>
                    <td className="muted">{date(x.createdAt)}</td>
                    <td>
                      <Badge tone={x.enabled ? "success" : "error"}>
                        {x.enabled ? "Activo" : "Bloqueado"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <Empty>No hay usuarios registrados.</Empty>
        )}
      </div>
    </>
  );
}
