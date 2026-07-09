import type { ReactNode } from "react";
import { HelpTip } from "./HelpTip";

// Pure presentational helpers (no hooks) — safe to use from server components.

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="section-header">
      <div>
        <h1>{title}</h1>
        {subtitle && <div className="sub">{subtitle}</div>}
      </div>
      {actions && <div className="flex-gap-8 flex-wrap">{actions}</div>}
    </div>
  );
}

export function Stat({
  label,
  value,
  sub,
  icon,
  iconBg,
  iconColor,
}: {
  label: string;
  value: ReactNode;
  sub?: string;
  icon?: ReactNode;
  iconBg?: string;
  iconColor?: string;
}) {
  return (
    <div className="stat">
      {icon && (
        <div
          className="stat-icon"
          style={{ background: iconBg ?? "var(--surface)", color: iconColor ?? "var(--action)" }}
        >
          {icon}
        </div>
      )}
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      {sub && <div className="stat-sub">{sub}</div>}
    </div>
  );
}

export function Indicator({
  label,
  sub,
  value,
  tone = "navy",
  info,
}: {
  label: string;
  sub?: string;
  value: ReactNode;
  tone?: "success" | "action" | "navy" | "warning" | "error";
  info?: ReactNode;
}) {
  const fg: Record<string, string> = {
    success: "var(--success)",
    action: "var(--action)",
    navy: "var(--navy)",
    warning: "var(--warning)",
    error: "var(--error)",
  };
  return (
    <div className="card indicator">
      <div className="indicator-head">
        <span className="indicator-label" style={{ color: fg[tone] }}>
          {label}
        </span>
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: 99,
            background: fg[tone],
          }}
        />
      </div>
      <div className="indicator-value">{value}</div>
      {sub && <div className="indicator-sub">{sub}</div>}
      {info && <div className="info-tip">{info}</div>}
    </div>
  );
}

const STATUS: Record<string, { tone: string; label: string }> = {
  DRAFT: { tone: "action", label: "En revisión" },
  PENDING: { tone: "action", label: "En revisión" },
  APPROVED: { tone: "success", label: "Aprobada" },
  ACTIVE: { tone: "success", label: "Activo" },
  REJECTED: { tone: "error", label: "Rechazada" },
  CANCELLED: { tone: "muted", label: "Anulada" },
  CLOSED: { tone: "muted", label: "Cerrado" },
};

export function StatusBadge({ status }: { status: string }) {
  const s = STATUS[status?.toUpperCase()] ?? { tone: "muted", label: status };
  return (
    <span className={`badge ${s.tone}`}>
      <span className="dot" />
      {s.label}
    </span>
  );
}

export function Badge({
  tone = "action",
  children,
}: {
  tone?: "success" | "action" | "warning" | "error" | "muted" | "navy";
  children: ReactNode;
}) {
  return (
    <span className={`badge ${tone}`}>
      <span className="dot" />
      {children}
    </span>
  );
}

export function KV({ k, v, help }: { k: string; v: ReactNode; help?: ReactNode }) {
  return (
    <div className="kv">
      <span className="k" style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
        {k}
        {help && <HelpTip width={228}>{help}</HelpTip>}
      </span>
      <span className="v">{v}</span>
    </div>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return <div className="empty">{children}</div>;
}
