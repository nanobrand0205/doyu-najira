import type { Role } from "@prisma/client";

const ROLE_ORDER: Record<Role, number> = {
  MEMBER: 0,
  SECRETARY: 1,
  ADMIN: 2,
  MANAGER: 3,
};

export function atLeast(role: Role | undefined, min: Role): boolean {
  if (!role) return false;
  return ROLE_ORDER[role] >= ROLE_ORDER[min];
}

// 幹事以上: 例会計画書・なじら会・資料の編集ができる
export function canEditOperations(role: Role | undefined): boolean {
  return atLeast(role, "SECRETARY");
}

// 支部長・副支部長・幹事長・事務局: 候補者の機微情報, 組織図, 年度設定
export function canManageSensitive(role: Role | undefined): boolean {
  return atLeast(role, "ADMIN");
}

export function roleLabel(role: Role): string {
  switch (role) {
    case "MEMBER":
      return "会員";
    case "SECRETARY":
      return "幹事";
    case "ADMIN":
      return "事務局";
    case "MANAGER":
      return "支部長・幹事長";
  }
}
