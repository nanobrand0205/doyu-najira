import { prisma } from "@/lib/prisma";

export function listCandidates() {
  return prisma.candidate.findMany({
    orderBy: { nextActionDate: "asc" },
    include: { assignedTo: true, introducedBy: true },
  });
}

export function getCandidateDetail(id: string) {
  return prisma.candidate.findUnique({
    where: { id },
    include: {
      assignedTo: true,
      introducedBy: true,
      emailLogs: { orderBy: { createdAt: "desc" } },
    },
  });
}

export type CandidateListItem = Awaited<ReturnType<typeof listCandidates>>[number];
export type CandidateDetailData = NonNullable<Awaited<ReturnType<typeof getCandidateDetail>>>;
