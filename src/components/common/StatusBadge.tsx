import { cn } from "@/lib/utils";
import { SIAP_LABEL_SHORT, STATUS_LABEL } from "@/lib/constants";
import type { Siap, StatusProperty } from "@/lib/types";

/**
 * Status (AC-7.1) — badge berwarna:
 * - In Stock → hijau muda
 * - Sold Out → merah (#B33A3A)
 */
export function StatusBadge({ status }: { status: StatusProperty }) {
  const inStock = status === "in_stock";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.7rem] font-semibold tracking-wide whitespace-nowrap",
        inStock
          ? "bg-[var(--status-instock-bg)] text-[var(--status-instock-fg)]"
          : "bg-[var(--status-soldout-bg)] text-[var(--status-soldout-fg)]",
      )}
    >
      <span
        className={cn(
          "shrink-0 rounded-full size-1.5",
          inStock ? "bg-[var(--status-instock-fg)]" : "bg-[var(--status-soldout-fg)]",
        )}
      />
      {STATUS_LABEL[status]}
    </span>
  );
}

/**
 * Kesiapan (AC-7.1) — badge berwarna sesuai AC:
 * - Siap Huni → kuning/emas
 * - Siap Kosong → ungu muda
 * - Siap Huni (Renovasi) → oranye
 */
const SIAP_STYLE: Record<
  Siap,
  { bg: string; fg: string }
> = {
  siap_huni: { bg: "var(--status-siaphuni-bg)", fg: "var(--status-siaphuni-fg)" },
  siap_kosong: { bg: "var(--status-siapkosong-bg)", fg: "var(--status-siapkosong-fg)" },
  siap_huni_renovasi: { bg: "var(--status-renovasi-bg)", fg: "var(--status-renovasi-fg)" },
};

export function SiapBadge({ siap }: { siap: Siap }) {
  const style = SIAP_STYLE[siap];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.7rem] font-semibold tracking-wide whitespace-nowrap"
      style={{ backgroundColor: style.bg, color: style.fg }}
    >
      {SIAP_LABEL_SHORT[siap]}
    </span>
  );
}
