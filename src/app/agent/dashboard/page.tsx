import Link from "next/link";
import {
  Building2,
  CheckCircle2,
  MapPin,
  Plus,
  XCircle,
} from "lucide-react";
import { StatCard } from "@/components/common/StatCard";
import { Button } from "@/components/ui/button";
import { getPropertyStats, listAllProperties } from "@/lib/actions/properties";
import { parseFilters } from "@/lib/property-filter";
import { getCurrentUser } from "@/lib/auth";
import { DashboardListingClient } from "@/components/property/DashboardListingClient";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [sp, user, stats] = await Promise.all([
    searchParams,
    getCurrentUser(),
    getPropertyStats(),
  ]);

  const urlParams = new URLSearchParams();
  for (const [k, v] of Object.entries(sp)) {
    if (Array.isArray(v)) v.forEach((x) => urlParams.append(k, x));
    else if (v) urlParams.append(k, v);
  }

  const initialFilters = parseFilters(urlParams);
  // Ambil SEMUA properti sekali — filter real-time di client (AC-7.2)
  const allItems = await listAllProperties();

  const highlightId = typeof sp.highlight === "string" ? sp.highlight : undefined;
  const isSuperadmin = user?.role === "superadmin";

  return (
    <div className="space-y-5">
      {/* Heading */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-bold text-3xl font-semibold text-prime-black">
            Daftar Properti
          </h1>
          <p className="text-sm text-muted-foreground">
            {stats.total} properti terdaftar
          </p>
        </div>
        {isSuperadmin && (
          <Button
            asChild
            className="bg-prime-gold text-prime-black hover:bg-prime-gold-dark"
          >
            <Link href="/agent/dashboard/create">
              <Plus className="mr-1 size-4" />
              Tambah Properti
            </Link>
          </Button>
        )}
      </div>

      {/* Ringkasan statistik */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Total Properti"
          value={stats.total}
          icon={Building2}
          accent="gold"
        />
        <StatCard
          label="Tersedia"
          value={stats.inStock}
          icon={CheckCircle2}
          accent="green"
        />
        <StatCard
          label="Terjual"
          value={stats.soldOut}
          icon={XCircle}
          accent="red"
        />
        <StatCard
          label="Kawasan"
          value={stats.kawasan}
          icon={MapPin}
          accent="neutral"
        />
      </div>

      <DashboardListingClient
        initialFilters={initialFilters}
        allItems={allItems}
        highlightId={highlightId}
      />
    </div>
  );
}
