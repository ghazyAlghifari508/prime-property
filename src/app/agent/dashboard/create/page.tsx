"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { PropertyForm } from "@/components/property/PropertyForm";
import { Button } from "@/components/ui/button";
import { createProperty } from "@/lib/actions/properties";

export default function CreatePropertyPage() {
  const router = useRouter();

  // Gating server sudah ditangani di actions (requireSuperadmin throw 403).
  // Jika admin iseng ke URL ini, submit akan gagal dengan toast error 403.
  // Untuk UI yang lebih rapi, gating client ditaruh di layout/menu agar
  // tombol tidak muncul sejak awal.

  async function handleCreate(input: Record<string, unknown>) {
    const res = await createProperty(input);
    if (res.ok) {
      toast.success("Properti berhasil ditambahkan.");
      router.push(`/agent/dashboard?highlight=${res.id}`);
    } else {
      toast.error(res.error);
    }
  }

  async function handleCreateAddAnother(
    input: Record<string, unknown>,
    resetForm: () => void,
  ) {
    const res = await createProperty(input);
    if (res.ok) {
      toast.success("Properti tersimpan. Silakan tambah berikutnya.");
      resetForm();
    } else {
      toast.error(res.error);
    }
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
          <Link href="/agent/dashboard">
            <ArrowLeft className="mr-1 size-4" />
            Kembali
          </Link>
        </Button>
        <h1 className="mt-1 font-bold text-3xl font-semibold text-prime-black">
          Tambah Properti
        </h1>
        <p className="text-sm text-muted-foreground">
          Lengkapi data properti baru di bawah ini.
        </p>
      </div>

      <PropertyForm
        mode="create"
        onSubmit={handleCreate}
        onSubmitAddAnother={handleCreateAddAnother}
      />
    </div>
  );
}
