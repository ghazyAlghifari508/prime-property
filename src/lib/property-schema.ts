import { z } from "zod";
import { HADAP_OPTIONS } from "./constants";

// Validasi form properti (AC-8.4) — dipakai di client; siap di-reuse server (fase backend).

const hadapEnum = z.enum(["Utara", "Selatan", "Timur", "Barat"]);

export const propertyFormSchema = z.object({
  nama_property: z
    .string()
    .trim()
    .min(3, "Nama minimal 3 karakter.")
    .max(100, "Nama maksimal 100 karakter."),
  group: z.string().trim().max(100).optional().or(z.literal("")),
  lebar: z
    .number({ message: "Lebar wajib diisi." })
    .positive("Lebar harus lebih dari 0.")
    .refine((n) => Number.isFinite(n) && decimals(n) <= 2, "Maksimal 2 desimal."),
  panjang: z
    .number({ message: "Panjang wajib diisi." })
    .positive("Panjang harus lebih dari 0.")
    .refine((n) => Number.isFinite(n) && decimals(n) <= 2, "Maksimal 2 desimal."),
  hadap: z.array(hadapEnum).min(1, "Pilih minimal 1 arah hadap."),
  tipe: z.enum(["Ruko", "Villa"], { message: "Pilih tipe properti." }),
  tingkat: z
    .number({ message: "Tingkat wajib diisi." })
    .min(1, "Tingkat minimal 1.")
    .max(10, "Tingkat maksimal 10.")
    .refine((n) => decimals(n) <= 1, "Maksimal 1 desimal."),
  price: z
    .number({ message: "Harga wajib diisi." })
    .int("Harga harus berupa angka bulat (rupiah).")
    .positive("Harga harus lebih dari 0."),
  carport: z.boolean(),
  status: z.enum(["in_stock", "sold_out"]),
  siap: z.enum(["siap_huni", "siap_kosong", "siap_huni_renovasi"]),
  maps_link: z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .refine(
      (v) => !v || /google\.com\/maps/.test(v),
      "Tautan harus mengandung domain google.com/maps.",
    ),
  kawasan: z.array(z.string()).min(1, "Pilih minimal 1 kawasan."),
  unit: z.string().trim().max(100).optional().or(z.literal("")),
});

export type PropertyFormValues = z.infer<typeof propertyFormSchema>;

function decimals(n: number): number {
  if (Number.isInteger(n)) return 0;
  const s = String(n);
  const i = s.indexOf(".");
  return i === -1 ? 0 : s.length - i - 1;
}

export const HADAP_LIST = HADAP_OPTIONS;
