"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { canEditOperations } from "@/lib/permissions";
import { requireBranchSession, assertBranchOwnership, BranchAccessError } from "@/lib/data/guard";
import type { PlanStatus } from "@prisma/client";

async function assertCanEdit() {
  const { session, branchId } = await requireBranchSession();
  if (!canEditOperations(session.user.role)) {
    throw new BranchAccessError("この操作を行う権限がありません。");
  }
  return { session, branchId };
}

export async function updatePlanStatus(eventId: string, planId: string, status: PlanStatus) {
  const { branchId } = await assertCanEdit();
  const plan = await prisma.plan.findUnique({ where: { id: planId } });
  assertBranchOwnership(plan, branchId);
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
  const { branchId } = await assertCanEdit();
  const event = await prisma.event.findUnique({ where: { id: eventId } });
  assertBranchOwnership(event, branchId);
  await prisma.linePost.create({
    data: { branchId, relatedEventId: eventId, title, body, status: "DRAFT" },
  });
  revalidatePath(`/events/${eventId}`);
}

export async function markLinePostPosted(linePostId: string, eventId: string) {
  const { session, branchId } = await assertCanEdit();
  const post = await prisma.linePost.findUnique({ where: { id: linePostId } });
  assertBranchOwnership(post, branchId);
  await prisma.linePost.update({
    where: { id: linePostId },
    data: { status: "POSTED", postedAt: new Date(), postedById: session.user.memberId },
  });
  revalidatePath(`/events/${eventId}`);
}

export async function toggleTaskDone(taskId: string, eventId: string, done: boolean) {
  const { branchId } = await assertCanEdit();
  const task = await prisma.task.findUnique({ where: { id: taskId } });
  assertBranchOwnership(task, branchId);
  await prisma.task.update({
    where: { id: taskId },
    data: { status: done ? "DONE" : "TODO" },
  });
  revalidatePath(`/events/${eventId}`);
}
