"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
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
  countActiveFilters,
  filtersToParams,
  type PropertyFilterState,
  type SortKey,
} from "@/lib/property-filter";
import { PAGE_SIZE_OPTIONS } from "@/lib/constants";
import type { Property } from "@/lib/types";

interface Props {
  initialFilters: PropertyFilterState;
  items: Property[];
  total: number;
  highlightId?: string;
}

export function DashboardListingClient({
  initialFilters,
  items,
  total,
  highlightId,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const filters = initialFilters;

  const [searchText, setSearchText] = useState(filters.q);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSearchText(filters.q);
  }, [filters.q]);

  const pushFilters = useCallback(
    (next: PropertyFilterState) => {
      const qs = filtersToParams(next).toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router],
  );

  const patchFilters = useCallback(
    (patch: Partial<PropertyFilterState>) => {
      const next = { ...filters, ...patch };
      if (!("page" in patch)) next.page = 1;
      pushFilters(next);
    },
    [filters, pushFilters],
  );

  function handleSearchChange(value: string) {
    setSearchText(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      patchFilters({ q: value });
    }, 300);
  }

  function handleSort(key: SortKey) {
    if (filters.sort === key) {
      patchFilters({ dir: filters.dir === "asc" ? "desc" : "asc" });
    } else {
      patchFilters({ sort: key, dir: "asc" });
    }
  }

  function handleReset() {
    setSearchText("");
    router.replace(pathname, { scroll: false });
  }

  const activeCount = countActiveFilters(filters);
  const totalPages = Math.max(1, Math.ceil(total / filters.pageSize));
  const page = Math.min(filters.page, totalPages);

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

        {/* Tabel */}
        <PropertyTable
          items={items}
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
