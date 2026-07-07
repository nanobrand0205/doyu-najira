import { prisma } from "@/lib/prisma";

export async function listMembers() {
  return prisma.member.findMany({
    where: { isActive: true },
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

export async function getMemberDetail(id: string) {
  return prisma.member.findUnique({
    where: { id },
    include: {
      teamMemberships: { include: { team: { include: { fiscalYear: true } } } },
      orgPositions: { include: { fiscalYear: true }, orderBy: [{ fiscalYear: { year: "desc" } }, { sortOrder: "asc" }] },
    },
  });
}

export type MemberListItem = Awaited<ReturnType<typeof listMembers>>[number];
export type MemberDetailData = NonNullable<Awaited<ReturnType<typeof getMemberDetail>>>;
