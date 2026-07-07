import { notFound } from "next/navigation";
import Link from "next/link";
import { Building2, Globe, MapPin } from "lucide-react";
import { getMemberDetail } from "@/lib/data/members";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default async function MemberDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const member = await getMemberDetail(id);
  if (!member) notFound();

  const currentTeam = member.teamMemberships.find((tm) => tm.team.fiscalYear.isCurrent);
  const currentPositions = member.orgPositions.filter((p) => p.fiscalYear.isCurrent);
  const pastPositions = member.orgPositions.filter((p) => !p.fiscalYear.isCurrent);

  return (
    <div>
      <PageHeader title="会員カルテ" />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardContent className="flex flex-col items-center pt-6 text-center">
            <Avatar className="h-24 w-24">
              <AvatarImage src={member.photoUrl ?? undefined} />
              <AvatarFallback className="text-[28px]">
                {member.name.slice(0, 1)}
              </AvatarFallback>
            </Avatar>
            <p className="mt-4 text-[18px] font-semibold tracking-tight">{member.name}</p>
            <p className="text-[13px] text-[var(--muted-foreground)]">
              {member.companyName} {member.companyPosition}
            </p>

            <div className="mt-4 flex flex-wrap justify-center gap-1.5">
              {currentPositions.map((p) => (
                <Badge key={p.id} variant="default">
                  {p.title}
                </Badge>
              ))}
              {currentTeam && <Badge variant="neutral">{currentTeam.team.displayName}</Badge>}
              {member.reportExperience && <Badge variant="success">報告経験あり</Badge>}
            </div>

            {member.profileText && (
              <p className="mt-4 whitespace-pre-wrap text-[13px] leading-relaxed text-[var(--muted-foreground)]">
                {member.profileText}
              </p>
            )}

            <div className="mt-5 w-full space-y-2 border-t border-[var(--border)] pt-4 text-left text-[13px]">
              {member.industry && (
                <div className="flex items-center gap-2">
                  <Building2 className="h-3.5 w-3.5 text-[var(--muted-foreground)]" />
                  {member.industry}
                </div>
              )}
              {member.companyAddress && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-[var(--muted-foreground)]" />
                  {member.companyAddress}
                </div>
              )}
              {member.companyWebsite && (
                <Link
                  href={member.companyWebsite}
                  target="_blank"
                  className="flex items-center gap-2 text-[var(--accent)]"
                >
                  <Globe className="h-3.5 w-3.5" />
                  会社サイト
                </Link>
              )}
              {member.joinedYear && (
                <p className="text-[var(--muted-foreground)]">{member.joinedYear}年入会</p>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>会社について</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-[13px]">
              <TextField label="会社概要" value={member.companyDescription} />
              <TextField label="主な商品・サービス" value={member.mainServices} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>この人に相談できること</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-[13px]">
              <TextField label="得意分野" value={member.strengths} />
              <TextField label="相談できること" value={member.consultable} />
              <TextField label="紹介してほしい案件" value={member.wantedIntroduction} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>同友会での学び</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-[13px]">
              <TextField label="同友会で学びたいこと" value={member.learningGoal} />
              <TextField label="今の経営課題" value={member.currentChallenge} />
              <TextField label="趣味・話しかけやすい話題" value={member.hobby} />
            </CardContent>
          </Card>

          {pastPositions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-[13px] text-[var(--muted-foreground)]">
                  過去の役職
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {pastPositions.map((p) => (
                  <Badge key={p.id} variant="neutral">
                    {p.fiscalYear.year}年度 {p.title}
                  </Badge>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function TextField({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div>
      <p className="mb-1 text-[11px] font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
        {label}
      </p>
      <p className="whitespace-pre-wrap leading-relaxed">{value}</p>
    </div>
  );
}
