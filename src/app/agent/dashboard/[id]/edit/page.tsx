import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getProperty } from "@/lib/actions/properties";
import { PropertyFormClient } from "@/components/property/PropertyFormClient";

export default async function EditPropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const property = await getProperty(id);

  if (!property) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-prime-white py-20 text-center">
        <p className="text-lg font-semibold text-prime-black">
          Properti tidak ditemukan
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
    <div className="mx-auto max-w-4xl space-y-5">
      <div>
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="-ml-2 h-7 text-muted-foreground"
        >
          <Link href={`/agent/dashboard/${id}`}>
            <ArrowLeft className="mr-1 size-4" />
            Kembali ke detail
          </Link>
        </Button>
        <h1 className="mt-1 font-bold text-3xl font-semibold text-prime-black">
          Edit Properti
        </h1>
        <p className="text-sm text-muted-foreground">
          Perubahan field ditandai titik emas.
        </p>
      </div>

      <PropertyFormClient mode="edit" property={property} />
    </div>
  );
}
