"use client";
import { useState, type ReactNode } from "react";

// Small ( ? ) that reveals an explanatory bubble on hover, and stays pinned
// open on click/focus so it also works when captured in static screenshots.
export function HelpTip({
  children,
  below,
  align,
  width,
}: {
  children: ReactNode;
  below?: boolean;
  align?: "end";
  width?: number;
}) {
  const [open, setOpen] = useState(false);
  const bubbleCls = `help-bubble${below ? " below" : ""}${
    align === "end" ? " align-end" : ""
  }`;
  return (
    <span
      className={`help-tip${open ? " open" : ""}`}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        className="help-btn"
        aria-label="Ayuda"
        onMouseEnter={() => setOpen(true)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen((o) => !o);
        }}
      >
        ?
      </button>
      <span
        className={bubbleCls}
        style={width ? { width } : undefined}
        role="tooltip"
      >
        {children}
      </span>
    </span>
  );
}
