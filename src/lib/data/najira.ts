import { prisma } from "@/lib/prisma";

export function listNajira(branchId: string) {
  return prisma.event.findMany({
    where: { branchId, type: "NAJIRA" },
    orderBy: { startAt: "desc" },
    include: { agendaItems: { orderBy: { sortOrder: "asc" } } },
  });
}

export async function getNajiraDetail(id: string, branchId: string) {
  const event = await prisma.event.findFirst({
    where: { id, branchId },
    include: {
      agendaItems: { orderBy: { sortOrder: "asc" } },
      files: { orderBy: { createdAt: "desc" } },
      linePosts: { orderBy: { createdAt: "desc" } },
    },
  });
  if (!event) return null;

  const [detail, plansUpForDiscussion, nextNajira] = await Promise.all([
    prisma.najiraDetail.findUnique({ where: { eventId: id } }),
    prisma.plan.findMany({
      where: {
        branchId,
        isLatest: true,
        status: { in: ["WAITING_FOR_NAJIRA", "UNDER_DISCUSSION", "REVISION_REQUIRED", "APPROVED"] },
      },
      include: { event: true },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.event.findFirst({
      where: { branchId, type: "NAJIRA", startAt: { gt: event.startAt } },
      orderBy: { startAt: "asc" },
    }),
  ]);

  return { event, detail, plansUpForDiscussion, nextNajira };
}

export type NajiraListItem = Awaited<ReturnType<typeof listNajira>>[number];
export type NajiraDetailData = NonNullable<Awaited<ReturnType<typeof getNajiraDetail>>>;
