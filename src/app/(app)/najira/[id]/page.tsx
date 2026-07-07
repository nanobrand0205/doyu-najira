import { notFound } from "next/navigation";
import { MapPin } from "lucide-react";
import { auth } from "@/lib/auth";
import { getNajiraDetail } from "@/lib/data/najira";
import { canEditOperations } from "@/lib/permissions";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton } from "@/components/copy-button";
import { formatDate, formatTimeRange } from "@/lib/format";
import { najiraLineTemplate } from "@/lib/templates";
import { AgendaChecklist } from "@/components/najira/agenda-checklist";
import { DecisionsEditor } from "@/components/najira/decisions-editor";
import { PlansUpPanel } from "@/components/najira/plans-up-panel";
import { FilesPanel } from "@/components/events/files-panel";

export default async function NajiraDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [session, data] = await Promise.all([auth(), getNajiraDetail(id)]);
  if (!data) notFound();

  const { event, detail, plansUpForDiscussion, nextNajira } = data;
  const editable = canEditOperations(session?.user.role);
  const lineText = najiraLineTemplate(
    event,
    event.agendaItems.map((a) => a.title)
  );

  return (
    <div>
      <PageHeader
        title={event.title}
        description={formatTimeRange(event.startAt, event.endAt)}
        actions={
          <Badge variant={event.status === "COMPLETED" ? "success" : "default"}>
            {event.status === "COMPLETED" ? "実施済み" : "予定"}
          </Badge>
        }
      />

      {event.venue && (
        <div className="mb-4 flex items-center gap-1.5 text-[13px] text-[var(--muted-foreground)]">
          <MapPin className="h-3.5 w-3.5" />
          {event.venue}
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <AgendaChecklist eventId={event.id} items={event.agendaItems} editable={editable} />
          <DecisionsEditor eventId={event.id} detail={detail} editable={editable} />
          <FilesPanel files={event.files} />
        </div>

        <div className="space-y-4">
          <PlansUpPanel plans={plansUpForDiscussion} />

          {nextNajira && (
            <Card>
              <CardHeader>
                <CardTitle>次回なじら会</CardTitle>
              </CardHeader>
              <CardContent className="text-[13px]">
                <p className="font-medium">{formatDate(nextNajira.startAt, "yyyy年M月d日(E)")}</p>
                <p className="mt-1 text-[var(--muted-foreground)]">
                  {nextNajira.venue ?? "会場未定"}
                </p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>LINE共有文</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea readOnly value={lineText} rows={8} />
              <div className="mt-2 flex justify-end">
                <CopyButton text={lineText} />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
