import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { isSuperAdmin } from "@/lib/permissions";
import { UserMenu } from "@/components/layout/user-menu";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  // Not a super_admin: don't bounce back to (app), which would redirect here
  // again for anyone without a branchId. Send them to /login instead.
  if (!isSuperAdmin(session.user.role)) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[var(--border)] bg-[var(--background)]/80 px-4 backdrop-blur-xl lg:px-8">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--primary)] text-[13px] font-bold text-[var(--primary-foreground)]">
            D
          </div>
          <span className="text-[14px] font-semibold tracking-tight">
            Doyu Board 運営管理
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <ThemeToggle />
          <UserMenu
            name={session.user.name}
            email={session.user.email}
            image={session.user.image}
            role={session.user.role}
          />
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-8 lg:px-8">{children}</main>
    </div>
  );
}
