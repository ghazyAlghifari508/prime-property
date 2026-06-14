import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const TYPES = [
  {
    name: "Ruko",
    tag: "Komersial",
    desc: "Ruang usaha strategis dengan akses tinggi — ideal untuk bisnis dan investasi jangka panjang.",
    img: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=1000&q=80",
  },
  {
    name: "Villa",
    tag: "Hunian",
    desc: "Hunian eksklusif dengan privasi dan kenyamanan — dirancang untuk gaya hidup berkelas.",
    img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=80",
  },
];

export function PropertyTypes() {
  return (
    <section className="bg-prime-black py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 text-center">
          <p className="eyebrow text-prime-gold">Kategori</p>
          <h2 className="mt-4 font-display text-4xl font-medium text-white sm:text-5xl">
            Pilih Tipe Properti Anda
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {TYPES.map((t) => (
            <Link
              key={t.name}
              href="/contact"
              className="group relative block aspect-[16/11] overflow-hidden rounded-sm"
            >
              <Image
                src={t.img}
                alt={t.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent transition-opacity duration-500 group-hover:from-black/95" />

              <div className="absolute inset-0 flex flex-col justify-end p-8 lg:p-10">
                <span className="eyebrow mb-3 text-prime-gold">{t.tag}</span>
                <h3 className="font-display text-4xl font-semibold text-white lg:text-5xl">
                  {t.name}
                </h3>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-white/70">
                  {t.desc}
                </p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium tracking-wide text-prime-gold">
                  Jelajahi
                  <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
