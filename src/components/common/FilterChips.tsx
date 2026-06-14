"use client";

import { X } from "lucide-react";
import { SIAP_LABEL, STATUS_LABEL } from "@/lib/constants";
import type { PropertyFilterState } from "@/lib/property-filter";
import type { Siap, StatusProperty } from "@/lib/types";
import { formatRupiah } from "@/lib/format";

interface Props {
  filters: PropertyFilterState;
  onChange: (patch: Partial<PropertyFilterState>) => void;
}

interface Chip {
  key: string;
  label: string;
  clear: () => void;
}

export function FilterChips({ filters, onChange }: Props) {
  const chips: Chip[] = [];

  if (filters.q)
    chips.push({
      key: "q",
      label: `Cari: "${filters.q}"`,
      clear: () => onChange({ q: "" }),
    });

  filters.kawasan.forEach((k) =>
    chips.push({
      key: `kawasan-${k}`,
      label: k,
      clear: () => onChange({ kawasan: filters.kawasan.filter((x) => x !== k) }),
    }),
  );

  filters.hadap.forEach((h) =>
    chips.push({
      key: `hadap-${h}`,
      label: `Hadap ${h}`,
      clear: () => onChange({ hadap: filters.hadap.filter((x) => x !== h) }),
    }),
  );

  filters.siap.forEach((s) =>
    chips.push({
      key: `siap-${s}`,
      label: SIAP_LABEL[s as Siap],
      clear: () => onChange({ siap: filters.siap.filter((x) => x !== s) }),
    }),
  );

  if (filters.lebarMin)
    chips.push({
      key: "lebarMin",
      label: `Lebar ≥ ${filters.lebarMin} m`,
      clear: () => onChange({ lebarMin: "" }),
    });

  if (filters.hargaMax)
    chips.push({
      key: "hargaMax",
      label: `≤ ${formatRupiah(Number(filters.hargaMax))}`,
      clear: () => onChange({ hargaMax: "" }),
    });

  if (filters.tipe !== "all")
    chips.push({
      key: "tipe",
      label: filters.tipe,
      clear: () => onChange({ tipe: "all" }),
    });

  if (filters.status !== "all")
    chips.push({
      key: "status",
      label: STATUS_LABEL[filters.status as StatusProperty],
      clear: () => onChange({ status: "all" }),
    });

  if (filters.carport !== "all")
    chips.push({
      key: "carport",
      label: `Carport: ${filters.carport === "yes" ? "Ya" : "Tidak"}`,
      clear: () => onChange({ carport: "all" }),
    });

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((c) => (
        <span
          key={c.key}
          className="inline-flex items-center gap-1 rounded-full border border-prime-gold/40 bg-prime-gold/10 py-1 pl-3 pr-1 text-xs font-medium text-prime-black"
        >
          {c.label}
          <button
            type="button"
            onClick={c.clear}
            className="flex size-4 items-center justify-center rounded-full hover:bg-prime-gold/30"
            aria-label={`Hapus filter ${c.label}`}
          >
            <X className="size-3" />
          </button>
        </span>
      ))}
    </div>
  );
}
