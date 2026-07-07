import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canEditOperations, canManageSensitive } from "@/lib/permissions";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GoogleConnectionCard } from "@/components/settings/google-connection-card";
import { UserRoleTable } from "@/components/settings/user-role-table";
import { FiscalYearManager } from "@/components/settings/fiscal-year-manager";

export default async function SettingsPage() {
  const session = await auth();
  if (!canEditOperations(session?.user.role)) {
    redirect("/");
  }

  const isManager = canManageSensitive(session?.user.role);
  const [account, years, users] = await Promise.all([
    session?.user.id
      ? prisma.account.findFirst({ where: { userId: session.user.id, provider: "google" } })
      : null,
    isManager ? prisma.fiscalYear.findMany({ orderBy: { year: "desc" } }) : Promise.resolve([]),
    isManager ? prisma.user.findMany({ orderBy: { createdAt: "asc" } }) : Promise.resolve([]),
  ]);

  return (
    <div>
      <PageHeader title="設定" description="Google連携、年度、権限を管理します。" />

      <div className="grid gap-4 lg:grid-cols-2">
        <GoogleConnectionCard connected={!!account} />

        <Card>
          <CardHeader>
            <CardTitle>Calendar連携</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-[13px]">
            <p className="text-[var(--muted-foreground)]">
              Google連携後、以下のカレンダーへ自動登録します(Phase 2)。
            </p>
            <div className="flex flex-wrap gap-1.5">
              <Badge variant="neutral">三条支部_公式行事</Badge>
              <Badge variant="neutral">三条支部_準備締切</Badge>
              <Badge variant="neutral">三条支部_チームMTG</Badge>
              <Badge variant="neutral">三条支部_候補者フォロー</Badge>
            </div>
          </CardContent>
        </Card>

        {isManager && <FiscalYearManager years={years} />}
        {isManager && <UserRoleTable users={users} />}
      </div>
    </div>
  );
}
