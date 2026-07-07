import type { Role } from "@prisma/client";

// SUPER_ADMINは支部横断の別枠権限のため、支部内の階層には含めない (isSuperAdminで判定)
const ROLE_ORDER: Record<Role, number> = {
  VIEWER: 0,
  BRANCH_MEMBER: 1,
  BRANCH_MANAGER: 2,
  BRANCH_ADMIN: 3,
  SUPER_ADMIN: 4,
};

export function atLeast(role: Role | undefined, min: Role): boolean {
  if (!role) return false;
  return ROLE_ORDER[role] >= ROLE_ORDER[min];
}

export function isSuperAdmin(role: Role | undefined): boolean {
  return role === "SUPER_ADMIN";
}

// 幹事(BRANCH_MANAGER)以上: 例会計画書・なじら会・資料の編集ができる
export function canEditOperations(role: Role | undefined): boolean {
  return atLeast(role, "BRANCH_MANAGER");
}

// 支部管理者(BRANCH_ADMIN)以上: 候補者の機微情報, 組織図, 年度設定, 支部設定, Google連携
export function canManageSensitive(role: Role | undefined): boolean {
  return atLeast(role, "BRANCH_ADMIN");
}

export function roleLabel(role: Role): string {
  switch (role) {
    case "VIEWER":
      return "閲覧のみ";
    case "BRANCH_MEMBER":
      return "会員";
    case "BRANCH_MANAGER":
      return "幹事";
    case "BRANCH_ADMIN":
      return "支部管理者";
    case "SUPER_ADMIN":
      return "運営管理者";
  }
}
