import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  accent?: "gold" | "green" | "red" | "neutral";
  hint?: string;
}

const ACCENTS: Record<
  NonNullable<StatCardProps["accent"]>,
  { icon: string; ring: string }
> = {
  gold: { icon: "text-prime-gold-dark", ring: "bg-prime-gold/10" },
  green: { icon: "text-green-700", ring: "bg-green-100" },
  red: { icon: "text-prime-red", ring: "bg-red-100" },
  neutral: { icon: "text-prime-black", ring: "bg-soft-gray" },
};

export function StatCard({
  label,
  value,
  icon: Icon,
  accent = "neutral",
  hint,
}: StatCardProps) {
  const a = ACCENTS[accent];
  return (
    <div className="flex items-center gap-4 rounded-xl border border-border bg-prime-white p-4 transition-shadow hover:shadow-sm">
      <span
        className={cn(
          "flex size-11 shrink-0 items-center justify-center rounded-lg",
          a.ring,
        )}
      >
        <Icon className={cn("size-5", a.icon)} />
      </span>
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <p className="truncate text-2xl font-bold tabular-nums text-prime-black">
          {value}
        </p>
        {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      </div>
    </div>
  );
}
