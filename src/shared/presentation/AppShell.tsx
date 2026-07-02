"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { Session } from "../domain/types";
import {
  LayoutDashboard,
  Calculator,
  CarFront,
  Landmark,
  UserRound,
  Users,
  Package,
  ClipboardCheck,
  ScrollText,
  LogOut,
  Menu,
} from "lucide-react";
import { useState } from "react";
const customer = [
  ["/dashboard", "Resumen", LayoutDashboard],
  ["/simulations/new", "Simular crédito", Calculator],
  ["/simulations", "Mis simulaciones", ClipboardCheck],
  ["/vehicles", "Vehículos", CarFront],
  ["/loans", "Mis préstamos", Landmark],
  ["/profile", "Mi perfil", UserRound],
] as const;
const admin = [
  ["/admin", "Resumen", LayoutDashboard],
  ["/admin/simulations", "Aprobaciones", ClipboardCheck],
  ["/admin/vehicles", "Vehículos", CarFront],
  ["/admin/products", "Productos", Package],
  ["/admin/users", "Usuarios", Users],
  ["/admin/audit", "Auditoría", ScrollText],
] as const;
export function AppShell({
  session,
  children,
}: {
  session: Session;
  children: React.ReactNode;
}) {
  const path = usePathname(),
    router = useRouter();
  const [open, setOpen] = useState(false);
  const items = session.role === "ADMIN" ? admin : customer;
  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  }
  return (
    <div className="min-h-screen">
      <header className="fixed inset-x-0 top-0 z-30 flex h-16 items-center border-b bg-white px-4 md:hidden">
        <button onClick={() => setOpen(!open)}>
          <Menu />
        </button>
        <b className="ml-3 text-blue-700">AutoCredit</b>
      </header>
      {open && (
        <button
          aria-label="Cerrar menú"
          className="fixed inset-0 z-30 bg-black/30 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 border-r bg-white p-4 transition-transform md:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="mb-8 flex items-center gap-2 px-2 text-lg font-bold text-blue-700">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-blue-700 text-white">
            A
          </span>
          AutoCredit
        </div>
        <p className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
          {session.role === "ADMIN" ? "Administración" : "Mi financiamiento"}
        </p>
        <nav className="mt-3 grid gap-1">
          {items.map(([href, label, Icon]) => (
            <Link
              onClick={() => setOpen(false)}
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${path === href ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50"}`}
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-4 inset-x-4 border-t pt-4">
          <div className="mb-3 truncate px-2 text-xs text-slate-500">
            {session.email}
          </div>
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-red-50 hover:text-red-700"
          >
            <LogOut size={18} />
            Cerrar sesión
          </button>
        </div>
      </aside>
      <main className="min-h-screen pt-20 md:ml-64 md:pt-0">
        <div className="mx-auto max-w-7xl p-5 md:p-8">{children}</div>
      </main>
    </div>
  );
}
