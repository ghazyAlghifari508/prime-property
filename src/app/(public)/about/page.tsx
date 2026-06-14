import type { Metadata } from "next";
import Image from "next/image";
import { Target, Eye, Award, Users, TrendingUp, Heart } from "lucide-react";

export const metadata: Metadata = {
  title: "Tentang Kami",
  description:
    "Mengenal Prime Property — visi, misi, dan nilai perusahaan dalam menghadirkan properti pilihan dan layanan terpercaya.",
};

const NILAI = [
  {
    icon: Award,
    title: "Integritas",
    desc: "Kejujuran dan transparansi dalam setiap transaksi dan informasi.",
  },
  {
    icon: Users,
    title: "Berorientasi Klien",
    desc: "Kebutuhan dan kepuasan klien adalah prioritas utama kami.",
  },
  {
    icon: TrendingUp,
    title: "Profesional",
    desc: "Layanan berstandar tinggi dengan tim yang berpengalaman.",
  },
  {
    icon: Heart,
    title: "Berkomitmen",
    desc: "Mendampingi Anda dari pencarian hingga serah terima properti.",
  },
];

const ABOUT_IMG =
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=80";

export default function AboutPage() {
  return (
    <>
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden bg-prime-black pb-24 pt-36 lg:pb-32 lg:pt-44">
        <div
          aria-hidden
          className="pointer-events-none absolute right-0 top-0 h-[60%] w-1/3 bg-gradient-to-l from-prime-gold/10 to-transparent blur-2xl"
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="eyebrow text-prime-gold">Tentang Kami</p>
          <h1 className="mt-5 max-w-4xl font-display text-4xl font-medium leading-[1.1] text-white sm:text-5xl lg:text-6xl">
            Mitra Terpercaya untuk Properti{" "}
            <span className="text-gold-gradient">Impian</span> Anda
          </h1>
          <div className="gold-rule mt-8 w-32" />
        </div>
      </section>

      {/* ===== PROFIL (2 kolom AC-3.1) ===== */}
      <section className="bg-prime-black py-20 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-8">
          <div className="space-y-6">
            <p className="eyebrow text-prime-gold">Profil Perusahaan</p>
            <h2 className="font-display text-3xl font-medium text-white sm:text-4xl">
              Lebih dari sekadar properti
            </h2>
            <p className="text-sm leading-relaxed text-white/65">
              Prime Property adalah perusahaan properti yang berfokus pada
              penyediaan ruko dan villa berkualitas di kawasan strategis Sumatera
              Utara. Berawal dari pengelolaan data properti yang manual, kami
              bertransformasi menjadi platform digital yang efisien, akurat, dan
              transparan.
            </p>
            <p className="text-sm leading-relaxed text-white/65">
              Dengan tim agen profesional dan jaringan luas, kami membantu calon
              pembeli menemukan properti yang sesuai dengan kebutuhan dan
              anggaran — mulai dari hunian keluarga hingga peluang investasi
              yang menguntungkan.
            </p>
            <div className="gold-rule w-40" />
          </div>

          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src={ABOUT_IMG}
              alt="Interior mewah — standar Prime Property"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            {/* kutipan overlay */}
            <blockquote className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/70 to-transparent p-8 lg:p-10">
              <p className="font-display text-xl font-medium italic leading-relaxed text-white">
                &ldquo;Kami percaya setiap orang berhak mendapatkan properti
                terbaik dengan proses yang jujur dan tanpa kerumitan.&rdquo;
              </p>
              <footer className="mt-3 text-xs uppercase tracking-widest text-prime-gold">
                Tim Prime Property
              </footer>
            </blockquote>
          </div>
        </div>
      </section>

      {/* ===== VISI & MISI ===== */}
      <section className="relative overflow-hidden bg-[#111] py-20 lg:py-28">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 md:grid-cols-2 lg:px-8">
          <div className="border border-white/10 p-8 lg:p-10">
            <div className="mb-5 flex size-14 items-center justify-center border border-prime-gold/30">
              <Eye className="size-7 text-prime-gold" />
            </div>
            <h3 className="font-display text-2xl font-medium text-white">
              Visi
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-white/60">
              Menjadi platform properti terdepan dan paling terpercaya di
              Sumatera Utara, yang menghubungkan setiap orang dengan properti
              impian mereka secara mudah dan transparan.
            </p>
          </div>

          <div className="border border-white/10 p-8 lg:p-10">
            <div className="mb-5 flex size-14 items-center justify-center border border-prime-gold/30">
              <Target className="size-7 text-prime-gold" />
            </div>
            <h3 className="font-display text-2xl font-medium text-white">
              Misi
            </h3>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-white/60">
              {[
                "Menyediakan listing properti yang akurat dan terverifikasi.",
                "Memberikan layanan profesional yang berorientasi pada kepuasan klien.",
                "Menjaga integritas dan transparansi di setiap transaksi.",
                "Mengembangkan teknologi untuk pengalaman properti yang lebih baik.",
              ].map((m, i) => (
                <li key={i} className="flex gap-3">
                  <span className="mt-0.5 text-prime-gold">—</span>
                  <span>{m}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ===== NILAI PERUSAHAAN ===== */}
      <section className="bg-prime-black py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-14 text-center">
            <p className="eyebrow text-prime-gold">Prinsip Kami</p>
            <h2 className="mt-4 font-display text-3xl font-medium text-white sm:text-4xl">
              Nilai Perusahaan
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-px bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {NILAI.map((n) => (
              <div
                key={n.title}
                className="group bg-prime-black p-8 text-center transition-colors hover:bg-[#151515]"
              >
                <div className="mx-auto mb-5 flex size-16 items-center justify-center border border-prime-gold/30 transition-colors group-hover:border-prime-gold group-hover:bg-prime-gold/10">
                  <n.icon className="size-7 text-prime-gold" />
                </div>
                <h3 className="font-display text-lg font-medium text-white">
                  {n.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/55">
                  {n.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
