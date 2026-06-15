import { Search, CalendarCheck, FileSignature, KeyRound } from "lucide-react";

const STEPS = [
  {
    no: "01",
    icon: Search,
    title: "Temukan",
    desc: "Jelajahi koleksi properti terkurasi atau sampaikan kriteria impian Anda kepada tim kami.",
  },
  {
    no: "02",
    icon: CalendarCheck,
    title: "Konsultasi",
    desc: "Diskusikan kebutuhan dan jadwalkan kunjungan properti bersama agen profesional kami.",
  },
  {
    no: "03",
    icon: FileSignature,
    title: "Kesepakatan",
    desc: "Proses transaksi yang transparan dengan pendampingan penuh hingga dokumen selesai.",
  },
  {
    no: "04",
    icon: KeyRound,
    title: "Serah Terima",
    desc: "Properti impian resmi menjadi milik Anda — siap huni atau siap dikembangkan.",
  },
];

export function ProcessSteps() {
  return (
    <section className="bg-prime-black py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <p className="eyebrow text-prime-gold">Cara Kerja</p>
          <h2 className="mt-4 font-bold text-4xl font-medium text-white sm:text-5xl">
            Proses yang Mudah
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-white/60">
            Empat langkah sederhana menuju properti impian Anda — kami dampingi
            di setiap tahap.
          </p>
        </div>

        <div className="relative grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* garis penghubung di desktop */}
          <div
            aria-hidden
            className="absolute left-0 right-0 top-8 hidden h-px bg-gradient-to-r from-transparent via-prime-gold/30 to-transparent lg:block"
          />

          {STEPS.map((s) => (
            <div key={s.no} className="relative text-center">
              <div className="mx-auto flex size-16 items-center justify-center rounded-full border border-prime-gold/30 bg-prime-black">
                <s.icon className="size-7 text-prime-gold" />
              </div>
              <span className="mt-5 block font-bold text-sm font-medium tracking-widest text-prime-gold/60">
                {s.no}
              </span>
              <h3 className="mt-2 font-bold text-2xl font-medium text-white">
                {s.title}
              </h3>
              <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-white/60">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
