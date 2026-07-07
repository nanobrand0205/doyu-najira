"use server";

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isSuperAdmin } from "@/lib/permissions";

export async function createBranch(formData: FormData) {
  const session = await auth();
  if (!isSuperAdmin(session?.user.role)) {
    throw new Error("この操作を行う権限がありません。");
  }

  const slug = String(formData.get("slug") ?? "").trim();
  const branchName = String(formData.get("branchName") ?? "").trim();
  const displayName = String(formData.get("displayName") ?? "").trim() || branchName;
  const officerMeetingLabel = String(formData.get("officerMeetingLabel") ?? "").trim() || "幹事会";
  const regularMeetingLabel = String(formData.get("regularMeetingLabel") ?? "").trim() || "例会";
  const adminEmail = String(formData.get("adminEmail") ?? "").trim();

  if (!slug || !branchName || !adminEmail) {
    throw new Error("スラッグ・支部名・管理者メールは必須です。");
  }

  const currentYear = new Date().getFullYear();

  const branch = await prisma.branch.create({
    data: {
      slug,
      settings: {
        create: { branchName, displayName, officerMeetingLabel, regularMeetingLabel },
      },
      fiscalYears: {
        create: { year: currentYear, isCurrent: true },
      },
      users: {
        create: { email: adminEmail, role: "BRANCH_ADMIN" },
      },
    },
  });

  redirect(`/admin?created=${branch.slug}`);
}
