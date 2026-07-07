import Link from "next/link";
import type { Session } from "next-auth";
import { ThemeToggle } from "./theme-toggle";
import { UserMenu } from "./user-menu";

export function Header({ session, displayName }: { session: Session; displayName: string }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[var(--border)] bg-[var(--background)]/80 px-4 backdrop-blur-xl lg:px-8">
      <Link href="/" className="flex items-center gap-2 lg:hidden">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--primary)] text-[13px] font-bold text-[var(--primary-foreground)]">
          {displayName.slice(0, 1)}
        </div>
        <span className="text-[14px] font-semibold tracking-tight">{displayName}</span>
      </Link>
      <div className="hidden lg:block" />
      <div className="flex items-center gap-1.5">
        <ThemeToggle />
        <UserMenu
          name={session.user?.name}
          email={session.user?.email}
          image={session.user?.image}
          role={session.user.role}
        />
      </div>
    </header>
  );
}
