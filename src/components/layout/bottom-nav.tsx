"use client";

import type { Role } from "@prisma/client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { NAV_ITEMS } from "@/lib/nav";
import { atLeast } from "@/lib/permissions";
import { BottomNavLink, isActivePath } from "./nav-link";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const PRIMARY_COUNT = 4;

export function BottomNav({ role }: { role: Role }) {
  const items = NAV_ITEMS.filter((item) => !item.minRole || atLeast(role, item.minRole));
  const primary = items.slice(0, PRIMARY_COUNT);
  const rest = items.slice(PRIMARY_COUNT);
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const restActive = rest.some((item) => isActivePath(pathname, item.href));

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex items-stretch gap-1 border-t border-[var(--border)] bg-[var(--surface)]/90 px-2 pb-[env(safe-area-inset-bottom)] pt-1.5 backdrop-blur-xl lg:hidden">
      {primary.map((item) => (
        <BottomNavLink key={item.href} item={item} />
      ))}

      {rest.length > 0 && (
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button
              className={cn(
                "flex flex-1 flex-col items-center gap-1 rounded-xl py-1.5 text-[10.5px] font-medium transition-colors",
                restActive ? "text-[var(--primary)]" : "text-[var(--muted-foreground)]"
              )}
            >
              <Menu className="h-5 w-5" strokeWidth={restActive ? 2.4 : 2} />
              もっと見る
            </button>
          </SheetTrigger>
          <SheetContent>
            <div className="grid grid-cols-3 gap-3 pb-2">
              {rest.map((item) => {
                const Icon = item.icon;
                const active = isActivePath(pathname, item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex flex-col items-center gap-2 rounded-2xl border border-[var(--border)] px-3 py-4 text-[12px] font-medium",
                      active
                        ? "border-transparent bg-[var(--accent-soft)] text-[var(--primary)]"
                        : "text-[var(--foreground)]"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </SheetContent>
        </Sheet>
      )}
    </nav>
  );
}
