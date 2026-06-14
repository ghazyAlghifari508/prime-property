import { DoorOpen, Hammer, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import { SIAP_LABEL_SHORT, STATUS_LABEL } from "@/lib/constants";
import type { Siap, StatusProperty } from "@/lib/types";

/**
 * Status (AC-7.1) — gaya editorial minimalis:
 * marker kecil + teks uppercase berwarna, tanpa pill pastel.
 */
export function StatusBadge({ status }: { status: StatusProperty }) {
  const inStock = status === "in_stock";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider",
        inStock ? "text-emerald-700" : "text-prime-red",
      )}
    >
      <span className="relative flex size-2">
        {inStock && (
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500/60" />
        )}
        <span
          className={cn(
            "relative inline-flex size-2 rounded-full",
            inStock ? "bg-emerald-500" : "bg-prime-red",
          )}
        />
      </span>
      {STATUS_LABEL[status]}
    </span>
  );
}

/**
 * Kesiapan — tag netral berkelas yang dibedakan lewat IKON + aksen emas,
 * bukan tiga warna "permen".
 */
const SIAP_ICON: Record<Siap, typeof Home> = {
  siap_huni: Home,
  siap_kosong: DoorOpen,
  siap_huni_renovasi: Hammer,
};

export function SiapBadge({ siap }: { siap: Siap }) {
  const Icon = SIAP_ICON[siap];
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-soft-gray/50 px-2.5 py-1 text-xs font-medium text-foreground/80">
      <Icon className="size-3.5 text-prime-gold-dark" />
      {SIAP_LABEL_SHORT[siap]}
    </span>
  );
}
