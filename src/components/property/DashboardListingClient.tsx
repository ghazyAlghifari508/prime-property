"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";
import { FilterChips } from "@/components/common/FilterChips";
import { PropertyFilters } from "@/components/property/PropertyFilters";
import { PropertyTable } from "@/components/property/PropertyTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  applyFilters,
  countActiveFilters,
  DEFAULT_FILTER,
  filtersToParams,
  type PropertyFilterState,
  type SortKey,
} from "@/lib/property-filter";
import { PAGE_SIZE_OPTIONS } from "@/lib/constants";
import type { Property } from "@/lib/types";

interface Props {
  initialFilters: PropertyFilterState;
  allItems: Property[];
  highlightId?: string;
}

export function DashboardListingClient({
  initialFilters,
  allItems,
  highlightId,
}: Props) {
  const pathname = usePathname();

  // State filter lokal — perubahan TIDAK trigger router navigate (AC-7.2)
  const [filters, setFilters] = useState<PropertyFilterState>(initialFilters);
  const [searchText, setSearchText] = useState(initialFilters.q);
  // Snapshot of initialFilters for back/forward detection: effect sets it to next
  const [knownFiltersKey, setKnownFiltersKey] = useState(() =>
    JSON.stringify(initialFilters),
  );
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Re-sync jika initialFilters dari server berubah (misal dari navigasi browser back/forward)
  // Detects change via stringified comparison to avoid sync setState lint rule.
  const nextKey = JSON.stringify(initialFilters);
  if (nextKey !== knownFiltersKey) {
    setFilters(initialFilters);
    setSearchText(initialFilters.q);
    setKnownFiltersKey(nextKey);
  }

  // Sinkron URL secara silent via useEffect — tidak boleh di dalam setFilters updater (AC-7.2)
  useEffect(() => {
    const qs = filtersToParams(filters).toString();
    const url = qs ? `${pathname}?${qs}` : pathname;
    window.history.replaceState(null, "", url);
  }, [filters, pathname]);

  const patchFilters = (patch: Partial<PropertyFilterState>) => {
    setFilters((prev) => {
      const next = { ...prev, ...patch };
      if (!("page" in patch)) next.page = 1;
      return next;
    });
  };

  function handleSearchChange(value: string) {
    setSearchText(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      patchFilters({ q: value });
    }, 300);
  }

  function handleSort(key: SortKey) {
    setFilters((prev) => {
      const next = { ...prev };
      if (next.sort === key) {
        next.dir = next.dir === "asc" ? "desc" : "asc";
      } else {
        next.sort = key;
        next.dir = "asc";
      }
      next.page = 1;
      return next;
    });
  }

  function handleReset() {
    setSearchText("");
    setFilters((prev) => ({ ...DEFAULT_FILTER, pageSize: prev.pageSize }));
  }

  // ===== Filter & pagination 100% client-side (AC-7.2 real-time) =====

  const filtered = useMemo(() => applyFilters(allItems, filters), [allItems, filters]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / filters.pageSize));
  const page = Math.min(filters.page, totalPages);

  const pageItems = useMemo(() => {
    const start = (page - 1) * filters.pageSize;
    return filtered.slice(start, start + filters.pageSize);
  }, [filtered, page, filters.pageSize]);

  const activeCount = countActiveFilters(filters);

  return (
    <div className="flex gap-6">
      {/* Sidebar filter (desktop) */}
      <aside className="hidden w-72 shrink-0 lg:block">
        <div className="sticky top-24 rounded-2xl border border-border bg-prime-white p-5 shadow-sm">
          <PropertyFilters
            filters={filters}
            onChange={patchFilters}
            onReset={handleReset}
          />
        </div>
      </aside>

      {/* Konten utama */}
      <div className="min-w-0 flex-1 space-y-4">
        {/* Toolbar: search + filter mobile + sort */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[200px] flex-1">
            <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchText}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Cari nama, group, atau kawasan…"
              className="h-11 rounded-xl border-border bg-prime-white pl-10 shadow-sm"
            />
          </div>

          {/* Filter mobile (sheet) */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="h-11 rounded-xl lg:hidden">
                <SlidersHorizontal className="mr-1 size-4" />
                Filter
                {activeCount > 0 && (
                  <span className="ml-1 flex size-5 items-center justify-center rounded-full bg-prime-gold text-xs text-prime-black">
                    {activeCount}
                  </span>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[320px] overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Filter Properti</SheetTitle>
              </SheetHeader>
              <div className="px-4 pb-6">
                <PropertyFilters
                  filters={filters}
                  onChange={patchFilters}
                  onReset={handleReset}
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Chip filter aktif */}
        <FilterChips filters={filters} onChange={patchFilters} />

        {/* Info hasil */}
        <p className="text-sm text-muted-foreground">
          Menampilkan {total} properti
        </p>

        {/* Tabel */}
        <PropertyTable
          items={pageItems}
          sort={filters.sort}
          dir={filters.dir}
          onSort={handleSort}
          highlightId={highlightId}
        />

        {/* Pagination + page size */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-prime-white px-4 py-3 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Baris per halaman</span>
            <Select
              value={String(filters.pageSize)}
              onValueChange={(v) =>
                patchFilters({ pageSize: Number(v), page: 1 })
              }
            >
              <SelectTrigger className="h-9 w-[80px] rounded-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAGE_SIZE_OPTIONS.map((s) => (
                  <SelectItem key={s} value={String(s)}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {total > 0 && (
            <Pagination className="mx-0 w-auto">
              <PaginationContent>
                <PaginationItem>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-lg"
                    disabled={page <= 1}
                    onClick={() => patchFilters({ page: page - 1 })}
                  >
                    Sebelumnya
                  </Button>
                </PaginationItem>
                <PaginationItem>
                  <span className="px-3 text-sm tabular-nums text-muted-foreground">
                    Hal <span className="font-semibold text-prime-black">{page}</span> / {totalPages}
                  </span>
                </PaginationItem>
                <PaginationItem>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-lg"
                    disabled={page >= totalPages}
                    onClick={() => patchFilters({ page: page + 1 })}
                  >
                    Berikutnya
                  </Button>
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>
      </div>
    </div>
  );
}
