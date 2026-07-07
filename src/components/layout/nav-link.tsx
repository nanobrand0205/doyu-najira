"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Role } from "@prisma/client";
import { cn } from "@/lib/utils";
import { NAV_ITEMS, type NavItem } from "@/lib/nav";
import { atLeast } from "@/lib/permissions";
import { useBranchLabels, type BranchLabels } from "@/components/providers/branch-settings-provider";

export function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

// なじら会/例会の名称は支部ごとに変わるため、共通のNAV_ITEMSラベルを
// BranchSettingsの値で上書きする。
export function resolveLabels(
  item: NavItem,
  labels: BranchLabels
): { label: string; shortLabel: string } {
  if (item.href === "/najira") {
    return { label: labels.officerMeetingLabel, shortLabel: labels.officerMeetingLabel };
  }
  if (item.href === "/events") {
    return { label: labels.regularMeetingLabel, shortLabel: labels.regularMeetingLabel };
  }
  return { label: item.label, shortLabel: item.shortLabel };
}

// NAV_ITEMS holds lucide icon components, which can't cross the
// server/client boundary as props — so this client component imports and
// filters NAV_ITEMS itself instead of receiving it from a server parent.
export function SidebarNav({ role }: { role: Role }) {
  const items = NAV_ITEMS.filter((item) => !item.minRole || atLeast(role, item.minRole));
  return (
    <nav className="flex flex-1 flex-col gap-0.5">
      {items.map((item) => (
        <SidebarNavLink key={item.href} item={item} />
      ))}
    </nav>
  );
}

export function SidebarNavLink({ item }: { item: NavItem }) {
  const pathname = usePathname();
  const labels = useBranchLabels();
  const active = isActivePath(pathname, item.href);
  const Icon = item.icon;
  const { label } = resolveLabels(item, labels);

  return (
    <Link
      href={item.href}
      className={cn(
        "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-colors",
        active
          ? "bg-[var(--accent-soft)] text-[var(--primary)]"
          : "text-[var(--muted-foreground)] hover:bg-[var(--surface-muted)] hover:text-[var(--foreground)]"
      )}
    >
      <Icon
        className={cn(
          "h-[18px] w-[18px] shrink-0",
          active ? "text-[var(--primary)]" : "text-[var(--muted-foreground)] group-hover:text-[var(--foreground)]"
        )}
      />
      {label}
    </Link>
  );
}

export function BottomNavLink({ item }: { item: NavItem }) {
  const pathname = usePathname();
  const labels = useBranchLabels();
  const active = isActivePath(pathname, item.href);
  const Icon = item.icon;
  const { shortLabel } = resolveLabels(item, labels);

  return (
    <Link
      href={item.href}
      className={cn(
        "flex flex-1 flex-col items-center gap-1 rounded-xl py-1.5 text-[10.5px] font-medium transition-colors",
        active ? "text-[var(--primary)]" : "text-[var(--muted-foreground)]"
      )}
    >
      <Icon className="h-5 w-5" strokeWidth={active ? 2.4 : 2} />
      {shortLabel}
    </Link>
  );
}
