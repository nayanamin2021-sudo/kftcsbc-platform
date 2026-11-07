import React from "react";

export type BadgeTone = "neutral" | "info" | "success" | "warning" | "error" | "gold";

export interface StatusBadgeProps {
  tone?: BadgeTone;
  children: React.ReactNode;
  className?: string;
  dot?: boolean;
}

const toneStyles: Record<BadgeTone, string> = {
  neutral: "bg-[#f1f5f9] text-[#475569] border-[#dce1e7]",
  info: "bg-[#eff6ff] text-[#1e40af] border-[#bfdbfe]",
  success: "bg-[#f0fdf4] text-[#166534] border-[#bbf7d0]",
  warning: "bg-[#fff7ed] text-[#9a3412] border-[#fed7aa]",
  error: "bg-[#fef2f2] text-[#b91c1c] border-[#fecaca]",
  gold: "bg-[#fef9c3] text-[#14243b] border-[#fde047]",
};

export function StatusBadge({
  tone = "neutral",
  children,
  className = "",
  dot = false,
}: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center justify-center gap-1.5 rounded-[8px] border px-[8px] py-[4px] text-[12px] leading-[18px] font-semibold ${toneStyles[tone]} ${className}`}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />}
      {children}
    </span>
  );
}

export function statusToBadgeTone(status: string): BadgeTone {
  const s = status.toLowerCase();
  if (
    s.includes("approved") ||
    s.includes("published") ||
    s.includes("resolved") ||
    s.includes("active") ||
    s.includes("open") ||
    s.includes("sent") ||
    s.includes("complete")
  ) {
    return "success";
  }
  if (
    s.includes("review") ||
    s.includes("assigned") ||
    s.includes("pending") ||
    s.includes("submitted") ||
    s.includes("upcoming")
  ) {
    return "info";
  }
  if (
    s.includes("warning") ||
    s.includes("changes") ||
    s.includes("closing") ||
    s.includes("manual") ||
    s.includes("unassigned") ||
    s.includes("new")
  ) {
    return "warning";
  }
  if (
    s.includes("declined") ||
    s.includes("cancelled") ||
    s.includes("suspended") ||
    s.includes("failed") ||
    s.includes("error") ||
    s.includes("revoked") ||
    s.includes("conflict")
  ) {
    return "error";
  }
  return "neutral";
}
