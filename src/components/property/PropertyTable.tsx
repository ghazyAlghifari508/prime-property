"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowDown,
  ArrowUp,
  ChevronsUpDown,
  Check,
  Compass,
  Layers,
  Minus,
} from "lucide-react";
import { SiapBadge, StatusBadge } from "@/components/common/StatusBadge";
import { formatTanggal, formatDimensi, formatRupiah } from "@/lib/format";
import type { SortDir, SortKey } from "@/lib/property-filter";
import type { Property } from "@/lib/types";
import { cn } from "@/lib/utils";

interface Props {
  items: Property[];
  sort: SortKey;
  dir: SortDir;
  onSort: (key: SortKey) => void;
  highlightId?: string;
}

const TH =
  "px-4 py-3.5 text-left text-[0.7rem] font-semibold uppercase tracking-wider text-muted-foreground";

function SortTh({
  label,
  sortKey,
  active,
  dir,
  onSort,
  className,
  align = "left",
}: {
  label: string;
  sortKey: SortKey;
  active: boolean;
  dir: SortDir;
  onSort: (k: SortKey) => void;
  className?: string;
  align?: "left" | "right" | "center";
}) {
  return (
    <th className={cn(TH, className)}>
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        className={cn(
          "inline-flex items-center gap-1 uppercase tracking-wider transition-colors hover:text-prime-gold-dark",
          active && "text-prime-black",
          align === "right" && "flex-row-reverse",
          align === "center" && "mx-auto",
        )}
      >
        {label}
        {active ? (
          dir === "asc" ? (
            <ArrowUp className="size-3.5 text-prime-gold-dark" />
          ) : (
            <ArrowDown className="size-3.5 text-prime-gold-dark" />
          )
        ) : (
          <ChevronsUpDown className="size-3 opacity-40" />
        )}
      </button>
    </th>
  );
}

export function PropertyTable({
  items,
  sort,
  dir,
  onSort,
  highlightId,
}: Props) {
  const router = useRouter();
  const highlightRef = useRef<HTMLTableRowElement | null>(null);
  // Sorot entry baru (AC-8.1) lalu pudar setelah beberapa detik.
  const [dismissedHighlightId, setDismissedHighlightId] = useState<string | null>(null);

  useEffect(() => {
    if (!highlightId) return;
    highlightRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
    const t = setTimeout(() => setDismissedHighlightId(highlightId), 3500);
    return () => clearTimeout(t);
  }, [highlightId]);

  const showHighlight = Boolean(highlightId && dismissedHighlightId !== highlightId);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-prime-white py-20 text-center">
        <div className="mb-3 flex size-14 items-center justify-center rounded-full bg-soft-gray">
          <Layers className="size-6 text-muted-foreground" />
        </div>
        <p className="font-medium text-prime-black">
          Tidak ada properti yang cocok
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Coba ubah atau reset filter pencarian Anda.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-prime-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-border bg-soft-gray/70">
              <SortTh
                label="Properti"
                sortKey="nama"
                active={sort === "nama"}
                dir={dir}
                onSort={onSort}
                className="min-w-[200px]"
              />
              <th className={cn(TH, "whitespace-nowrap")}>Group</th>
              <th className={cn(TH, "whitespace-nowrap")}>Dimensi</th>
              <th className={cn(TH, "whitespace-nowrap")}>Hadap</th>
              <th className={cn(TH, "text-center")}>Tipe</th>
              <th className={cn(TH, "text-center")}>Tingkat</th>
              <SortTh
                label="Harga"
                sortKey="harga"
                active={sort === "harga"}
                dir={dir}
                onSort={onSort}
                className="text-right"
                align="right"
              />
              <th className={cn(TH, "text-center")}>Carport</th>
              <SortTh
                label="Status"
                sortKey="status"
                active={sort === "status"}
                dir={dir}
                onSort={onSort}
              />
              <th className={TH}>Kesiapan</th>
              <th className={TH}>Kawasan</th>
              <SortTh
                label="Tanggal"
                sortKey="tanggal"
                active={sort === "tanggal"}
                dir={dir}
                onSort={onSort}
                className="whitespace-nowrap"
              />
            </tr>
          </thead>
          <tbody className="divide-y divide-border/70">
            {items.map((p) => {
              const highlighted = showHighlight && p.id === highlightId;
              return (
              <tr
                key={p.id}
                ref={p.id === highlightId ? highlightRef : undefined}
                onClick={() => router.push(`/agent/dashboard/${p.id}`)}
                className={cn(
                  "group cursor-pointer bg-prime-white transition-colors odd:bg-soft-gray/25 hover:bg-prime-gold/[0.06]",
                  highlighted &&
                    "animate-pulse bg-prime-gold/15 odd:bg-prime-gold/15",
                )}
              >
                {/* Properti: nama */}
                <td className="relative px-4 py-3.5">
                  <span className="absolute inset-y-0 left-0 w-0.5 bg-prime-gold opacity-0 transition-opacity group-hover:opacity-100" />
                  <div className="font-semibold text-prime-black">
                    {p.nama_property}
                  </div>
                </td>

                {/* Group */}
                <td className="whitespace-nowrap px-4 py-3.5 text-foreground/80">
                  {p.group ?? "—"}
                </td>

                {/* Dimensi */}
                <td className="whitespace-nowrap px-4 py-3.5 tabular-nums text-foreground/80">
                  {formatDimensi(p.lebar, p.panjang)}
                </td>

                {/* Hadap */}
                <td className="whitespace-nowrap px-4 py-3.5 text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <Compass className="size-3.5 text-prime-gold" />
                    {p.hadap.join(", ")}
                  </span>
                </td>

                {/* Tipe */}
                <td className="px-4 py-3.5 text-center">
                  <span className="inline-flex rounded-md border border-border bg-soft-gray/60 px-2 py-0.5 text-xs font-medium text-foreground/80">
                    {p.tipe}
                  </span>
                </td>

                {/* Tingkat */}
                <td className="px-4 py-3.5 text-center tabular-nums text-foreground/80">
                  {p.tingkat.toLocaleString("id-ID")}
                </td>

                {/* Harga */}
                <td className="whitespace-nowrap px-4 py-3.5 text-right font-semibold tabular-nums text-prime-black">
                  {formatRupiah(p.price)}
                </td>

                {/* Carport */}
                <td className="px-4 py-3.5 text-center">
                  {p.carport ? (
                    <Check className="mx-auto size-4 text-green-600" />
                  ) : (
                    <Minus className="mx-auto size-4 text-muted-foreground/50" />
                  )}
                </td>

                {/* Status */}
                <td className="px-4 py-3.5 whitespace-nowrap">
                  <StatusBadge status={p.status} />
                </td>

                {/* Kesiapan */}
                <td className="px-4 py-3.5 whitespace-nowrap">
                  <SiapBadge siap={p.siap} />
                </td>

                {/* Kawasan */}
                <td className="px-4 py-3.5">
                  <div className="flex flex-wrap gap-1">
                    {p.kawasan.map((k) => (
                      <span
                        key={k}
                        className="rounded-md bg-soft-gray px-1.5 py-0.5 text-xs text-muted-foreground"
                      >
                        {k}
                      </span>
                    ))}
                  </div>
                </td>

                {/* Tanggal */}
                <td className="whitespace-nowrap px-4 py-3.5 text-xs text-muted-foreground">
                  {formatTanggal(p.created_at)}
                </td>
              </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
