import { auth } from "@/lib/auth";

export class BranchAccessError extends Error {}

// Every authenticated page/action needs the caller's branchId to scope
// queries. SUPER_ADMIN has no branchId (they operate from /admin instead),
// so this throws for them rather than silently returning cross-tenant data.
export async function requireBranchSession() {
  const session = await auth();
  if (!session?.user) throw new BranchAccessError("ログインが必要です。");
  if (!session.user.branchId) {
    throw new BranchAccessError("支部が選択されていません。");
  }
  return { session, branchId: session.user.branchId };
}

// Verifies a record actually belongs to the caller's branch before a
// mutation is allowed to touch it. Prevents cross-tenant writes even if a
// record id from another branch is guessed/passed in.
export function assertBranchOwnership<T extends { branchId: string }>(
  record: T | null,
  branchId: string
): T {
  if (!record) throw new BranchAccessError("対象のデータが見つかりません。");
  if (record.branchId !== branchId) {
    throw new BranchAccessError("この支部のデータではありません。");
  }
  return record;
}
