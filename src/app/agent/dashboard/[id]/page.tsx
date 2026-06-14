import Link from "next/link";
import { ArrowLeft, Calendar, ExternalLink, Pencil } from "lucide-react";
import { DeletePropertyDialog } from "@/components/property/DeletePropertyDialog";
import { SiapBadge, StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatRupiah, formatTanggal, formatDimensi } from "@/lib/format";
import { getProperty } from "@/lib/actions/properties";
import { getCurrentUser } from "@/lib/auth";

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 border-b border-border/60 py-2.5 last:border-0">
      <dt className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd className="text-sm font-medium text-prime-black">{value}</dd>
    </div>
  );
}

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [{ id }, user] = await Promise.all([params, getCurrentUser()]);
  const property = await getProperty(id);
  const isSuperadmin = user?.role === "superadmin";

  if (!property) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-prime-white py-20 text-center">
        <p className="text-lg font-semibold text-prime-black">
          Properti tidak ditemukan
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Mungkin sudah dihapus atau tautan tidak valid.
        </p>
        <Button asChild className="mt-6" variant="outline">
          <Link href="/agent/dashboard">
            <ArrowLeft className="mr-1 size-4" />
            Kembali ke daftar
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Top bar */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="-ml-2 h-7 text-muted-foreground"
          >
            <Link href="/agent/dashboard">
              <ArrowLeft className="mr-1 size-4" />
              Kembali
            </Link>
          </Button>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-display text-3xl font-semibold text-prime-black">
              {property.nama_property}
            </h1>
            <StatusBadge status={property.status} />
            <SiapBadge siap={property.siap} />
          </div>
          {property.group && (
            <p className="text-sm text-muted-foreground">
              Group: {property.group}
            </p>
          )}
        </div>

        {/* Aksi superadmin (AC-7.3) */}
        {isSuperadmin && (
          <div className="flex items-center gap-2">
            <Button asChild variant="outline">
              <Link href={`/agent/dashboard/${property.id}/edit`}>
                <Pencil className="mr-1 size-4" />
                Edit
              </Link>
            </Button>
            <DeletePropertyDialog
              id={property.id}
              propertyName={property.nama_property}
            />
          </div>
        )}
      </div>

      {/* Harga sorot */}
      <Card className="border-prime-gold/40 bg-prime-gold/5">
        <CardContent className="flex flex-wrap items-center justify-between gap-3 py-5">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Harga
            </p>
            <p className="text-3xl font-bold text-prime-gold-dark">
              {formatRupiah(property.price)}
            </p>
          </div>
          {property.maps_link && (
            <Button asChild variant="outline">
              <a
                href={property.maps_link}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="mr-1 size-4" />
                Buka di Google Maps
              </a>
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Detail 2 kolom (AC-7.3) */}
      <div className="grid gap-5 md:grid-cols-2">
        <Card>
          <CardContent className="py-2">
            <dl>
              <Row label="Tipe" value={property.tipe} />
              <Row
                label="Dimensi (L × P)"
                value={formatDimensi(property.lebar, property.panjang)}
              />
              <Row
                label="Tingkat"
                value={`${property.tingkat.toLocaleString("id-ID")} lantai`}
              />
              <Row label="Hadap" value={property.hadap.join(", ")} />
              <Row
                label="Carport"
                value={property.carport ? "Ya" : "Tidak"}
              />
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="py-2">
            <dl>
              <Row
                label="Kawasan"
                value={
                  <div className="flex flex-wrap gap-1">
                    {property.kawasan.map((k) => (
                      <span
                        key={k}
                        className="rounded bg-soft-gray px-2 py-0.5 text-xs"
                      >
                        {k}
                      </span>
                    ))}
                  </div>
                }
              />
              <Row label="Unit" value={property.unit ?? "—"} />
              <Row
                label="Dibuat"
                value={
                  <span className="flex items-center gap-1.5">
                    <Calendar className="size-3.5 text-muted-foreground" />
                    {formatTanggal(property.created_at)}
                  </span>
                }
              />
              <Row
                label="Diperbarui"
                value={
                  <span className="flex items-center gap-1.5">
                    <Calendar className="size-3.5 text-muted-foreground" />
                    {formatTanggal(property.updated_at)}
                  </span>
                }
              />
              <Row label="ID Properti" value={property.id} />
            </dl>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
