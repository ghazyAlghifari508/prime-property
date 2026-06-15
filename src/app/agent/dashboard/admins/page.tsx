import { redirect } from "next/navigation";
import { Crown, ShieldUser } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatTanggal } from "@/lib/format";
import { getCurrentUser } from "@/lib/auth";
import { listAdmins, getSuperadmin } from "@/lib/actions/admins";
import { AdminActions } from "./AdminActions";
import { AdminAddDialog } from "./AdminAddDialog";

export default async function AdminManagementPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "superadmin") {
    redirect("/agent/dashboard");
  }

  const [admins, superadmin] = await Promise.all([
    listAdmins(),
    getSuperadmin(),
  ]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-bold text-3xl font-semibold text-prime-black">
            Manajemen Admin
          </h1>
          <p className="text-sm text-muted-foreground">
            Kelola akun admin internal Prime Property.
          </p>
        </div>

        <AdminAddDialog />
      </div>

      {/* Daftar superadmin (info) */}
      {superadmin && (
        <div className="rounded-lg border border-prime-gold/30 bg-prime-gold/5 p-4">
          <div className="flex items-center gap-2 text-sm">
            <Crown className="size-4 text-prime-gold-dark" />
            <span className="font-medium text-prime-black">
              {superadmin.nama}
            </span>
            <Badge
              variant="outline"
              className="border-prime-gold/50 text-prime-gold-dark"
            >
              Superadmin
            </Badge>
            <span className="text-muted-foreground">
              ({superadmin.email})
            </span>
          </div>
        </div>
      )}

      {/* Tabel admin */}
      <div className="overflow-x-auto rounded-xl border border-border bg-prime-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="border-b-2 border-prime-gold/30 bg-soft-gray hover:bg-soft-gray [&_th]:text-xs [&_th]:uppercase [&_th]:tracking-wide">
              <TableHead>Nama</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Dibuat</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {admins.map((u) => (
              <TableRow key={u.id}>
                <TableCell className="font-medium text-prime-black">
                  <span className="flex items-center gap-2">
                    <ShieldUser className="size-4 text-muted-foreground" />
                    {u.nama}
                  </span>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {u.email}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatTanggal(u.created_at)}
                </TableCell>
                <TableCell className="text-center">
                  {u.is_active ? (
                    <Badge
                      className="border-0"
                      style={{
                        backgroundColor: "var(--status-instock-bg)",
                        color: "var(--status-instock-fg)",
                      }}
                    >
                      Aktif
                    </Badge>
                  ) : (
                    <Badge
                      className="border-0"
                      style={{
                        backgroundColor: "var(--status-soldout-bg)",
                        color: "var(--status-soldout-fg)",
                      }}
                    >
                      Nonaktif
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <AdminActions admin={u} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
