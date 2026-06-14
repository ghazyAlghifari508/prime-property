"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  toggleAdminActive,
  resetAdminPassword,
} from "@/lib/actions/admins";
import type { User } from "@/lib/types";

export function AdminActions({ admin }: { admin: User }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleToggle() {
    setLoading(true);
    const res = await toggleAdminActive(admin.id);
    setLoading(false);
    if (res.ok) {
      toast.success(
        `Akun ${admin.nama} ${admin.is_active ? "dinonaktifkan" : "diaktifkan"}.`,
      );
      router.refresh();
    } else {
      toast.error(res.error ?? "Gagal mengubah status.");
    }
  }

  async function handleReset() {
    setLoading(true);
    const res = await resetAdminPassword(admin.id);
    setLoading(false);
    if (res.ok) {
      toast.success(
        `Password ${admin.nama} telah direset.${res.tempPassword ? ` Password sementara: ${res.tempPassword}` : ""}`,
      );
    } else {
      toast.error(res.error ?? "Gagal reset password.");
    }
  }

  return (
    <div className="flex items-center justify-end gap-3">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleReset}
        disabled={loading}
        className="h-8 text-muted-foreground hover:text-prime-black"
      >
        <KeyRound className="mr-1 size-3.5" />
        Reset Password
      </Button>
      <div className="flex items-center gap-2">
        <Switch
          checked={admin.is_active}
          onCheckedChange={handleToggle}
          disabled={loading}
          aria-label="Aktif/nonaktif"
        />
        <span className="w-14 text-xs text-muted-foreground">
          {admin.is_active ? "Aktif" : "Nonaktif"}
        </span>
      </div>
    </div>
  );
}
