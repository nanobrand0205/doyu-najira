"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canManageSensitive } from "@/lib/permissions";
import { ensureFolderStructure } from "@/lib/google/drive";
import type { Role } from "@prisma/client";

async function assertCanManage() {
  const session = await auth();
  if (!canManageSensitive(session?.user.role)) {
    throw new Error("この操作を行う権限がありません。");
  }
  return session!;
}

export async function updateUserRole(userId: string, role: Role) {
  await assertCanManage();
  await prisma.user.update({ where: { id: userId }, data: { role } });
  revalidatePath("/settings");
}

export async function setCurrentFiscalYear(fiscalYearId: string) {
  await assertCanManage();
  await prisma.$transaction([
    prisma.fiscalYear.updateMany({ data: { isCurrent: false } }),
    prisma.fiscalYear.update({ where: { id: fiscalYearId }, data: { isCurrent: true } }),
  ]);
  revalidatePath("/settings");
  revalidatePath("/organization");
  revalidatePath("/");
}

export async function createFiscalYear(formData: FormData) {
  await assertCanManage();
  const year = Number(formData.get("year"));
  if (!year) throw new Error("年度を入力してください。");
  await prisma.fiscalYear.create({ data: { year } });
  revalidatePath("/settings");
}

export async function testDriveConnection() {
  const session = await assertCanManage();
  const result = await ensureFolderStructure(session.user.id, new Date().getFullYear());
  return result;
}
