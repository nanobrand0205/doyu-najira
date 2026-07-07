"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { canEditOperations } from "@/lib/permissions";
import { requireBranchSession, assertBranchOwnership, BranchAccessError } from "@/lib/data/guard";

async function assertCanEdit() {
  const { session, branchId } = await requireBranchSession();
  if (!canEditOperations(session.user.role)) {
    throw new BranchAccessError("この操作を行う権限がありません。");
  }
  return branchId;
}

export async function saveNajiraDetail(
  eventId: string,
  data: {
    decisions: string;
    continuedTopics: string;
    homeworkForNext: string;
    guestFollowUp: string;
  }
) {
  const branchId = await assertCanEdit();
  const event = await prisma.event.findUnique({ where: { id: eventId } });
  assertBranchOwnership(event, branchId);
  await prisma.najiraDetail.upsert({
    where: { eventId },
    update: data,
    create: { branchId, eventId, ...data },
  });
  revalidatePath(`/najira/${eventId}`);
}

export async function toggleAgendaItem(itemId: string, eventId: string, done: boolean) {
  const branchId = await assertCanEdit();
  const item = await prisma.najiraAgendaItem.findUnique({ where: { id: itemId } });
  assertBranchOwnership(item, branchId);
  await prisma.najiraAgendaItem.update({ where: { id: itemId }, data: { isDone: done } });
  revalidatePath(`/najira/${eventId}`);
}

export async function addAgendaItem(eventId: string, title: string) {
  const branchId = await assertCanEdit();
  const event = await prisma.event.findUnique({ where: { id: eventId } });
  assertBranchOwnership(event, branchId);
  const count = await prisma.najiraAgendaItem.count({ where: { eventId } });
  await prisma.najiraAgendaItem.create({
    data: { branchId, eventId, title, sortOrder: count },
  });
  revalidatePath(`/najira/${eventId}`);
}
