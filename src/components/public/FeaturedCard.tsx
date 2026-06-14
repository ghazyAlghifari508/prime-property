import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPin, Maximize } from "lucide-react";
import { formatRupiah, formatDimensi } from "@/lib/format";
import type { Property } from "@/lib/types";

// Kartu properti unggulan — luxury dark editorial, dengan foto.
export function FeaturedCard({ property }: { property: Property }) {
  return (
    <Link
      href="/contact"
      className="group relative block overflow-hidden rounded-sm bg-prime-black"
    >
      {/* Foto */}
      <div className="relative aspect-[4/5] w-full overflow-hidden">
        {property.image_url ? (
          <Image
            src={property.image_url}
            alt={property.nama_property}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 bg-neutral-800" />
        )}
        {/* gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

        {/* tipe badge */}
        <span className="absolute left-4 top-4 border border-prime-gold/60 bg-black/40 px-3 py-1 text-xs font-medium uppercase tracking-widest text-prime-gold backdrop-blur-sm">
          {property.tipe}
        </span>

        {/* status sold out */}
        {property.status === "sold_out" && (
          <span className="absolute right-4 top-4 bg-prime-red px-3 py-1 text-xs font-medium uppercase tracking-widest text-white">
            Terjual
          </span>
        )}
      </div>

      {/* Konten di atas foto */}
      <div className="absolute inset-x-0 bottom-0 p-6">
        <div className="mb-2 flex items-center gap-1.5 text-xs text-white/70">
          <MapPin className="size-3.5 text-prime-gold" />
          <span className="line-clamp-1">{property.kawasan.join(" · ")}</span>
        </div>

        <h3 className="font-display text-2xl font-semibold leading-tight text-white">
          {property.nama_property}
        </h3>

        <div className="mt-3 flex items-center justify-between border-t border-white/15 pt-3">
          <p className="text-lg font-semibold text-prime-gold">
            {formatRupiah(property.price)}
          </p>
          <span className="flex items-center gap-1 text-xs text-white/60">
            <Maximize className="size-3.5" />
            {formatDimensi(property.lebar, property.panjang)}
          </span>
        </div>
      </div>

      {/* indikator hover */}
      <span className="absolute right-5 top-1/2 flex size-11 -translate-y-1/2 translate-x-16 items-center justify-center rounded-full bg-prime-gold text-prime-black opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100">
        <ArrowUpRight className="size-5" />
      </span>
    </Link>
  );
}
