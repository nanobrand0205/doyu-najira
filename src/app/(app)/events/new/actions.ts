"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { canEditOperations } from "@/lib/permissions";
import { requireBranchSession, assertBranchOwnership, BranchAccessError } from "@/lib/data/guard";

export async function createEvent(formData: FormData) {
  const { session, branchId } = await requireBranchSession();
  if (!canEditOperations(session.user.role)) {
    throw new BranchAccessError("この操作を行う権限がありません。");
  }

  const title = String(formData.get("title") ?? "").trim();
  const teamId = String(formData.get("teamId") ?? "") || null;
  const dateStr = String(formData.get("date") ?? "");
  const startTime = String(formData.get("startTime") ?? "18:30");
  const endTime = String(formData.get("endTime") ?? "20:30");
  const venue = String(formData.get("venue") ?? "") || null;
  const theme = String(formData.get("theme") ?? "") || null;
  const purpose = String(formData.get("purpose") ?? "") || null;

  if (!title || !dateStr) {
    throw new Error("例会名と開催日は必須です。");
  }

  if (teamId) {
    const team = await prisma.team.findUnique({ where: { id: teamId } });
    assertBranchOwnership(team, branchId);
  }

  const startAt = new Date(`${dateStr}T${startTime}:00`);
  const endAt = new Date(`${dateStr}T${endTime}:00`);

  const event = await prisma.event.create({
    data: {
      branchId,
      title,
      type: "REGULAR_MEETING",
      year: startAt.getFullYear(),
      month: startAt.getMonth() + 1,
      teamId,
      startAt,
      endAt,
      venue,
      theme,
      purpose,
      status: "SCHEDULED",
    },
  });

  await prisma.plan.create({
    data: {
      branchId,
      eventId: event.id,
      title: `${title} 企画書 v1`,
      status: "DRAFT",
      version: 1,
      isLatest: true,
    },
  });

  redirect(`/events/${event.id}`);
}
