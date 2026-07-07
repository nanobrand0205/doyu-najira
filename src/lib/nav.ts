import type { Role } from "@prisma/client";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Handshake,
  Network,
  FolderKanban,
  UserPlus,
  Settings,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  href: string;
  label: string;
  shortLabel: string;
  icon: LucideIcon;
  minRole?: Role;
};

export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "ダッシュボード", shortLabel: "ホーム", icon: LayoutDashboard },
  { href: "/events", label: "例会", shortLabel: "例会", icon: CalendarDays },
  { href: "/najira", label: "なじら会", shortLabel: "なじら会", icon: Handshake },
  { href: "/files", label: "資料BOX", shortLabel: "資料", icon: FolderKanban },
  { href: "/members", label: "会員一覧", shortLabel: "会員", icon: Users },
  { href: "/organization", label: "組織図", shortLabel: "組織図", icon: Network },
  {
    href: "/candidates",
    label: "候補者フォロー",
    shortLabel: "候補者",
    icon: UserPlus,
    minRole: "BRANCH_MANAGER",
  },
  {
    href: "/settings",
    label: "設定",
    shortLabel: "設定",
    icon: Settings,
    minRole: "BRANCH_MANAGER",
  },
];
