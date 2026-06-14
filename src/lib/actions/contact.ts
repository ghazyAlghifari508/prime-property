"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { checkContactRateLimit } from "@/lib/rate-limit";
import { notifyContactMessage } from "@/lib/email";

const contactSchema = z.object({
  nama: z.string().trim().min(1, "Nama wajib diisi."),
  email: z.string().trim().email("Format email tidak valid."),
  hp: z
    .string()
    .trim()
    .refine((v) => v.replace(/\D/g, "").length >= 10, "Nomor HP minimal 10 digit."),
  pesan: z.string().trim().min(1, "Pesan wajib diisi."),
});

export interface ContactResult {
  ok: boolean;
  error?: string;
}

export async function submitContact(input: {
  nama: string;
  email: string;
  hp: string;
  pesan: string;
}): Promise<ContactResult> {
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Data tidak valid." };
  }

  const h = await headers();
  const ip =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    h.get("x-real-ip") ??
    "unknown";

  // Rate limit 3/IP/jam (AC-4.2)
  if (!checkContactRateLimit(ip)) {
    return {
      ok: false,
      error: "Terlalu banyak pesan. Coba lagi dalam beberapa saat.",
    };
  }

  await prisma.contactMessage.create({
    data: {
      nama: parsed.data.nama,
      email: parsed.data.email,
      noHp: parsed.data.hp,
      pesan: parsed.data.pesan,
      ipAddress: ip,
    },
  });

  // Email notifikasi ke admin (AC-4.2). Kegagalan kirim TIDAK menggagalkan
  // submit — pesan sudah tersimpan; cukup catat error di server.
  const mail = await notifyContactMessage({
    nama: parsed.data.nama,
    email: parsed.data.email,
    noHp: parsed.data.hp,
    pesan: parsed.data.pesan,
  });
  if (!mail.ok) {
    console.error("[contact] gagal kirim email notifikasi:", mail.error);
  }

  return { ok: true };
}
