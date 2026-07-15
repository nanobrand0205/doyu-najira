"use server";

import { auth, unstable_update } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type ClaimResult =
  | { ok: true }
  | { ok: false; reason: "not_logged_in" | "invalid_input" | "not_found" | "ambiguous" };

const CORPORATE_DESIGNATORS = [
  "株式会社",
  "（株）",
  "(株)",
  "㈱",
  "有限会社",
  "（有）",
  "(有)",
  "㈲",
  "合同会社",
  "（同）",
  "(同)",
  "合名会社",
  "合資会社",
];

function normalize(value: string) {
  let v = value.replace(/[\s　]+/g, "").trim();
  for (const designator of CORPORATE_DESIGNATORS) {
    v = v.split(designator).join("");
  }
  return v;
}

export async function claimMemberAccount(name: string, companyName: string): Promise<ClaimResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { ok: false, reason: "not_logged_in" };
  }
  if (session.user.branchId) {
    return { ok: true };
  }

  const normalizedName = normalize(name);
  const normalizedCompany = normalize(companyName);
  if (!normalizedName || !normalizedCompany) {
    return { ok: false, reason: "invalid_input" };
  }

  const candidates = await prisma.member.findMany({
    where: { user: { is: null }, branch: { isActive: true } },
  });

  const matches = candidates.filter(
    (m) => normalize(m.name) === normalizedName && normalize(m.companyName) === normalizedCompany
  );

  if (matches.length !== 1) {
    return { ok: false, reason: matches.length === 0 ? "not_found" : "ambiguous" };
  }

  const member = matches[0];
  await prisma.user.update({
    where: { id: session.user.id },
    data: { branchId: member.branchId, memberId: member.id },
  });

  // Refresh the JWT cookie so the newly linked branchId/memberId take
  // effect immediately, without requiring a full sign-out/sign-in.
  await unstable_update({});

  return { ok: true };
}
