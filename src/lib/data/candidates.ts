import { prisma } from "@/lib/prisma";

export function listCandidates(branchId: string) {
  return prisma.candidate.findMany({
    where: { branchId },
    orderBy: { nextActionDate: "asc" },
    include: { assignedTo: true, introducedBy: true },
  });
}

export function getCandidateDetail(id: string, branchId: string) {
  return prisma.candidate.findFirst({
    where: { id, branchId },
    include: {
      assignedTo: true,
      introducedBy: true,
      emailLogs: { orderBy: { createdAt: "desc" } },
    },
  });
}

export type CandidateListItem = Awaited<ReturnType<typeof listCandidates>>[number];
export type CandidateDetailData = NonNullable<Awaited<ReturnType<typeof getCandidateDetail>>>;
