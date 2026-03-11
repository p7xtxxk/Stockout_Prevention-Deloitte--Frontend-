import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "../../utils/formatters";

interface CardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  noPadding?: boolean;
  hoverEffect?: boolean;
}

export const Card = ({
  children,
  className = "",
  noPadding = false,
  hoverEffect = false,
  ...props
}: CardProps) => {
  return (
    <motion.div
      className={cn(
        "app-surface overflow-hidden rounded-3xl",
        hoverEffect &&
          "hover:-translate-y-1 hover:border-primary-500/40 hover:shadow-[0_24px_40px_rgba(0,0,0,0.5)] transition-all duration-300",
        className,
      )}
      {...props}
    >
      {noPadding ? children : <div className="p-6">{children}</div>}
    </motion.div>
  );
};

export const CardHeader = ({
  children,
  className = "",
  action,
}: {
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "flex items-center justify-between border-b border-white/8 bg-white/5 px-6 py-5 backdrop-blur-sm",
        className,
      )}
    >
      <div className="flex-1 shrink-0">{children}</div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};

export const CardTitle = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <h3
      className={cn(
        "text-lg font-semibold leading-6 text-slate-900",
        className,
      )}
    >
      {children}
    </h3>
  );
};

export const CardContent = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <div className={cn("px-6 py-5", className)}>{children}</div>;
};
