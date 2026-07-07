import { prisma } from "@/lib/prisma";

export function listEvents() {
  return prisma.event.findMany({
    where: { type: { in: ["REGULAR_MEETING", "FORUM", "GENERAL_MEETING"] } },
    orderBy: { startAt: "desc" },
    include: {
      team: true,
      chairMember: true,
      plans: { where: { isLatest: true } },
    },
  });
}

export function getEventDetail(id: string) {
  return prisma.event.findUnique({
    where: { id },
    include: {
      team: true,
      chairMember: true,
      roomLeaderMember: true,
      plans: { orderBy: { version: "desc" } },
      files: { orderBy: { createdAt: "desc" } },
      tasks: { orderBy: { dueDate: "asc" }, include: { assignedTo: true } },
      linePosts: { orderBy: { createdAt: "desc" } },
    },
  });
}

export type EventListItem = Awaited<ReturnType<typeof listEvents>>[number];
export type EventDetail = NonNullable<Awaited<ReturnType<typeof getEventDetail>>>;
