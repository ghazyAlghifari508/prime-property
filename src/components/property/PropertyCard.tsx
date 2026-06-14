import { Building2, MapPin, Ruler, Compass } from "lucide-react";
import { SiapBadge, StatusBadge } from "@/components/common/StatusBadge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDimensi, formatRupiah } from "@/lib/format";
import type { Property } from "@/lib/types";

// Kartu properti read-only untuk landing "Properti Unggulan" (AC-2.2).
export function PropertyCard({ property }: { property: Property }) {
  return (
    <Card className="group overflow-hidden border-border/70 py-0 transition-shadow hover:shadow-lg">
      {/* Header bergaya brand, tanpa gambar (AC-1.2: no upload gambar) */}
      <div className="relative flex h-28 items-center justify-center bg-prime-black">
        <Building2 className="size-10 text-prime-gold/70" />
        <div className="absolute right-3 top-3">
          <StatusBadge status={property.status} />
        </div>
        <div className="absolute left-3 top-3">
          <span className="rounded bg-prime-gold/90 px-2 py-0.5 text-xs font-semibold text-prime-black">
            {property.tipe}
          </span>
        </div>
      </div>

      <CardContent className="space-y-3 p-5">
        <div className="space-y-1">
          <h3 className="line-clamp-1 font-semibold text-prime-black">
            {property.nama_property}
          </h3>
          {property.group && (
            <p className="text-xs text-muted-foreground">{property.group}</p>
          )}
        </div>

        <p className="text-lg font-bold text-prime-gold-dark">
          {formatRupiah(property.price)}
        </p>

        <ul className="space-y-1.5 text-sm text-muted-foreground">
          <li className="flex items-center gap-2">
            <Ruler className="size-4 text-prime-gold" />
            {formatDimensi(property.lebar, property.panjang)}
          </li>
          <li className="flex items-center gap-2">
            <Compass className="size-4 text-prime-gold" />
            Hadap {property.hadap.join(", ")}
          </li>
          <li className="flex items-center gap-2">
            <MapPin className="size-4 text-prime-gold" />
            <span className="line-clamp-1">{property.kawasan.join(", ")}</span>
          </li>
        </ul>

        <div className="pt-1">
          <SiapBadge siap={property.siap} />
        </div>
      </CardContent>
    </Card>
  );
}
