import { prisma } from "@/lib/prisma";

// SUPER_ADMIN only: intentionally cross-tenant (not scoped to a single
// branchId) since this is the one screen that manages branches themselves.
export function listBranchesForAdmin() {
  return prisma.branch.findMany({
    orderBy: { createdAt: "asc" },
    include: {
      settings: true,
      _count: { select: { members: true, users: true } },
    },
  });
}

export type BranchAdminListItem = Awaited<ReturnType<typeof listBranchesForAdmin>>[number];
