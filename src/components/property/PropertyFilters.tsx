"use client";

import { RotateCcw } from "lucide-react";
import { MultiSelect } from "@/components/common/MultiSelect";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  HADAP_OPTIONS,
  KAWASAN_OPTIONS,
  SIAP_OPTIONS,
} from "@/lib/constants";
import type {
  CarportFilter,
  PropertyFilterState,
  StatusFilter,
  TipeFilter,
} from "@/lib/property-filter";
import { countActiveFilters } from "@/lib/property-filter";
import type { Hadap, Siap } from "@/lib/types";

interface Props {
  filters: PropertyFilterState;
  onChange: (patch: Partial<PropertyFilterState>) => void;
  onReset: () => void;
}

function formatRupiahInput(value: string): string {
  if (!value) return "";
  const digits = value.replace(/\D/g, "");
  if (!digits) return "";
  return "Rp " + Number(digits).toLocaleString("id-ID");
}

function onlyDigits(value: string): string {
  return value.replace(/\D/g, "");
}

export function PropertyFilters({ filters, onChange, onReset }: Props) {
  const activeCount = countActiveFilters(filters);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-prime-black">
          <span className="h-4 w-1 rounded-full bg-prime-gold" />
          Filter
          {activeCount > 0 && (
            <span className="flex size-5 items-center justify-center rounded-full bg-prime-gold text-[0.7rem] font-bold text-prime-black">
              {activeCount}
            </span>
          )}
        </h2>
        {activeCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="h-7 px-2 text-xs text-prime-red hover:text-prime-red"
          >
            <RotateCcw className="mr-1 size-3" />
            Reset
          </Button>
        )}
      </div>

      {/* Kawasan */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Kawasan</Label>
        <MultiSelect
          options={KAWASAN_OPTIONS.map((k) => ({ value: k, label: k }))}
          selected={filters.kawasan}
          onChange={(v) => onChange({ kawasan: v })}
          placeholder="Semua kawasan"
          searchPlaceholder="Cari kawasan…"
        />
      </div>

      {/* Hadap */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Hadap</Label>
        <MultiSelect
          options={HADAP_OPTIONS.map((h) => ({ value: h, label: h }))}
          selected={filters.hadap}
          onChange={(v) => onChange({ hadap: v as Hadap[] })}
          placeholder="Semua arah"
        />
      </div>

      {/* Siap */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Kesiapan</Label>
        <MultiSelect
          options={SIAP_OPTIONS.map((s) => ({ value: s.value, label: s.label }))}
          selected={filters.siap}
          onChange={(v) => onChange({ siap: v as Siap[] })}
          placeholder="Semua"
        />
      </div>

      {/* Lebar min & Harga max */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="lebarMin" className="text-xs text-muted-foreground">
            Lebar min (m)
          </Label>
          <Input
            id="lebarMin"
            type="number"
            min={0}
            step={0.5}
            value={filters.lebarMin}
            onChange={(e) => onChange({ lebarMin: e.target.value })}
            placeholder="0"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="hargaMax" className="text-xs text-muted-foreground">
            Harga max
          </Label>
          <Input
            id="hargaMax"
            type="text"
            inputMode="numeric"
            value={formatRupiahInput(filters.hargaMax)}
            onChange={(e) => onChange({ hargaMax: onlyDigits(e.target.value) })}
            placeholder="Tanpa batas"
          />
        </div>
      </div>

      {/* Tipe */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Tipe</Label>
        <RadioGroup
          value={filters.tipe}
          onValueChange={(v) => onChange({ tipe: v as TipeFilter })}
          className="flex flex-wrap gap-3"
        >
          {[
            { v: "all", l: "Semua" },
            { v: "Ruko", l: "Ruko" },
            { v: "Villa", l: "Villa" },
          ].map((o) => (
            <label key={o.v} className="flex items-center gap-1.5 text-sm">
              <RadioGroupItem value={o.v} id={`tipe-${o.v}`} />
              {o.l}
            </label>
          ))}
        </RadioGroup>
      </div>

      {/* Status */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Status</Label>
        <RadioGroup
          value={filters.status}
          onValueChange={(v) => onChange({ status: v as StatusFilter })}
          className="flex flex-wrap gap-3"
        >
          {[
            { v: "all", l: "Semua" },
            { v: "in_stock", l: "In Stock" },
            { v: "sold_out", l: "Sold Out" },
          ].map((o) => (
            <label key={o.v} className="flex items-center gap-1.5 text-sm">
              <RadioGroupItem value={o.v} id={`status-${o.v}`} />
              {o.l}
            </label>
          ))}
        </RadioGroup>
      </div>

      {/* Carport */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Carport</Label>
        <RadioGroup
          value={filters.carport}
          onValueChange={(v) => onChange({ carport: v as CarportFilter })}
          className="flex flex-wrap gap-3"
        >
          {[
            { v: "all", l: "Semua" },
            { v: "yes", l: "Ya" },
            { v: "no", l: "Tidak" },
          ].map((o) => (
            <label key={o.v} className="flex items-center gap-1.5 text-sm">
              <RadioGroupItem value={o.v} id={`carport-${o.v}`} />
              {o.l}
            </label>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
}
