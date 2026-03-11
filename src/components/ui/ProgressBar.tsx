import { cn } from "../../utils/formatters";
import { motion } from "framer-motion";

interface ProgressBarProps {
  value: number; // 0 to 100
  max?: number;
  className?: string;
  colorClass?: string;
  showLabel?: boolean;
}

export const ProgressBar = ({
  value,
  max = 100,
  className,
  colorClass = "bg-[linear-gradient(90deg,#7c96f6_0%,#5a6ef0_55%,#4550e6_100%)]",
  showLabel = false,
}: ProgressBarProps) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={cn("w-full flex items-center gap-2", className)}>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200/80 shadow-inner shadow-slate-300/50">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={cn(
            "h-full rounded-full shadow-[0_4px_10px_rgba(69,80,230,0.25)]",
            colorClass,
          )}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-medium text-slate-500 w-8 text-right shrink-0">
          {Math.round(percentage)}%
        </span>
      )}
    </div>
  );
};
