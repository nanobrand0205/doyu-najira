"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canEditOperations } from "@/lib/permissions";

async function assertCanEdit() {
  const session = await auth();
  if (!canEditOperations(session?.user.role)) {
    throw new Error("この操作を行う権限がありません。");
  }
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
  await assertCanEdit();
  await prisma.najiraDetail.upsert({
    where: { eventId },
    update: data,
    create: { eventId, ...data },
  });
  revalidatePath(`/najira/${eventId}`);
}

export async function toggleAgendaItem(itemId: string, eventId: string, done: boolean) {
  await assertCanEdit();
  await prisma.najiraAgendaItem.update({ where: { id: itemId }, data: { isDone: done } });
  revalidatePath(`/najira/${eventId}`);
}

export async function addAgendaItem(eventId: string, title: string) {
  await assertCanEdit();
  const count = await prisma.najiraAgendaItem.count({ where: { eventId } });
  await prisma.najiraAgendaItem.create({ data: { eventId, title, sortOrder: count } });
  revalidatePath(`/najira/${eventId}`);
}
