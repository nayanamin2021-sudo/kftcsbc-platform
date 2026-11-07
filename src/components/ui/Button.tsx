"use client";

import React from "react";
import Link from "next/link";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "gold"
  | "danger"
  | "ghost"
  | "admin-primary"
  | "admin-secondary"
  | "admin-danger";
export type ButtonSize = "md" | "sm" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  isLoading?: boolean;
  loading?: boolean;
  loadingText?: string;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-[#14243b] text-white border border-transparent hover:bg-[#253851] active:bg-[#0f1c2e]",
  "admin-primary":
    "bg-[#14243b] text-white border border-transparent hover:bg-[#253851] active:bg-[#0f1c2e]",
  secondary:
    "bg-white text-[#14243b] border border-[#14243b] hover:bg-[#e9eff7] active:bg-[#dce6f4]",
  "admin-secondary":
    "bg-white text-[#14243b] border border-[#14243b] hover:bg-[#e9eff7] active:bg-[#dce6f4]",
  gold:
    "bg-[#d5ac50] text-[#14243b] border border-transparent hover:bg-[#c39a3e] active:bg-[#b08932]",
  danger:
    "bg-[#b91c1c] text-white border border-transparent hover:bg-[#991b1b] active:bg-[#7f1d1d]",
  "admin-danger":
    "bg-[#b91c1c] text-white border border-transparent hover:bg-[#991b1b] active:bg-[#7f1d1d]",
  ghost:
    "bg-transparent text-[#14243b] border border-transparent hover:bg-[#e9eff7] active:bg-[#dce6f4]",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "min-h-[44px] px-[16px] py-[10px] text-[14px] leading-[20px]",
  md: "min-h-[48px] px-[20px] py-[12px] text-[14px] leading-[22px]",
  lg: "min-h-[52px] px-[24px] py-[14px] text-[16px] leading-[24px]",
};

export function Button({
  variant = "primary",
  size = "md",
  href,
  isLoading = false,
  loading = false,
  loadingText,
  fullWidth = false,
  leftIcon,
  rightIcon,
  children,
  className = "",
  disabled,
  type = "button",
  ...rest
}: ButtonProps) {
  const busy = isLoading || loading;
  const baseClasses = [
    "inline-flex items-center justify-center gap-[8px] rounded-[8px] font-bold transition-colors duration-150 cursor-pointer select-none text-center",
    "disabled:opacity-55 disabled:cursor-not-allowed",
    variantClasses[variant],
    sizeClasses[size],
    fullWidth ? "w-full" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (href && !disabled && !busy) {
    return (
      <Link href={href} className={baseClasses}>
        {leftIcon && <span aria-hidden="true" className="shrink-0">{leftIcon}</span>}
        <span>{children}</span>
        {rightIcon && <span aria-hidden="true" className="shrink-0">{rightIcon}</span>}
      </Link>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled || busy}
      aria-busy={busy || undefined}
      className={baseClasses}
      {...rest}
    >
      {busy ? (
        <>
          <span
            aria-hidden="true"
            className="inline-block size-4 rounded-full border-2 border-current border-r-transparent animate-spin"
          />
          <span>{loadingText || children}</span>
        </>
      ) : (
        <>
          {leftIcon && <span aria-hidden="true" className="shrink-0">{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span aria-hidden="true" className="shrink-0">{rightIcon}</span>}
        </>
      )}
    </button>
  );
}
