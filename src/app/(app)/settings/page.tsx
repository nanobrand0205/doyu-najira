import { redirect } from "next/navigation";
import { requireBranchSession } from "@/lib/data/guard";
import { prisma } from "@/lib/prisma";
import { canEditOperations, canManageSensitive } from "@/lib/permissions";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GoogleConnectionCard } from "@/components/settings/google-connection-card";
import { UserRoleTable } from "@/components/settings/user-role-table";
import { FiscalYearManager } from "@/components/settings/fiscal-year-manager";
import { MemberRegistry } from "@/components/settings/member-registry";

export default async function SettingsPage() {
  const { session, branchId } = await requireBranchSession();
  if (!canEditOperations(session.user.role)) {
    redirect("/");
  }

  const isManager = canManageSensitive(session.user.role);
  const [googleIntegration, branchSettings, years, users, members] = await Promise.all([
    prisma.googleIntegration.findUnique({ where: { branchId } }),
    prisma.branchSettings.findUnique({ where: { branchId } }),
    isManager
      ? prisma.fiscalYear.findMany({ where: { branchId }, orderBy: { year: "desc" } })
      : Promise.resolve([]),
    isManager
      ? prisma.user.findMany({ where: { branchId }, orderBy: { createdAt: "asc" } })
      : Promise.resolve([]),
    isManager
      ? prisma.member.findMany({
          where: { branchId },
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            name: true,
            companyName: true,
            companyPosition: true,
            user: { select: { id: true } },
          },
        })
      : Promise.resolve([]),
  ]);
  const branchName = branchSettings?.branchName ?? "支部";

  return (
    <div>
      <PageHeader title="設定" description="Google連携、年度、権限を管理します。" />

      <div className="grid gap-4 lg:grid-cols-2">
        <GoogleConnectionCard
          connected={googleIntegration?.status === "CONNECTED"}
          connectedEmail={googleIntegration?.connectedEmail}
        />

        <Card>
          <CardHeader>
            <CardTitle>Calendar連携</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-[13px]">
            <p className="text-[var(--muted-foreground)]">
              Google連携後、以下のカレンダーへ自動登録します(Phase 2)。
            </p>
            <div className="flex flex-wrap gap-1.5">
              <Badge variant="neutral">{branchName}_公式行事</Badge>
              <Badge variant="neutral">{branchName}_準備締切</Badge>
              <Badge variant="neutral">{branchName}_チームMTG</Badge>
              <Badge variant="neutral">{branchName}_候補者フォロー</Badge>
            </div>
          </CardContent>
        </Card>

        {isManager && <FiscalYearManager years={years} />}
        {isManager && <UserRoleTable users={users} />}
        {isManager && <MemberRegistry members={members} />}
      </div>
    </div>
  );
}
