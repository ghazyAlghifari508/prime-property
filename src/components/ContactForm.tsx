"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { submitContact } from "@/lib/actions/contact";

interface FieldErrors {
  nama?: string;
  email?: string;
  hp?: string;
  pesan?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ContactForm() {
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

    // Submit ke backend
    setSubmitting(true);
    const result = await submitContact(data);
    setSubmitting(false);

    if (result.ok) {
      toast.success("Pesan terkirim, tim kami akan menghubungi Anda.");
      (document.getElementById("contact-form") as HTMLFormElement | null)?.reset();
      setErrors({});
    } else {
      toast.error(result.error ?? "Gagal mengirim pesan. Coba lagi nanti.");
    }
  }

  return (
    <form
      id="contact-form"
      action={handleSubmit}
      noValidate
      className="space-y-5"
    >
      <div className="space-y-2">
        <Label htmlFor="nama">
          Nama <span className="text-prime-red">*</span>
        </Label>
        <Input
          id="nama"
          name="nama"
          placeholder="Nama lengkap Anda"
          aria-invalid={!!errors.nama}
        />
        {errors.nama && (
          <p className="text-sm text-prime-red">{errors.nama}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">
          Email <span className="text-prime-red">*</span>
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="nama@email.com"
          aria-invalid={!!errors.email}
        />
        {errors.email && (
          <p className="text-sm text-prime-red">{errors.email}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="hp">
          Nomor HP <span className="text-prime-red">*</span>
        </Label>
        <Input
          id="hp"
          name="hp"
          type="tel"
          inputMode="numeric"
          placeholder="08xxxxxxxxxx"
          aria-invalid={!!errors.hp}
        />
        {errors.hp && <p className="text-sm text-prime-red">{errors.hp}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="pesan">
          Pesan <span className="text-prime-red">*</span>
        </Label>
        <textarea
          id="pesan"
          name="pesan"
          rows={4}
          placeholder="Tulis pesan atau pertanyaan Anda…"
          aria-invalid={!!errors.pesan}
          className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-prime-red"
        />
        {errors.pesan && (
          <p className="text-sm text-prime-red">{errors.pesan}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={submitting}
        className="w-full bg-prime-gold text-prime-black hover:bg-prime-gold-dark"
      >
        {submitting ? (
          "Mengirim…"
        ) : (
          <>
            <Send className="mr-1 size-4" />
            Kirim Pesan
          </>
        )}
      </Button>
    </form>
  );
}
