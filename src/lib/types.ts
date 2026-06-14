// Domain types — Prime Property (AC-5.2, AC-6.1)

export type Role = "admin" | "superadmin";

export type Hadap = "Utara" | "Selatan" | "Timur" | "Barat";

export type Tipe = "Ruko" | "Villa";

export type StatusProperty = "in_stock" | "sold_out";

export type Siap = "siap_huni" | "siap_kosong" | "siap_huni_renovasi";

export interface Property {
  id: string;
  nama_property: string; // min 3, max 100
  group: string | null;
  lebar: number; // meter, > 0, max 2 desimal
  panjang: number; // meter, > 0, max 2 desimal
  hadap: Hadap[]; // multi
  tipe: Tipe;
  tingkat: number; // 1–10, max 1 desimal
  price: number; // integer rupiah penuh (bukan float)
  carport: boolean;
  status: StatusProperty;
  siap: Siap;
  maps_link: string | null; // URL google.com/maps
  kawasan: string[]; // multitag
  unit: string | null;
  image_url: string | null; // foto properti (hanya untuk display publik; AC: tanpa upload di internal)
  created_at: string; // ISO string
  updated_at: string; // ISO string
  created_by: string; // User id
  deleted_at: string | null; // soft delete
}

export interface User {
  id: string;
  nama: string;
  email: string;
  role: Role;
  is_active: boolean;
  created_at: string;
  // catatan: password_hash hanya ada di backend (fase berikutnya)
}

export type AuditAction = "create" | "update" | "delete" | "restore";

export interface AuditLog {
  id: string;
  user_id: string;
  user_nama: string;
  property_id: string | null;
  property_nama: string;
  action: AuditAction;
  // ringkasan perubahan field (untuk update)
  changes: { field: string; before: string; after: string }[];
  created_at: string;
}
