"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ArrowUpRight, Send } from "lucide-react";
import { submitContact } from "@/lib/actions/contact";

interface FieldErrors {
  nama?: string;
  email?: string;
  hp?: string;
  pesan?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const inputCls =
  "w-full bg-transparent border border-white/20 px-4 py-3.5 text-sm text-white placeholder:text-white/35 outline-none transition-all duration-300 focus:border-prime-gold/70 focus:ring-1 focus:ring-prime-gold/40 aria-invalid:border-prime-red";

export function ContactFormLux() {
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);

  function validate(data: {
    nama: string;
    email: string;
    hp: string;
    pesan: string;
  }): FieldErrors {
    const e: FieldErrors = {};
    if (data.nama.trim().length < 1) e.nama = "Nama wajib diisi.";
    if (data.email.trim().length < 1) e.email = "Email wajib diisi.";
    else if (!EMAIL_RE.test(data.email)) e.email = "Format email tidak valid.";
    const digits = data.hp.replace(/\D/g, "");
    if (data.hp.trim().length < 1) e.hp = "Nomor HP wajib diisi.";
    else if (digits.length < 10) e.hp = "Nomor HP minimal 10 digit.";
    if (data.pesan.trim().length < 1) e.pesan = "Pesan wajib diisi.";
    return e;
  }

  async function handleSubmit(formData: FormData) {
    const data = {
      nama: String(formData.get("nama") ?? ""),
      email: String(formData.get("email") ?? ""),
      hp: String(formData.get("hp") ?? ""),
      pesan: String(formData.get("pesan") ?? ""),
    };

    const e = validate(data);
    setErrors(e);
    if (Object.keys(e).length > 0) {
      toast.error("Mohon periksa kembali isian formulir.");
      return;
    }

    // Submit ke backend (rate limit 3/IP/jam, AC-4.2)
    setSubmitting(true);
    const result = await submitContact(data);
    setSubmitting(false);
    if (result.ok) {
      toast.success("Pesan terkirim, tim kami akan menghubungi Anda.");
      (
        document.getElementById("contact-form-lux") as HTMLFormElement | null
      )?.reset();
      setErrors({});
    } else {
      toast.error(result.error ?? "Gagal mengirim pesan. Coba lagi nanti.");
    }
  }

  return (
    <form
      id="contact-form-lux"
      action={handleSubmit}
      noValidate
      className="space-y-5"
    >
      <Field label="Nama" required>
        <input
          name="nama"
          placeholder="Nama lengkap Anda"
          aria-invalid={!!errors.nama}
          className={inputCls}
        />
        {errors.nama && <Err>{errors.nama}</Err>}
      </Field>

      <Field label="Email" required>
        <input
          name="email"
          type="email"
          placeholder="nama@email.com"
          aria-invalid={!!errors.email}
          className={inputCls}
        />
        {errors.email && <Err>{errors.email}</Err>}
      </Field>

      <Field label="Nomor HP" required>
        <input
          name="hp"
          type="tel"
          inputMode="numeric"
          placeholder="08xxxxxxxxxx"
          aria-invalid={!!errors.hp}
          className={inputCls}
        />
        {errors.hp && <Err>{errors.hp}</Err>}
      </Field>

      <Field label="Pesan" required>
        <textarea
          name="pesan"
          rows={5}
          placeholder="Tulis pesan atau pertanyaan Anda…"
          aria-invalid={!!errors.pesan}
          className={inputCls + " resize-none"}
        />
        {errors.pesan && <Err>{errors.pesan}</Err>}
      </Field>

      <button
        type="submit"
        disabled={submitting}
        className="group inline-flex w-full items-center justify-center gap-2 bg-prime-gold px-6 py-4 text-sm font-medium tracking-wide text-prime-black transition-all duration-300 hover:bg-[#d9bd78] hover:shadow-[0_8px_30px_-8px_rgba(201,169,97,0.6)] disabled:opacity-60"
      >
        {submitting ? (
          "Mengirim…"
        ) : (
          <>
            <Send className="size-4" />
            Kirim Pesan
            <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </>
        )}
      </button>
    </form>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label className="text-xs uppercase tracking-widest text-white/50">
        {label}
        {required && <span className="ml-1 text-prime-gold">*</span>}
      </label>
      {children}
    </div>
  );
}

function Err({ children }: { children: React.ReactNode }) {
  return <p className="text-xs text-prime-red">{children}</p>;
}
