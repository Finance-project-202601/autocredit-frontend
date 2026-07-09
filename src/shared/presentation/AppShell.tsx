"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
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
  HelpCircle,
} from "lucide-react";

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

const TITLES: Record<string, string> = {
  "/dashboard": "Resumen",
  "/simulations": "Mis simulaciones",
  "/simulations/new": "Simulador de crédito",
  "/vehicles": "Vehículos",
  "/loans": "Mis préstamos",
  "/profile": "Mi perfil",
  "/admin": "Panel administrativo",
  "/admin/simulations": "Aprobaciones",
  "/admin/vehicles": "Vehículos",
  "/admin/products": "Productos",
  "/admin/users": "Usuarios",
  "/admin/audit": "Auditoría",
};

function CarLogo() {
  return (
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
  );
}

export function AppShell({
  session,
  children,
}: {
  session: Session;
  children: React.ReactNode;
}) {
  const path = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const isAdmin = session.role === "ADMIN";
  const items = isAdmin ? admin : customer;
  const initials = session.email.slice(0, 2).toUpperCase();
  const title =
    TITLES[path] ??
    (path.startsWith("/simulations")
      ? "Simulaciones"
      : path.startsWith("/loans")
        ? "Préstamos"
        : "AutoCredit");

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  }

  return (
    <div className="app-shell" data-open={open}>
      <button
        aria-label="Cerrar menú"
        className="sidebar-overlay"
        onClick={() => setOpen(false)}
      />

      <aside className="sidebar">
        <div className="brand">
          <div className="brand-logo">
            <CarLogo />
          </div>
          <div>
            <div className="brand-name">AutoCredit</div>
            <div className="brand-sub">Compra Inteligente</div>
          </div>
        </div>

        <div className="nav-section-label">
          {isAdmin ? "Administración" : "Operaciones"}
        </div>
        {items.map(([href, label, Icon]) => (
          <Link
            key={href}
            href={href}
            onClick={() => setOpen(false)}
            className={`nav-item ${path === href ? "active" : ""}`}
          >
            <Icon /> <span>{label}</span>
          </Link>
        ))}

        <div className="sidebar-footer">
          <div className="user-card">
            <div className="avatar">{initials}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                className="user-name"
                style={{ overflow: "hidden", textOverflow: "ellipsis" }}
              >
                {session.email.split("@")[0]}
              </div>
              <div className="user-role">
                {isAdmin ? "Administrador" : "Cliente"}
              </div>
            </div>
            <button
              className="icon-btn"
              style={{ width: 30, height: 30 }}
              onClick={logout}
              title="Cerrar sesión"
              aria-label="Cerrar sesión"
            >
              <LogOut style={{ width: 14, height: 14 }} />
            </button>
          </div>
        </div>
      </aside>

      <div className="main-area">
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="icon-btn menu-btn"
              onClick={() => setOpen(true)}
              aria-label="Abrir menú"
            >
              <Menu style={{ width: 18, height: 18 }} />
            </button>
            <div className="page-title-bar">{title}</div>
          </div>
          <div className="topbar-right">
            <span className="help-tip">
              <button
                className="icon-btn"
                title="Ayuda"
                aria-label="Centro de ayuda"
              >
                <HelpCircle style={{ width: 18, height: 18 }} />
              </button>
              <span
                className="help-bubble below align-end"
                style={{ width: 250 }}
                role="tooltip"
              >
                <strong>Centro de ayuda.</strong> Pasa el cursor sobre los
                iconos (?) junto a cada campo para ver una explicación de qué
                significa y cómo usarlo.
              </span>
            </span>
          </div>
        </header>

        <main className="content">{children}</main>
      </div>
    </div>
  );
}
