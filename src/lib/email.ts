import "server-only";

// Pengiriman email via Resend REST API (tanpa dependency tambahan).
// Aktif hanya bila RESEND_API_KEY & ADMIN_EMAIL diset; jika tidak → no-op
// agar fitur lain tetap jalan di dev (AC-4.2).

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

export interface SendEmailResult {
  ok: boolean;
  skipped?: boolean;
  error?: string;
}

const FROM = process.env.EMAIL_FROM ?? "Prime Property <onboarding@resend.dev>";

export async function sendEmail({
  to,
  subject,
  html,
  replyTo,
}: SendEmailParams): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // Belum dikonfigurasi → lewati tanpa menggagalkan alur pemanggil.
    return { ok: true, skipped: true };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM,
        to,
        subject,
        html,
        ...(replyTo ? { reply_to: replyTo } : {}),
      }),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      return { ok: false, error: `Resend ${res.status}: ${detail}` };
    }
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Gagal kirim email." };
  }
}

/** Notifikasi pesan kontak baru ke admin (AC-4.2). */
export async function notifyContactMessage(msg: {
  nama: string;
  email: string;
  noHp: string;
  pesan: string;
}): Promise<SendEmailResult> {
  const to = process.env.ADMIN_EMAIL;
  if (!to) return { ok: true, skipped: true };

  const esc = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const html = `
    <div style="font-family:Inter,Arial,sans-serif;color:#1A1A1A">
      <h2 style="color:#1A1A1A">Pesan Kontak Baru — Prime Property</h2>
      <table style="border-collapse:collapse">
        <tr><td style="padding:4px 12px 4px 0;color:#666">Nama</td><td><strong>${esc(msg.nama)}</strong></td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#666">Email</td><td>${esc(msg.email)}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#666">No. HP</td><td>${esc(msg.noHp)}</td></tr>
      </table>
      <p style="margin-top:16px;color:#666">Pesan:</p>
      <blockquote style="border-left:3px solid #C9A961;margin:0;padding:8px 16px;background:#F5F5F5">
        ${esc(msg.pesan).replace(/\n/g, "<br/>")}
      </blockquote>
    </div>
  `;

  return sendEmail({
    to,
    subject: `Pesan kontak baru dari ${msg.nama}`,
    html,
    replyTo: msg.email,
  });
}
