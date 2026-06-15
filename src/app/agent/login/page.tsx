"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Lock,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginAction } from "@/lib/actions/auth";

const LOGIN_IMG =
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1400&q=80";

export default function AgentLoginPage() {
  const router = useRouter();
  const [showPwd, setShowPwd] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(formData: FormData) {
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    if (!email || !password) {
      toast.error("Email dan password wajib diisi.");
      return;
    }

    setSubmitting(true);
    const res = await loginAction(email, password);
    setSubmitting(false);

    if (!res.ok) {
      toast.error(res.error);
    } else {
      toast.success("Login berhasil.");
      router.push("/agent/dashboard");
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* ===== Panel kiri: branding (desktop) ===== */}
      <aside className="relative hidden overflow-hidden bg-prime-black lg:block">
        <Image
          src={LOGIN_IMG}
          alt="Properti mewah Prime Property"
          fill
          priority
          sizes="50vw"
          className="object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/40" />

        <div className="relative flex h-full flex-col justify-between p-12">
          <Image
            src="/logo-prime-property.png"
            alt="Prime Property"
            width={180}
            height={50}
            priority
            className="h-12 w-auto object-contain invert brightness-0"
          />

          <div className="max-w-md">
            <p className="eyebrow text-prime-gold">Portal Internal</p>
            <h1 className="mt-4 font-bold text-4xl font-medium leading-tight text-white xl:text-5xl">
              Kelola properti dengan{" "}
              <span className="text-gold-gradient">mudah & terpercaya</span>
            </h1>
            <p className="mt-5 text-sm leading-relaxed text-white/60">
              Satu platform untuk mengelola seluruh listing, data, dan tim agen
              Prime Property — efisien, akurat, dan aman.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-white/40">
            <ShieldCheck className="size-4 text-prime-gold" />
            Koneksi aman · Akses terbatas untuk agen internal
          </div>
        </div>
      </aside>

      {/* ===== Panel kanan: form ===== */}
      <main className="flex items-center justify-center bg-prime-white px-4 py-12 sm:px-8">
        <div className="w-full max-w-sm">
          {/* Logo untuk mobile */}
          <div className="mb-8 flex justify-center lg:hidden">
            <span className="rounded-sm bg-prime-black px-4 py-2.5">
              <Image
                src="/logo-prime-property.png"
                alt="Prime Property"
                width={140}
                height={38}
                priority
                className="h-8 w-auto object-contain"
              />
            </span>
          </div>

          <div className="mb-8">
            <h2 className="font-bold text-3xl font-semibold text-prime-black">
              Selamat Datang
            </h2>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Masuk untuk melanjutkan ke portal agent.
            </p>
          </div>

          <form action={handleSubmit} className="space-y-4" noValidate>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="nama@primeproperty.id"
                autoComplete="username"
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPwd ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="h-11 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-prime-black"
                  aria-label={showPwd ? "Sembunyikan password" : "Tampilkan password"}
                >
                  {showPwd ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="h-11 w-full bg-prime-black text-prime-white hover:bg-prime-black/90"
            >
              <Lock className="mr-1 size-4" />
              {submitting ? "Memproses…" : "Masuk"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-prime-gold-dark"
            >
              <ArrowLeft className="size-4" />
              Kembali ke beranda
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
