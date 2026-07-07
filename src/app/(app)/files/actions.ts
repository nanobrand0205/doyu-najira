"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canEditOperations } from "@/lib/permissions";
import type { FileType } from "@prisma/client";

export async function registerFile(formData: FormData) {
  const session = await auth();
  if (!canEditOperations(session?.user.role)) {
    throw new Error("この操作を行う権限がありません。");
  }

  const title = String(formData.get("title") ?? "").trim();
  const type = String(formData.get("type") ?? "OTHER") as FileType;
  const driveUrl = String(formData.get("driveUrl") ?? "").trim();
  const relatedEventId = String(formData.get("relatedEventId") ?? "") || null;

  if (!title || !driveUrl) {
    throw new Error("タイトルとDriveのURLは必須です。");
  }

  await prisma.fileAsset.create({
    data: {
      title,
      type,
      driveUrl,
      relatedEventId,
      uploadedById: session!.user.memberId,
      isLatest: true,
    },
  });

  revalidatePath("/files");
}
