// Logika filter, sort, & sinkronisasi URL untuk listing properti (AC-7.2).

import type { Hadap, Property, Siap, StatusProperty, Tipe } from "./types";

export type CarportFilter = "all" | "yes" | "no";
export type TipeFilter = "all" | Tipe;
export type StatusFilter = "all" | StatusProperty;
export type SortKey = "nama" | "harga" | "tanggal" | "status";
export type SortDir = "asc" | "desc";

export interface PropertyFilterState {
  q: string;
  kawasan: string[];
  hadap: Hadap[];
  siap: Siap[];
  lebarMin: string; // simpan sbg string utk kontrol input
  hargaMax: string;
  tipe: TipeFilter;
  status: StatusFilter;
  carport: CarportFilter;
  sort: SortKey;
  dir: SortDir;
  page: number;
  pageSize: number;
}

export const DEFAULT_FILTER: PropertyFilterState = {
  q: "",
  kawasan: [],
  hadap: [],
  siap: [],
  lebarMin: "",
  hargaMax: "",
  tipe: "all",
  status: "all",
  carport: "all",
  sort: "tanggal",
  dir: "desc",
  page: 1,
  pageSize: 50,
};

export function parseFilters(sp: URLSearchParams): PropertyFilterState {
  const getArr = (k: string) =>
    sp.get(k) ? sp.get(k)!.split(",").filter(Boolean) : [];

  return {
    q: sp.get("q") ?? "",
    kawasan: getArr("kawasan"),
    hadap: getArr("hadap") as Hadap[],
    siap: getArr("siap") as Siap[],
    lebarMin: sp.get("lebarMin") ?? "",
    hargaMax: sp.get("hargaMax") ?? "",
    tipe: (sp.get("tipe") as TipeFilter) || "all",
    status: (sp.get("status") as StatusFilter) || "all",
    carport: (sp.get("carport") as CarportFilter) || "all",
    sort: (sp.get("sort") as SortKey) || "tanggal",
    dir: (sp.get("dir") as SortDir) || "desc",
    page: Math.max(1, Number(sp.get("page")) || 1),
    pageSize: Number(sp.get("pageSize")) || 50,
  };
}

export function filtersToParams(f: PropertyFilterState): URLSearchParams {
  const sp = new URLSearchParams();
  if (f.q) sp.set("q", f.q);
  if (f.kawasan.length) sp.set("kawasan", f.kawasan.join(","));
  if (f.hadap.length) sp.set("hadap", f.hadap.join(","));
  if (f.siap.length) sp.set("siap", f.siap.join(","));
  if (f.lebarMin) sp.set("lebarMin", f.lebarMin);
  if (f.hargaMax) sp.set("hargaMax", f.hargaMax);
  if (f.tipe !== "all") sp.set("tipe", f.tipe);
  if (f.status !== "all") sp.set("status", f.status);
  if (f.carport !== "all") sp.set("carport", f.carport);
  if (f.sort !== "tanggal") sp.set("sort", f.sort);
  if (f.dir !== "desc") sp.set("dir", f.dir);
  if (f.page !== 1) sp.set("page", String(f.page));
  if (f.pageSize !== 50) sp.set("pageSize", String(f.pageSize));
  return sp;
}

/** Jumlah filter aktif (selain sort/pagination) — untuk badge & tombol reset. */
export function countActiveFilters(f: PropertyFilterState): number {
  let n = 0;
  if (f.q) n++;
  if (f.kawasan.length) n++;
  if (f.hadap.length) n++;
  if (f.siap.length) n++;
  if (f.lebarMin) n++;
  if (f.hargaMax) n++;
  if (f.tipe !== "all") n++;
  if (f.status !== "all") n++;
  if (f.carport !== "all") n++;
  return n;
}

export function applyFilters(
  items: Property[],
  f: PropertyFilterState,
): Property[] {
  const q = f.q.trim().toLowerCase();
  const lebarMin = f.lebarMin ? Number(f.lebarMin) : null;
  const hargaMax = f.hargaMax ? Number(f.hargaMax) : null;

  const filtered = items.filter((p) => {
    if (q) {
      const hay = `${p.nama_property} ${p.group ?? ""} ${p.kawasan.join(" ")}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    if (f.kawasan.length && !p.kawasan.some((k) => f.kawasan.includes(k)))
      return false;
    if (f.hadap.length && !p.hadap.some((h) => f.hadap.includes(h)))
      return false;
    if (f.siap.length && !f.siap.includes(p.siap)) return false;
    if (lebarMin !== null && p.lebar < lebarMin) return false;
    if (hargaMax !== null && p.price > hargaMax) return false;
    if (f.tipe !== "all" && p.tipe !== f.tipe) return false;
    if (f.status !== "all" && p.status !== f.status) return false;
    if (f.carport === "yes" && !p.carport) return false;
    if (f.carport === "no" && p.carport) return false;
    return true;
  });

  const dir = f.dir === "asc" ? 1 : -1;
  filtered.sort((a, b) => {
    switch (f.sort) {
      case "nama":
        return a.nama_property.localeCompare(b.nama_property) * dir;
      case "harga":
        return (a.price - b.price) * dir;
      case "status":
        return a.status.localeCompare(b.status) * dir;
      case "tanggal":
      default:
        return (
          (new Date(a.created_at).getTime() - new Date(b.created_at).getTime()) *
          dir
        );
    }
  });

  return filtered;
}
