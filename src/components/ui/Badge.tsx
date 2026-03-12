import React from "react";

type BadgeVariant = "success" | "warning" | "error" | "info" | "neutral";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  children: React.ReactNode;
}

const variantStyles: Record<BadgeVariant, string> = {
  success: "bg-emerald-500/15 text-emerald-300 ring-emerald-500/25",
  warning: "bg-amber-500/15 text-amber-300 ring-amber-500/25",
  error: "bg-rose-500/15 text-rose-300 ring-rose-500/25",
  info: "bg-primary-500/15 text-primary-300 ring-primary-500/25",
  neutral: "bg-white/8 text-slate-700 ring-white/12",
};

export const Badge = ({
  variant = "neutral",
  children,
  className = "",
  ...props
}: BadgeProps) => {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset backdrop-blur-sm ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};
