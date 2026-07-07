import Link from "next/link";
import { requireBranchSession } from "@/lib/data/guard";
import { listFiscalYears, getOrgChart } from "@/lib/data/organization";
import { getBranchSettings } from "@/lib/branch-settings";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { YearSelect } from "@/components/organization/year-select";

const CATEGORY_ORDER = ["役員", "委員会・部会", "増強", "事務局"];

export default async function OrganizationPage({
  searchParams,
}: {
  searchParams: Promise<{ year?: string }>;
}) {
  const { year } = await searchParams;
  const { branchId } = await requireBranchSession();
  const [years, labels] = await Promise.all([
    listFiscalYears(branchId),
    getBranchSettings(branchId),
  ]);
  const selectedYear = year ? Number(year) : years.find((y) => y.isCurrent)?.year;
  const data = await getOrgChart(branchId, selectedYear);

  if (!data) {
    return (
      <div>
        <PageHeader title="組織図" />
        <p className="text-[13px] text-[var(--muted-foreground)]">年度データがありません。</p>
      </div>
    );
  }

  const categories = Object.keys(data.grouped).sort(
    (a, b) => CATEGORY_ORDER.indexOf(a) - CATEGORY_ORDER.indexOf(b)
  );

  return (
    <div>
      <PageHeader
        title="組織図"
        description={`今年度、${labels.branchName}にどんな役職の会員がいるかがわかります。`}
        actions={
          <YearSelect years={years.map((y) => y.year)} current={data.fiscalYear.year} />
        }
      />

      <div className="space-y-4">
        {categories.map((category) => (
          <Card key={category}>
            <CardHeader>
              <CardTitle>{category}</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {data.grouped[category].map((position) => (
                <Link
                  key={position.id}
                  href={`/members/${position.memberId}`}
                  className="flex items-center gap-3 rounded-xl border border-[var(--border)] px-3 py-2.5 transition-colors hover:bg-[var(--surface-muted)]"
                >
                  <Avatar className="h-9 w-9">
                    <AvatarFallback>{position.member.name.slice(0, 1)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-medium">{position.member.name}</p>
                    <p className="text-[11px] text-[var(--muted-foreground)]">
                      {position.member.companyName}
                    </p>
                  </div>
                  <Badge variant="default" className="shrink-0">
                    {position.title}
                  </Badge>
                </Link>
              ))}
            </CardContent>
          </Card>
        ))}

        <Card>
          <CardHeader>
            <CardTitle>チーム編成</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-3">
            {data.teams.map((team) => (
              <div key={team.id} className="rounded-xl border border-[var(--border)] p-4">
                <p className="text-[13px] font-semibold">{team.displayName}</p>
                {team.description && (
                  <p className="mt-1 text-[12px] text-[var(--muted-foreground)]">
                    {team.description}
                  </p>
                )}
                <div className="mt-3 space-y-1.5">
                  {team.memberships.map((m) => (
                    <Link
                      key={m.id}
                      href={`/members/${m.memberId}`}
                      className="flex items-center gap-2 text-[13px] hover:text-[var(--primary)]"
                    >
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-[10px]">
                          {m.member.name.slice(0, 1)}
                        </AvatarFallback>
                      </Avatar>
                      {m.member.name}
                      {m.isLeader && <Badge variant="neutral">リーダー</Badge>}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
