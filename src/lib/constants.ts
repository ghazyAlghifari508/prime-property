// Opsi enum & label Bahasa Indonesia — single source of truth untuk form & filter

import type { Hadap, Siap, StatusProperty, Tipe } from "./types";

export const HADAP_OPTIONS: Hadap[] = ["Utara", "Selatan", "Timur", "Barat"];

export const TIPE_OPTIONS: Tipe[] = ["Ruko", "Villa"];

export const STATUS_OPTIONS: { value: StatusProperty; label: string }[] = [
  { value: "in_stock", label: "In Stock" },
  { value: "sold_out", label: "Sold Out" },
];

export const SIAP_OPTIONS: { value: Siap; label: string }[] = [
  { value: "siap_huni", label: "Siap Huni" },
  { value: "siap_kosong", label: "Siap Kosong" },
  { value: "siap_huni_renovasi", label: "Siap Huni (Renovasi)" },
];

// Kawasan (contoh kota Medan & sekitarnya) — multitag
export const KAWASAN_OPTIONS: string[] = [
  "Krakatau",
  "Pancing",
  "Cemara Asri",
  "Kuala",
  "Helvetia",
  "Tembung",
  "Marelan",
  "Sunggal",
  "Johor",
  "Polonia",
  "Setia Budi",
  "Ringroad",
];

export const STATUS_LABEL: Record<StatusProperty, string> = {
  in_stock: "In Stock",
  sold_out: "Sold Out",
};

export const SIAP_LABEL: Record<Siap, string> = {
  siap_huni: "Siap Huni",
  siap_kosong: "Siap Kosong",
  siap_huni_renovasi: "Siap Huni (Renovasi)",
};

// Label ringkas untuk badge/tabel (agar tidak terpotong)
export const SIAP_LABEL_SHORT: Record<Siap, string> = {
  siap_huni: "Siap Huni",
  siap_kosong: "Siap Kosong",
  siap_huni_renovasi: "Renovasi",
};

export const PAGE_SIZE_OPTIONS = [25, 50, 100] as const;
export const DEFAULT_PAGE_SIZE = 50;

// Kontak Prime Property (mock)
export const KONTAK = {
  alamat: "Jl. Krakatau No. 88, Medan, Sumatera Utara 20238",
  telepon: "(061) 1234-5678",
  whatsapp: "6281234567890", // dipakai untuk wa.me/<nomor>
  email: "halo@primeproperty.id",
  jam: "Senin – Sabtu, 09.00 – 18.00 WIB",
} as const;
