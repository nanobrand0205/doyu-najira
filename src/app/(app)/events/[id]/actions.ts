"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canEditOperations } from "@/lib/permissions";
import type { PlanStatus } from "@prisma/client";

async function assertCanEdit() {
  const session = await auth();
  if (!canEditOperations(session?.user.role)) {
    throw new Error("この操作を行う権限がありません。");
  }
  return session!;
}

export async function updatePlanStatus(eventId: string, planId: string, status: PlanStatus) {
  await assertCanEdit();
  await prisma.plan.update({
    where: { id: planId },
    data: {
      status,
      approvedAt: status === "APPROVED" ? new Date() : undefined,
    },
  });
  revalidatePath(`/events/${eventId}`);
}

export async function saveLinePostDraft(eventId: string, title: string, body: string) {
  await assertCanEdit();
  await prisma.linePost.create({
    data: { relatedEventId: eventId, title, body, status: "DRAFT" },
  });
  revalidatePath(`/events/${eventId}`);
}

export async function markLinePostPosted(linePostId: string, eventId: string) {
  const session = await assertCanEdit();
  await prisma.linePost.update({
    where: { id: linePostId },
    data: { status: "POSTED", postedAt: new Date(), postedById: session.user.memberId },
  });
  revalidatePath(`/events/${eventId}`);
}

export async function toggleTaskDone(taskId: string, eventId: string, done: boolean) {
  await assertCanEdit();
  await prisma.task.update({
    where: { id: taskId },
    data: { status: done ? "DONE" : "TODO" },
  });
  revalidatePath(`/events/${eventId}`);
}
