import { redirect } from "next/navigation";
import { FilePlus2, FilePenLine, Trash2, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatTanggalWaktu } from "@/lib/format";
import { getCurrentUser } from "@/lib/auth";
import { listAuditLogs } from "@/lib/actions/audit";
import type { AuditAction } from "@/lib/types";

const ACTION_META: Record<
  AuditAction,
  { label: string; icon: typeof FilePlus2; bg: string; fg: string }
> = {
  create: {
    label: "Tambah",
    icon: FilePlus2,
    bg: "var(--status-instock-bg)",
    fg: "var(--status-instock-fg)",
  },
  update: {
    label: "Ubah",
    icon: FilePenLine,
    bg: "var(--status-siaphuni-bg)",
    fg: "var(--status-siaphuni-fg)",
  },
  delete: {
    label: "Hapus",
    icon: Trash2,
    bg: "var(--status-soldout-bg)",
    fg: "var(--status-soldout-fg)",
  },
  restore: {
    label: "Pulihkan",
    icon: RotateCcw,
    bg: "var(--status-siapkosong-bg)",
    fg: "var(--status-siapkosong-fg)",
  },
};

export default async function AuditLogPage() {
  const user = await getCurrentUser();
  if (!user || user.role !== "superadmin") {
    redirect("/agent/dashboard");
  }

  const logs = await listAuditLogs(200);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-3xl font-semibold text-prime-black">
          Audit Log
        </h1>
        <p className="text-sm text-muted-foreground">
          Riwayat perubahan data properti — siapa, kapan, dan apa yang berubah.
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-prime-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="border-b-2 border-prime-gold/30 bg-soft-gray hover:bg-soft-gray [&_th]:text-xs [&_th]:uppercase [&_th]:tracking-wide">
              <TableHead>Waktu</TableHead>
              <TableHead>Pengguna</TableHead>
              <TableHead>Aksi</TableHead>
              <TableHead>Properti</TableHead>
              <TableHead>Perubahan</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => {
              const meta = ACTION_META[log.action];
              const Icon = meta.icon;
              return (
                <TableRow key={log.id}>
                  <TableCell className="whitespace-nowrap text-muted-foreground">
                    {formatTanggalWaktu(log.created_at)}
                  </TableCell>
                  <TableCell className="font-medium text-prime-black">
                    {log.user_nama}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className="border-0"
                      style={{ backgroundColor: meta.bg, color: meta.fg }}
                    >
                      <Icon className="mr-1 size-3" />
                      {meta.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-prime-black">
                    {log.property_nama}
                  </TableCell>
                  <TableCell>
                    {log.changes.length === 0 ? (
                      <span className="text-muted-foreground">—</span>
                    ) : (
                      <ul className="space-y-0.5 text-xs">
                        {log.changes.map((c, i) => (
                          <li key={i}>
                            <span className="font-medium text-prime-black">
                              {c.field}:
                            </span>{" "}
                            <span className="text-prime-red line-through">
                              {c.before}
                            </span>{" "}
                            →{" "}
                            <span className="text-green-700">{c.after}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
