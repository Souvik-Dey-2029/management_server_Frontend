"use client";

import { useState } from "react";

export function Badge({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "blue" | "green" | "red" | "yellow" }) {
  const map: Record<string, { bg: string; fg: string }> = {
    neutral: { bg: "var(--color-surface-container-high)", fg: "var(--color-on-surface-variant)" },
    blue: { bg: "var(--color-primary-fixed)", fg: "var(--color-primary)" },
    green: { bg: "var(--color-secondary-container)", fg: "var(--color-secondary)" },
    red: { bg: "#fbdedb", fg: "var(--color-tertiary)" },
    yellow: { bg: "#fef0cf", fg: "#8a5a00" },
  };
  const c = map[tone];
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 label-sm font-medium"
      style={{ background: c.bg, color: c.fg, borderRadius: "var(--radius-full)" }}
    >
      {children}
    </span>
  );
}

export function EmptyState({ title, body }: { title: string; body?: string }) {
  return (
    <div className="text-center py-10">
      <span className="gdg-dots justify-center mb-3"><span /><span /><span /><span /></span>
      <p className="text-sm font-medium">{title}</p>
      {body && <p className="text-xs mt-1" style={{ color: "var(--color-muted)" }}>{body}</p>}
    </div>
  );
}

export function ConfirmButton({
  label,
  confirmLabel = "Are you sure?",
  onConfirm,
  className,
  tone = "red",
}: {
  label: string;
  confirmLabel?: string;
  onConfirm: () => void | Promise<void>;
  className?: string;
  tone?: "red" | "blue";
}) {
  const [confirming, setConfirming] = useState(false);
  if (confirming) {
    return (
      <span className="inline-flex items-center gap-2">
        <span className="text-xs" style={{ color: "var(--color-muted)" }}>{confirmLabel}</span>
        <button
          className="text-xs font-medium px-2 py-1 rounded"
          style={{ background: tone === "red" ? "var(--color-red)" : "var(--color-blue)", color: "white" }}
          onClick={async () => {
            await onConfirm();
            setConfirming(false);
          }}
        >
          Confirm
        </button>
        <button className="text-xs" onClick={() => setConfirming(false)}>Cancel</button>
      </span>
    );
  }
  return (
    <button className={className} onClick={() => setConfirming(true)}>
      {label}
    </button>
  );
}

export function statusTone(status: string): "neutral" | "blue" | "green" | "red" | "yellow" {
  switch (status) {
    case "completed":
    case "accepted":
    case "approved":
    case "present":
      return "green";
    case "in_progress":
    case "submitted":
    case "ongoing":
      return "blue";
    case "rejected":
      return "red";
    case "pending":
    case "not_started":
    case "upcoming":
      return "yellow";
    default:
      return "neutral";
  }
}
