"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { canEditOperations } from "@/lib/permissions";
import { requireBranchSession, BranchAccessError } from "@/lib/data/guard";

export async function createNajira(formData: FormData) {
  const { session, branchId } = await requireBranchSession();
  if (!canEditOperations(session.user.role)) {
    throw new BranchAccessError("この操作を行う権限がありません。");
  }

  const dateStr = String(formData.get("date") ?? "");
  const startTime = String(formData.get("startTime") ?? "18:30");
  const endTime = String(formData.get("endTime") ?? "20:30");
  const venue = String(formData.get("venue") ?? "") || null;
  if (!dateStr) throw new Error("開催日は必須です。");

  const startAt = new Date(`${dateStr}T${startTime}:00`);
  const endAt = new Date(`${dateStr}T${endTime}:00`);

  const branchSettings = await prisma.branchSettings.findUnique({ where: { branchId } });
  const meetingLabel = branchSettings?.officerMeetingLabel ?? "幹事会";

  const event = await prisma.event.create({
    data: {
      branchId,
      title: `${startAt.getMonth() + 1}月${meetingLabel}`,
      type: "NAJIRA",
      year: startAt.getFullYear(),
      month: startAt.getMonth() + 1,
      startAt,
      endAt,
      venue,
      status: "SCHEDULED",
    },
  });

  redirect(`/najira/${event.id}`);
}
