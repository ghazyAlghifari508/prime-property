"use server";

import { prisma } from "@/lib/db";
import { requireSuperadmin } from "@/lib/auth";
import { mapAuditLog } from "@/lib/mappers";
import type { AuditLog } from "@/lib/types";

export async function listAuditLogs(limit = 100): Promise<AuditLog[]> {
  await requireSuperadmin();
  const rows = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  return rows.map(mapAuditLog);
}
