import { cn } from "@/lib/cn";
import type { HTMLAttributes } from "react";

const toneClasses: Record<string, string> = {
  low: "bg-emerald-50 text-emerald-700",
  medium: "bg-amber-50 text-amber-700",
  high: "bg-orange-50 text-orange-700",
  critical: "bg-rose-50 text-rose-700",
};

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: "low" | "medium" | "high" | "critical";
};

export function Badge({ className, tone = "low", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
        toneClasses[tone],
        className,
      )}
      {...props}
    />
  );
}
