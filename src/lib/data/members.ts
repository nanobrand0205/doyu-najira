import { prisma } from "@/lib/prisma";

export async function listMembers(branchId: string) {
  return prisma.member.findMany({
    where: { branchId, isActive: true },
    orderBy: { name: "asc" },
    include: {
      teamMemberships: {
        where: { team: { fiscalYear: { isCurrent: true } } },
        include: { team: true },
      },
      orgPositions: {
        where: { fiscalYear: { isCurrent: true } },
        orderBy: { sortOrder: "asc" },
      },
    },
  });
}

export async function getMemberDetail(id: string, branchId: string) {
  return prisma.member.findFirst({
    where: { id, branchId },
    include: {
      teamMemberships: { include: { team: { include: { fiscalYear: true } } } },
      orgPositions: {
        include: { fiscalYear: true },
        orderBy: [{ fiscalYear: { year: "desc" } }, { sortOrder: "asc" }],
      },
    },
  });
}

export type MemberListItem = Awaited<ReturnType<typeof listMembers>>[number];
export type MemberDetailData = NonNullable<Awaited<ReturnType<typeof getMemberDetail>>>;
