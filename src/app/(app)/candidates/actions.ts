"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canEditOperations } from "@/lib/permissions";
import type { CandidateStatus } from "@prisma/client";

async function assertCanEdit() {
  const session = await auth();
  if (!canEditOperations(session?.user.role)) {
    throw new Error("この操作を行う権限がありません。");
  }
}

export async function updateCandidateStatus(candidateId: string, status: CandidateStatus) {
  await assertCanEdit();
  await prisma.candidate.update({
    where: { id: candidateId },
    data: { status, lastContactDate: new Date() },
  });
  revalidatePath(`/candidates/${candidateId}`);
  revalidatePath("/candidates");
}

export async function updateNextActionDate(candidateId: string, date: string) {
  await assertCanEdit();
  await prisma.candidate.update({
    where: { id: candidateId },
    data: { nextActionDate: date ? new Date(date) : null },
  });
  revalidatePath(`/candidates/${candidateId}`);
}

export async function updateCandidateNotes(candidateId: string, notes: string) {
  await assertCanEdit();
  await prisma.candidate.update({ where: { id: candidateId }, data: { notes } });
  revalidatePath(`/candidates/${candidateId}`);
}

export async function saveEmailDraft(candidateId: string, subject: string, body: string) {
  await assertCanEdit();
  await prisma.emailLog.create({
    data: { candidateId, subject, body, status: "DRAFT" },
  });
  revalidatePath(`/candidates/${candidateId}`);
}

export async function markEmailSent(emailLogId: string, candidateId: string) {
  await assertCanEdit();
  await prisma.emailLog.update({
    where: { id: emailLogId },
    data: { status: "SENT", sentAt: new Date() },
  });
  await prisma.candidate.update({
    where: { id: candidateId },
    data: { lastContactDate: new Date() },
  });
  revalidatePath(`/candidates/${candidateId}`);
}

export async function createCandidate(formData: FormData) {
  await assertCanEdit();
  const name = String(formData.get("name") ?? "").trim();
  if (!name) throw new Error("氏名は必須です。");

  await prisma.candidate.create({
    data: {
      name,
      companyName: String(formData.get("companyName") ?? "") || null,
      position: String(formData.get("position") ?? "") || null,
      email: String(formData.get("email") ?? "") || null,
      phone: String(formData.get("phone") ?? "") || null,
      notes: String(formData.get("notes") ?? "") || null,
      status: "NOT_CONTACTED",
    },
  });
  revalidatePath("/candidates");
}
