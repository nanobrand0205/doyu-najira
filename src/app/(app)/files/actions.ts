"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { canEditOperations } from "@/lib/permissions";
import { requireBranchSession, assertBranchOwnership, BranchAccessError } from "@/lib/data/guard";
import type { FileType } from "@prisma/client";

export async function registerFile(formData: FormData) {
  const { session, branchId } = await requireBranchSession();
  if (!canEditOperations(session.user.role)) {
    throw new BranchAccessError("この操作を行う権限がありません。");
  }

  const title = String(formData.get("title") ?? "").trim();
  const type = String(formData.get("type") ?? "OTHER") as FileType;
  const driveUrl = String(formData.get("driveUrl") ?? "").trim();
  const relatedEventId = String(formData.get("relatedEventId") ?? "") || null;

  if (!title || !driveUrl) {
    throw new Error("タイトルとDriveのURLは必須です。");
  }

  if (relatedEventId) {
    const event = await prisma.event.findUnique({ where: { id: relatedEventId } });
    assertBranchOwnership(event, branchId);
  }

  await prisma.fileAsset.create({
    data: {
      branchId,
      title,
      type,
      driveUrl,
      relatedEventId,
      uploadedById: session.user.memberId,
      isLatest: true,
    },
  });

  revalidatePath("/files");
}
