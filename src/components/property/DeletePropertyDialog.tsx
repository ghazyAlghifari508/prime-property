"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
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
import { deleteProperty } from "@/lib/actions/properties";

interface Props {
  id: string;
  propertyName: string;
  trigger?: React.ReactNode;
}

export function DeletePropertyDialog({ id, propertyName, trigger }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleConfirm() {
    setLoading(true);
    const res = await deleteProperty(id);
    setLoading(false);

    if (res.ok) {
      setOpen(false);
      toast.success(`Properti "${propertyName}" telah dihapus.`);
      router.push("/agent/dashboard");
    } else {
      toast.error(res.error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <Button variant="destructive">
            <Trash2 className="mr-1 size-4" />
            Hapus
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Hapus Properti</DialogTitle>
          <DialogDescription>
            Yakin hapus properti{" "}
            <span className="font-semibold text-prime-black">
              {propertyName}
            </span>
            ? Tindakan ini tidak dapat dibatalkan.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={loading}
          >
            Batal
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={loading}
          >
            <Trash2 className="mr-1 size-4" />
            {loading ? "Menghapus..." : "Ya, Hapus"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
