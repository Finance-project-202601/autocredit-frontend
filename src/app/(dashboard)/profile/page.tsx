import { backendFetch } from "@/src/shared/infrastructure/backend";
import { ProfileForm } from "@/src/modules/customers/presentation/ProfileForm";

export default async function Profile() {
  let initial;
  try {
    initial = await backendFetch<Record<string, string | number>>("/api/me");
  } catch {}
  return (
    <>
      <div className="section-header">
        <div>
          <h1>Mi perfil</h1>
          <div className="sub">
            Completa tus datos para poder crear simulaciones de crédito.
          </div>
        </div>
      </div>
      <ProfileForm initial={initial} />
    </>
  );
}
