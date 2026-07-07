import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getBranchSettings } from "@/lib/branch-settings";
import { BranchSettingsProvider } from "@/components/providers/branch-settings-provider";
import { Sidebar } from "@/components/layout/sidebar";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Header } from "@/components/layout/header";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  // SUPER_ADMIN has no branchId and operates from /admin instead of a
  // branch-scoped workspace.
  if (!session.user.branchId) {
    redirect("/admin");
  }

  const labels = await getBranchSettings(session.user.branchId);

  return (
    <BranchSettingsProvider labels={labels}>
      <div className="flex min-h-screen">
        <Sidebar
          role={session.user.role}
          displayName={labels.displayName}
          branchName={labels.branchName}
        />
        <div className="flex min-w-0 flex-1 flex-col">
          <Header session={session} displayName={labels.displayName} />
          <main className="flex-1 px-4 pb-24 pt-6 lg:px-8 lg:pb-10">
            {children}
          </main>
        </div>
        <BottomNav role={session.user.role} />
      </div>
    </BranchSettingsProvider>
  );
}
