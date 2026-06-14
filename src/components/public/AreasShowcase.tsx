import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";

const AREAS = [
  {
    name: "Cemara Asri",
    count: "24 properti",
    img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=75",
    span: "lg:col-span-2 lg:row-span-2",
  },
  {
    name: "Krakatau",
    count: "18 properti",
    img: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=600&q=75",
    span: "",
  },
  {
    name: "Pancing",
    count: "15 properti",
    img: "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&w=600&q=75",
    span: "",
  },
  {
    name: "Helvetia",
    count: "21 properti",
    img: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=600&q=75",
    span: "",
  },
  {
    name: "Ringroad",
    count: "12 properti",
    img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=75",
    span: "",
  },
];

export function AreasShowcase() {
  return (
    <section className="relative overflow-hidden bg-[#111] py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow text-prime-gold">Lokasi</p>
            <h2 className="mt-4 font-display text-4xl font-medium text-white sm:text-5xl">
              Kawasan Strategis
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-white/60">
            Properti tersebar di lokasi paling diincar — dekat dengan pusat kota,
            sekolah, dan fasilitas premium.
          </p>
        </div>

        <div className="grid auto-rows-[180px] grid-cols-2 gap-4 lg:grid-cols-4">
          {AREAS.map((a) => (
            <Link
              key={a.name}
              href="/contact"
              className={`group relative overflow-hidden rounded-sm ${a.span}`}
            >
              <Image
                src={a.img}
                alt={`Kawasan ${a.name}`}
                fill
                sizes="(max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent transition-opacity duration-500 group-hover:from-black" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <h3 className="font-display text-xl font-semibold text-white lg:text-2xl">
                  {a.name}
                </h3>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-prime-gold">
                  <MapPin className="size-3.5" />
                  {a.count}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
