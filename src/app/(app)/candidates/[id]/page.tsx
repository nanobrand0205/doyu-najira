import { notFound, redirect } from "next/navigation";
import { Mail, Phone, UserRound } from "lucide-react";
import { requireBranchSession } from "@/lib/data/guard";
import { prisma } from "@/lib/prisma";
import { getCandidateDetail } from "@/lib/data/candidates";
import { canEditOperations } from "@/lib/permissions";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/format";
import { CandidateStatusPanel } from "@/components/candidates/candidate-status-panel";
import { CandidateInfoEditor } from "@/components/candidates/candidate-info-editor";
import { CandidateEmailPanel } from "@/components/candidates/candidate-email-panel";

export default async function CandidateDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { session, branchId } = await requireBranchSession();
  if (!canEditOperations(session.user.role)) {
    redirect("/");
  }

  const candidate = await getCandidateDetail(id, branchId);
  if (!candidate) notFound();

  const nextEvent = await prisma.event.findFirst({
    where: { branchId, type: "REGULAR_MEETING", startAt: { gte: new Date() } },
    orderBy: { startAt: "asc" },
  });

  const editable = canEditOperations(session.user.role);

  return (
    <div>
      <PageHeader
        title={candidate.name}
        description={candidate.companyName ?? undefined}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>基本情報</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5 text-[13px]">
              {candidate.position && <p>{candidate.position}</p>}
              {candidate.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-[var(--muted-foreground)]" />
                  {candidate.email}
                </div>
              )}
              {candidate.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-[var(--muted-foreground)]" />
                  {candidate.phone}
                </div>
              )}
              {candidate.introducedBy && (
                <div className="flex items-center gap-2">
                  <UserRound className="h-3.5 w-3.5 text-[var(--muted-foreground)]" />
                  紹介者: {candidate.introducedBy.name}
                </div>
              )}
              <p className="text-[var(--muted-foreground)]">
                担当: {candidate.assignedTo?.name ?? "未定"}
              </p>
              {candidate.firstContactDate && (
                <p className="text-[var(--muted-foreground)]">
                  初回接点: {formatDate(candidate.firstContactDate)}
                </p>
              )}
              {candidate.interests && (
                <div>
                  <p className="mb-1 text-[11px] font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
                    興味関心・経営課題
                  </p>
                  <p className="whitespace-pre-wrap">{candidate.interests}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <CandidateInfoEditor
            candidateId={candidate.id}
            nextActionDate={candidate.nextActionDate}
            notes={candidate.notes}
            editable={editable}
          />
        </div>

        <div className="space-y-4 lg:col-span-2">
          <CandidateStatusPanel
            candidateId={candidate.id}
            status={candidate.status}
            editable={editable}
          />
          <CandidateEmailPanel
            candidate={candidate}
            nextEvent={nextEvent}
            emailLogs={candidate.emailLogs}
            editable={editable}
          />
        </div>
      </div>
    </div>
  );
}
