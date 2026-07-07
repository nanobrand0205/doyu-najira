import type { Role } from "@prisma/client";
import { SidebarNav } from "./nav-link";

export function Sidebar({
  role,
  displayName,
  branchName,
}: {
  role: Role;
  displayName: string;
  branchName: string;
}) {
  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-[var(--border)] bg-[var(--surface)]/60 px-4 py-6 backdrop-blur-xl lg:flex">
      <div className="mb-8 flex items-center gap-2.5 px-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--primary)] text-sm font-bold text-[var(--primary-foreground)]">
          {displayName.slice(0, 1)}
        </div>
        <div>
          <p className="text-[14px] font-semibold leading-tight tracking-tight">
            {displayName}
          </p>
          <p className="text-[11px] leading-tight text-[var(--muted-foreground)]">
            {branchName}
          </p>
        </div>
      </div>

      <SidebarNav role={role} />

      <div className="mt-auto rounded-xl bg-[var(--surface-muted)] px-3 py-3 text-[11px] text-[var(--muted-foreground)]">
        <p className="font-medium text-[var(--foreground)]">e-doyu / LINE / Google連携</p>
        <p className="mt-0.5">支部運営の司令塔</p>
      </div>
    </aside>
  );
}
