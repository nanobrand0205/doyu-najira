"use server";

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canEditOperations } from "@/lib/permissions";

export async function createNajira(formData: FormData) {
  const session = await auth();
  if (!canEditOperations(session?.user.role)) {
    throw new Error("この操作を行う権限がありません。");
  }

  const dateStr = String(formData.get("date") ?? "");
  const startTime = String(formData.get("startTime") ?? "18:30");
  const endTime = String(formData.get("endTime") ?? "20:30");
  const venue = String(formData.get("venue") ?? "") || null;
  if (!dateStr) throw new Error("開催日は必須です。");

  const startAt = new Date(`${dateStr}T${startTime}:00`);
  const endAt = new Date(`${dateStr}T${endTime}:00`);

  const event = await prisma.event.create({
    data: {
      title: `${startAt.getMonth() + 1}月なじら会`,
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
