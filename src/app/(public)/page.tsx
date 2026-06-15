import Image from "next/image";
import {
  ArrowUpRight,
  ShieldCheck,
  Sparkles,
  HandCoins,
  MapPinned,
} from "lucide-react";
import { LuxLink } from "@/components/public/LuxButton";
import { FeaturedCard } from "@/components/public/FeaturedCard";
import { PropertyTypes } from "@/components/public/PropertyTypes";
import { ProcessSteps } from "@/components/public/ProcessSteps";
import { getFeaturedProperties, getPropertyStats } from "@/lib/actions/properties";

// Halaman ini bergantung pada data DB → SSR, bukan SSG.
export const dynamic = "force-dynamic";

const HERO_IMG =
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80";

const VALUE_PROPS = [
  {
    icon: ShieldCheck,
    no: "01",
    title: "Terpercaya & Transparan",
    desc: "Setiap listing terverifikasi dengan data lengkap dan akurat — tanpa biaya tersembunyi.",
  },
  {
    icon: Sparkles,
    no: "02",
    title: "Properti Pilihan",
    desc: "Kurasi ruko dan villa terbaik di kawasan strategis dengan potensi nilai tinggi.",
  },
  {
    icon: HandCoins,
    no: "03",
    title: "Harga Kompetitif",
    desc: "Penawaran terbaik dengan opsi pembiayaan fleksibel sesuai kebutuhan Anda.",
  },
  {
    icon: MapPinned,
    no: "04",
    title: "Lokasi Strategis",
    desc: "Akses mudah ke pusat kota, sekolah, dan fasilitas umum di kawasan berkembang.",
  },
];

export default async function LandingPage() {
  const featuredProperties = await getFeaturedProperties(6);
  const stats = await getPropertyStats();

  const STATS = [
    { value: `${stats.total}+`, label: "Properti Terkurasi" },
    { value: `${stats.kawasan}`, label: "Kawasan Strategis" },
    { value: "98%", label: "Kepuasan Klien" },
    { value: "10+", label: "Tahun Pengalaman" },
  ];

  return (
    <>
      {/* ===== HERO ===== */}
      <section className="relative flex min-h-[100svh] items-center overflow-hidden bg-prime-black">
        {/* Foto latar */}
        <div className="absolute inset-0">
          <Image
            src={HERO_IMG}
            alt="Properti mewah Prime Property"
            fill
            priority
            sizes="100vw"
            className="animate-zoom-slow object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/75 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />
        </div>

        <div className="relative mx-auto w-full max-w-7xl px-4 pt-28 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="eyebrow animate-fade-up text-prime-gold">
              Properti Pilihan · Sumatera Utara
            </p>

            <h1 className="animate-fade-up delay-100 mt-6 font-display text-5xl font-medium leading-[1.05] text-white sm:text-6xl lg:text-7xl">
              Temukan Properti Impian,
              <br />
              <span className="text-gold-gradient">Investasi</span> Terbaik Anda
            </h1>

            <p className="animate-fade-up delay-200 mt-8 max-w-xl text-lg leading-relaxed text-white/70">
              Prime Property menghadirkan koleksi ruko dan villa terkurasi di
              kawasan paling strategis. Profesional, transparan, dan terpercaya.
            </p>

            <div className="animate-fade-up delay-300 mt-10 flex flex-col gap-4 sm:flex-row">
              <LuxLink href="#unggulan" variant="gold" size="lg">
                Lihat Properti
                <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </LuxLink>
              <LuxLink href="/contact" variant="outline-light" size="lg">
                Hubungi Kami
              </LuxLink>
            </div>
          </div>
        </div>

        {/* Indikator scroll */}
        <div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 animate-fade delay-500 flex-col items-center gap-2 text-white/40 lg:flex">
          <span className="h-10 w-px bg-gradient-to-b from-prime-gold to-transparent" />
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="border-y border-white/10 bg-prime-black">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px px-4 sm:px-6 lg:grid-cols-4 lg:px-8">
          {STATS.map((s) => (
            <div key={s.label} className="px-2 py-10 text-center lg:py-12">
              <p className="font-display text-4xl font-semibold text-prime-gold lg:text-5xl">
                {s.value}
              </p>
              <p className="mt-2 text-xs uppercase tracking-widest text-white/50">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== TIPE PROPERTI ===== */}
      <PropertyTypes />

      {/* ===== PROPERTI UNGGULAN ===== */}
      <section id="unggulan" className="bg-prime-black py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-14 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <p className="eyebrow text-prime-gold">Koleksi Eksklusif</p>
              <h2 className="mt-4 font-display text-4xl font-medium text-white sm:text-5xl">
                Properti Unggulan
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-white/60">
              Pilihan terbaik kami — hunian dan ruang komersial premium dengan
              lokasi yang diincar.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProperties.map((property) => (
              <FeaturedCard key={property.id} property={property} />
            ))}
          </div>

          <div className="mt-14 flex justify-center">
            <LuxLink href="/contact" variant="outline-light" size="lg">
              Konsultasikan Kebutuhan Anda
              <ArrowUpRight className="size-4" />
            </LuxLink>
          </div>
        </div>
      </section>

      {/* ===== MENGAPA PRIME PROPERTY ===== */}
      <section className="relative overflow-hidden bg-[#111] py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            {/* Kiri: judul */}
            <div className="lg:sticky lg:top-28">
              <p className="eyebrow text-prime-gold">Mengapa Kami</p>
              <h2 className="mt-4 font-display text-4xl font-medium leading-tight text-white sm:text-5xl">
                Standar tertinggi untuk{" "}
                <span className="text-gold-gradient">setiap properti</span>
              </h2>
              <p className="mt-6 max-w-md text-sm leading-relaxed text-white/60">
                Komitmen kami adalah menghadirkan pengalaman properti yang mulus,
                jujur, dan berkelas dari awal hingga serah terima.
              </p>
              <div className="gold-rule mt-10 w-40" />
            </div>

            {/* Kanan: daftar value */}
            <div className="divide-y divide-white/10">
              {VALUE_PROPS.map((vp) => (
                <div
                  key={vp.title}
                  className="group flex gap-6 py-8 transition-colors first:pt-0"
                >
                  <span className="font-display text-2xl font-medium text-white/25 transition-colors group-hover:text-prime-gold">
                    {vp.no}
                  </span>
                  <div className="flex-1">
                    <div className="mb-3 flex items-center gap-3">
                      <vp.icon className="size-6 text-prime-gold" />
                      <h3 className="font-display text-2xl font-medium text-white">
                        {vp.title}
                      </h3>
                    </div>
                    <p className="max-w-lg text-sm leading-relaxed text-white/60">
                      {vp.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== PROSES ===== */}
      <ProcessSteps />

      {/* ===== CTA PENUTUP ===== */}
      <section className="relative overflow-hidden bg-prime-black py-28">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 size-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-prime-gold/10 blur-[120px]"
        />
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <p className="eyebrow text-prime-gold">Langkah Selanjutnya</p>
          <h2 className="mt-5 font-display text-4xl font-medium leading-tight text-white sm:text-5xl">
            Siap menemukan properti Anda?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-white/60">
            Tim kami siap mendampingi Anda menemukan properti yang tepat.
            Mulai percakapan hari ini.
          </p>
          <div className="mt-10 flex justify-center">
            <LuxLink href="/contact" variant="gold" size="lg">
              Hubungi Kami
              <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </LuxLink>
          </div>
        </div>
      </section>
    </>
  );
}
