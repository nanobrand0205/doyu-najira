"use server";

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canEditOperations } from "@/lib/permissions";

export async function createEvent(formData: FormData) {
  const session = await auth();
  if (!canEditOperations(session?.user.role)) {
    throw new Error("この操作を行う権限がありません。");
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

  const startAt = new Date(`${dateStr}T${startTime}:00`);
  const endAt = new Date(`${dateStr}T${endTime}:00`);

  const event = await prisma.event.create({
    data: {
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
      eventId: event.id,
      title: `${title} 企画書 v1`,
      status: "DRAFT",
      version: 1,
      isLatest: true,
    },
  });

  redirect(`/events/${event.id}`);
}
