"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createAdmin } from "@/lib/actions/admins";

export function AdminAddDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    const nama = String(formData.get("nama") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("pwd") ?? "").trim();

    if (!nama || !email) {
      toast.error("Nama dan email wajib diisi.");
      return;
    }
    if (password.length < 6) {
      toast.error("Password minimal 6 karakter.");
      return;
    }

    setLoading(true);
    const res = await createAdmin(nama, email, password);
    setLoading(false);

    if (res.ok) {
      toast.success(`Akun admin "${nama}" berhasil dibuat.`);
      setOpen(false);
      router.refresh();
    } else {
      toast.error(res.error ?? "Gagal membuat akun.");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-prime-gold text-prime-black hover:bg-prime-gold-dark">
          <Plus className="mr-1 size-4" />
          Tambah Admin
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="size-5 text-prime-gold-dark" />
            Tambah Akun Admin
          </DialogTitle>
          <DialogDescription>
            Akun baru langsung aktif. Tidak ada registrasi mandiri.
          </DialogDescription>
        </DialogHeader>
        <form action={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nama">Nama</Label>
            <Input id="nama" name="nama" placeholder="Nama lengkap" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="nama@primeproperty.id"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pwd">Password Awal</Label>
            <Input
              id="pwd"
              name="pwd"
              type="text"
              defaultValue="admin123"
              placeholder="Password awal"
            />
            <p className="text-xs text-muted-foreground">
              Admin akan diminta mengganti password saat login pertama.
            </p>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-prime-gold text-prime-black hover:bg-prime-gold-dark"
            >
              {loading ? "Menyimpan…" : "Buat Akun"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
