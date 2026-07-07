import { prisma } from "@/lib/prisma";
import { addDays } from "date-fns";

export async function getDashboardData(branchId: string) {
  const now = new Date();
  const weekAhead = addDays(now, 7);

  const [
    nextEvent,
    nextNajira,
    monthEvents,
    newFiles,
    recentPhotos,
    teams,
    plansNeedingAttention,
    unsubmittedUpcoming,
    lineDraftsPending,
    candidatesToFollow,
    overdueTasks,
    todayTasks,
  ] = await Promise.all([
    prisma.event.findFirst({
      where: { branchId, type: "REGULAR_MEETING", startAt: { gte: now } },
      orderBy: { startAt: "asc" },
      include: { team: true, chairMember: true, roomLeaderMember: true },
    }),
    prisma.event.findFirst({
      where: { branchId, type: "NAJIRA", startAt: { gte: now } },
      orderBy: { startAt: "asc" },
      include: { agendaItems: { orderBy: { sortOrder: "asc" } } },
    }),
    prisma.event.findMany({
      where: {
        branchId,
        startAt: { gte: new Date(now.getFullYear(), now.getMonth(), 1) },
        type: { in: ["REGULAR_MEETING", "NAJIRA", "TEAM_MEETING", "FORUM", "GENERAL_MEETING"] },
      },
      orderBy: { startAt: "asc" },
      take: 8,
      include: { team: true },
    }),
    prisma.fileAsset.findMany({
      where: { branchId },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { uploadedBy: true, relatedEvent: true },
    }),
    prisma.fileAsset.findMany({
      where: { branchId, type: "PHOTO" },
      orderBy: { createdAt: "desc" },
      take: 4,
    }),
    prisma.team.findMany({
      where: { branchId, fiscalYear: { isCurrent: true } },
      include: { memberships: { include: { member: true } } },
    }),
    prisma.plan.findMany({
      where: {
        branchId,
        isLatest: true,
        status: { in: ["WAITING_FOR_NAJIRA", "UNDER_DISCUSSION", "REVISION_REQUIRED"] },
      },
      include: { event: true },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.event.findMany({
      where: {
        branchId,
        type: "REGULAR_MEETING",
        startAt: { gte: now },
        plans: { none: {} },
      },
      orderBy: { startAt: "asc" },
    }),
    prisma.linePost.findMany({
      where: { branchId, status: { in: ["DRAFT", "SCHEDULED"] } },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { relatedEvent: true },
    }),
    prisma.candidate.findMany({
      where: {
        branchId,
        nextActionDate: { lte: weekAhead },
        status: { notIn: ["JOINED", "DECLINED"] },
      },
      orderBy: { nextActionDate: "asc" },
      take: 6,
      include: { assignedTo: true },
    }),
    prisma.task.findMany({
      where: {
        branchId,
        status: { in: ["TODO", "DOING"] },
        dueDate: { lt: new Date(now.toDateString()) },
      },
      orderBy: { dueDate: "asc" },
      include: { assignedTo: true, relatedEvent: true },
    }),
    prisma.task.findMany({
      where: {
        branchId,
        status: { in: ["TODO", "DOING"] },
        dueDate: {
          gte: new Date(now.toDateString()),
          lt: addDays(new Date(now.toDateString()), 1),
        },
      },
      include: { assignedTo: true, relatedEvent: true },
    }),
  ]);

  return {
    nextEvent,
    nextNajira,
    monthEvents,
    newFiles,
    recentPhotos,
    teams,
    plansNeedingAttention,
    unsubmittedUpcoming,
    lineDraftsPending,
    candidatesToFollow,
    overdueTasks,
    todayTasks,
  };
}

export type DashboardData = Awaited<ReturnType<typeof getDashboardData>>;
