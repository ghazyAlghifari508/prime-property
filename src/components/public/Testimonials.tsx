import { Quote, Star } from "lucide-react";

const TESTIMONIALS = [
  {
    quote:
      "Proses pembelian villa kami berjalan mulus dan transparan. Tim Prime Property sangat profesional dan responsif di setiap tahap.",
    name: "Hendra Kusuma",
    role: "Pemilik Villa, Cemara Asri",
    initials: "HK",
  },
  {
    quote:
      "Sebagai investor, saya butuh data yang akurat. Prime Property memberikan informasi properti yang lengkap dan jujur — sangat membantu keputusan saya.",
    name: "Linda Wijaya",
    role: "Investor Properti",
    initials: "LW",
  },
  {
    quote:
      "Ruko yang saya beli persis seperti yang dijanjikan. Lokasinya strategis dan harganya kompetitif. Sangat direkomendasikan!",
    name: "Surya Tanaka",
    role: "Pengusaha, Pancing",
    initials: "ST",
  },
];

export function Testimonials() {
  return (
    <section className="relative overflow-hidden bg-[#111] py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow text-prime-gold">Testimoni</p>
            <h2 className="mt-4 font-display text-4xl font-medium text-white sm:text-5xl">
              Dipercaya Klien Kami
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-white/60">
            Kepuasan klien adalah bukti komitmen kami menghadirkan layanan
            properti terbaik.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure
              key={t.name}
              className="flex flex-col border border-white/10 bg-prime-black p-8 transition-colors duration-300 hover:border-prime-gold/40"
            >
              <Quote className="size-8 text-prime-gold/50" />

              <div className="mt-4 flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="size-4 fill-prime-gold text-prime-gold"
                  />
                ))}
              </div>

              <blockquote className="mt-5 flex-1 text-sm leading-relaxed text-white/75">
                &ldquo;{t.quote}&rdquo;
              </blockquote>

              <figcaption className="mt-7 flex items-center gap-3 border-t border-white/10 pt-5">
                <span className="flex size-11 items-center justify-center rounded-full border border-prime-gold/40 font-display text-sm font-semibold text-prime-gold">
                  {t.initials}
                </span>
                <div>
                  <p className="text-sm font-medium text-white">{t.name}</p>
                  <p className="text-xs text-white/50">{t.role}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
