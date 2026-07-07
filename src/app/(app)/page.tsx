import { requireBranchSession } from "@/lib/data/guard";
import { getDashboardData } from "@/lib/data/dashboard";
import { getBranchSettings } from "@/lib/branch-settings";
import { canEditOperations } from "@/lib/permissions";
import { PageHeader } from "@/components/layout/page-header";
import { NextEventCard } from "@/components/dashboard/next-event-card";
import { NextNajiraCard } from "@/components/dashboard/next-najira-card";
import { MonthSchedule } from "@/components/dashboard/month-schedule";
import { TeamsOverview } from "@/components/dashboard/teams-overview";
import { FilesFeed } from "@/components/dashboard/files-feed";
import { OfficerPanel } from "@/components/dashboard/officer-panel";

export default async function DashboardPage() {
  const { session, branchId } = await requireBranchSession();
  const [data, labels] = await Promise.all([
    getDashboardData(branchId),
    getBranchSettings(branchId),
  ]);
  const firstName = session.user.name?.split(" ")[0] ?? "";

  return (
    <div>
      <PageHeader
        title={`おかえりなさい、${firstName}さん`}
        description="支部の「今どうなってるか」がここでわかります。"
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <NextEventCard event={data.nextEvent} />
        <NextNajiraCard event={data.nextNajira} />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <MonthSchedule events={data.monthEvents} branchName={labels.branchName} />
        </div>
        <FilesFeed files={data.newFiles} />
      </div>

      <div className="mt-4">
        <TeamsOverview teams={data.teams} />
      </div>

      {canEditOperations(session.user.role) && (
        <div className="mt-8">
          <OfficerPanel data={data} />
        </div>
      )}
    </div>
  );
}
