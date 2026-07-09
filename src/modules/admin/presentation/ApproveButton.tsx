"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";

export function ApproveButton({
  id,
  disabled,
}: {
  id: string;
  disabled: boolean;
}) {
  const [pending, setPending] = useState(false);
  const router = useRouter();
  async function approve() {
    if (!confirm("¿Aprobar esta simulación y congelar sus condiciones?"))
      return;
    setPending(true);
    const r = await fetch(`/api/backend/admin/simulations/${id}/approve`, {
      method: "POST",
    });
    if (!r.ok)
      alert((await r.json().catch(() => ({}))).message ?? "No se pudo aprobar");
    router.refresh();
    setPending(false);
  }
  return (
    <button
      disabled={disabled || pending}
      onClick={approve}
      className="btn btn-primary btn-sm"
    >
      {!disabled && !pending && <Check />}
      {disabled ? "Aprobada" : pending ? "Aprobando…" : "Aprobar"}
    </button>
  );
}
