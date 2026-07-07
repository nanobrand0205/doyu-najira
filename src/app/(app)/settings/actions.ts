"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { canManageSensitive } from "@/lib/permissions";
import { ensureFolderStructure } from "@/lib/google/drive";
import { requireBranchSession, assertBranchOwnership, BranchAccessError } from "@/lib/data/guard";
import type { Role } from "@prisma/client";

// SUPER_ADMINはこの支部設定画面からは付与できない (支部横断の権限のため)
const ASSIGNABLE_ROLES: Role[] = ["VIEWER", "BRANCH_MEMBER", "BRANCH_MANAGER", "BRANCH_ADMIN"];

async function assertCanManage() {
  const { session, branchId } = await requireBranchSession();
  if (!canManageSensitive(session.user.role)) {
    throw new BranchAccessError("この操作を行う権限がありません。");
  }
  return { session, branchId };
}

export async function updateUserRole(userId: string, role: Role) {
  const { branchId } = await assertCanManage();
  if (!ASSIGNABLE_ROLES.includes(role)) {
    throw new BranchAccessError("この役割は付与できません。");
  }
  const targetUser = await prisma.user.findUnique({ where: { id: userId } });
  if (!targetUser || targetUser.branchId !== branchId) {
    throw new BranchAccessError("この支部のユーザーではありません。");
  }
  await prisma.user.update({ where: { id: userId }, data: { role } });
  revalidatePath("/settings");
}

export async function setCurrentFiscalYear(fiscalYearId: string) {
  const { branchId } = await assertCanManage();
  const fiscalYear = await prisma.fiscalYear.findUnique({ where: { id: fiscalYearId } });
  assertBranchOwnership(fiscalYear, branchId);
  await prisma.$transaction([
    prisma.fiscalYear.updateMany({ where: { branchId }, data: { isCurrent: false } }),
    prisma.fiscalYear.update({ where: { id: fiscalYearId }, data: { isCurrent: true } }),
  ]);
  revalidatePath("/settings");
  revalidatePath("/organization");
  revalidatePath("/");
}

export async function createFiscalYear(formData: FormData) {
  const { branchId } = await assertCanManage();
  const year = Number(formData.get("year"));
  if (!year) throw new Error("年度を入力してください。");
  await prisma.fiscalYear.create({ data: { branchId, year } });
  revalidatePath("/settings");
}

export async function testDriveConnection() {
  const { branchId } = await assertCanManage();
  const result = await ensureFolderStructure(branchId, new Date().getFullYear());
  return result;
}
