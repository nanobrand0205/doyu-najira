import { notFound } from "next/navigation";
import Link from "next/link";
import { ExternalLink, MapPin, Users, Mic2, FolderOpen } from "lucide-react";
import { auth } from "@/lib/auth";
import { getEventDetail } from "@/lib/data/events";
import { canEditOperations } from "@/lib/permissions";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatTimeRange } from "@/lib/format";
import { EVENT_STATUS_LABEL } from "@/lib/labels";
import { PlanPanel } from "@/components/events/plan-panel";
import { FilesPanel } from "@/components/events/files-panel";
import { TasksPanel } from "@/components/events/tasks-panel";
import { LineGmailPanel } from "@/components/events/line-gmail-panel";

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [session, event] = await Promise.all([auth(), getEventDetail(id)]);
  if (!event) notFound();

  const editable = canEditOperations(session?.user.role);

  return (
    <div>
      <PageHeader
        title={event.title}
        description={formatTimeRange(event.startAt, event.endAt)}
        actions={
          <Badge variant={event.status === "COMPLETED" ? "success" : "default"}>
            {EVENT_STATUS_LABEL[event.status]}
          </Badge>
        }
      />

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">概要</TabsTrigger>
          <TabsTrigger value="plan">計画書</TabsTrigger>
          <TabsTrigger value="files">資料</TabsTrigger>
          <TabsTrigger value="tasks">タスク</TabsTrigger>
          <TabsTrigger value="comms">LINE・メール文</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>概要</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-[13px]">
                <InfoRow icon={MapPin} label="会場" value={event.venue} />
                <InfoRow icon={MapPin} label="懇親会会場" value={event.socialVenue} />
                <InfoRow icon={Mic2} label="報告者" value={event.speakerName} />
                <InfoRow
                  icon={Users}
                  label="座長 / 室長"
                  value={
                    [event.chairMember?.name, event.roomLeaderMember?.name]
                      .filter(Boolean)
                      .join(" / ") || null
                  }
                />
                <InfoRow icon={FolderOpen} label="対象者" value={event.targetAudience} />
                <Divider />
                <TextBlock label="目的" value={event.purpose} />
                <TextBlock label="テーマ" value={event.theme} />
                <TextBlock label="報告概要" value={event.description} />
                <TextBlock label="グループ討論テーマ" value={event.discussionTheme} />
                <TextBlock label="ゲスト誘致方針" value={event.guestStrategy} />
                <TextBlock label="備考" value={event.notes} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>リンク</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-[13px]">
                {event.edoyuUrl ? (
                  <LinkRow label="e-doyu" href={event.edoyuUrl} />
                ) : (
                  <p className="text-[var(--muted-foreground)]">e-doyu URL未登録</p>
                )}
                {event.driveFolderUrl ? (
                  <LinkRow label="Google Driveフォルダ" href={event.driveFolderUrl} />
                ) : (
                  <p className="text-[var(--muted-foreground)]">
                    Google Driveフォルダ未登録
                  </p>
                )}
                {event.team && (
                  <div className="pt-2">
                    <Badge variant="neutral">担当チーム: {event.team.displayName}</Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="plan">
          <PlanPanel eventId={event.id} plans={event.plans} editable={editable} />
        </TabsContent>

        <TabsContent value="files">
          <FilesPanel files={event.files} />
        </TabsContent>

        <TabsContent value="tasks">
          <TasksPanel eventId={event.id} tasks={event.tasks} editable={editable} />
        </TabsContent>

        <TabsContent value="comms">
          <LineGmailPanel event={event} linePosts={event.linePosts} editable={editable} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value?: string | null;
}) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-2.5">
      <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--muted-foreground)]" />
      <div>
        <p className="text-[11px] text-[var(--muted-foreground)]">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  );
}

function TextBlock({ label, value }: { label: string; value?: string | null }) {
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

function Divider() {
  return <div className="h-px bg-[var(--border)]" />;
}

function LinkRow({ label, href }: { label: string; href: string }) {
  return (
    <Link
      href={href}
      target="_blank"
      className="flex items-center justify-between rounded-xl border border-[var(--border)] px-3 py-2 transition-colors hover:bg-[var(--surface-muted)]"
    >
      {label}
      <ExternalLink className="h-3.5 w-3.5 text-[var(--muted-foreground)]" />
    </Link>
  );
}
