// Helper format — locale Indonesia & timezone WIB (AC-9.3)

/** Format angka rupiah → "Rp 1.350.000.000" (titik separator ribuan). */
export function formatRupiah(value: number): string {
  if (!Number.isFinite(value)) return "Rp 0";
  return "Rp " + Math.round(value).toLocaleString("id-ID");
}

/** Format angka ringkas → "1,35 M" / "850 Jt" untuk badge/kartu. */
export function formatRupiahRingkas(value: number): string {
  if (value >= 1_000_000_000) {
    return "Rp " + (value / 1_000_000_000).toLocaleString("id-ID", { maximumFractionDigits: 2 }) + " M";
  }
  if (value >= 1_000_000) {
    return "Rp " + (value / 1_000_000).toLocaleString("id-ID", { maximumFractionDigits: 0 }) + " Jt";
  }
  return formatRupiah(value);
}

const TANGGAL_FMT = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Asia/Jakarta",
});

const TANGGAL_WAKTU_FMT = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Asia/Jakarta",
});

/** Format ISO date → "24 Mei 2026" (WIB). */
export function formatTanggal(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  return TANGGAL_FMT.format(d);
}

/** Format ISO date → "24 Mei 2026, 14.30" (WIB). */
export function formatTanggalWaktu(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "-";
  return TANGGAL_WAKTU_FMT.format(d).replace(/\./g, ":").replace(/:(\d{2}:\d{2})/, ", $1");
}

/** Format dimensi → "4.5 × 21.5 m". */
export function formatDimensi(lebar: number, panjang: number): string {
  const f = (n: number) => n.toLocaleString("id-ID", { maximumFractionDigits: 2 });
  return `${f(lebar)} × ${f(panjang)} m`;
}

/** Format tingkat → "2,5 lantai". */
export function formatTingkat(tingkat: number): string {
  return `${tingkat.toLocaleString("id-ID", { maximumFractionDigits: 1 })} lantai`;
}
