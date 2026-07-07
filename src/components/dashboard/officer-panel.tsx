import Link from "next/link";
import { AlertTriangle, Clock, FileWarning, MessageSquareText, UserRoundSearch } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate, relativeDayLabel } from "@/lib/format";
import { PLAN_STATUS_LABEL, PLAN_STATUS_VARIANT } from "@/lib/labels";
import type { DashboardData } from "@/lib/data/dashboard";

export function OfficerPanel({ data }: { data: DashboardData }) {
  const {
    plansNeedingAttention,
    unsubmittedUpcoming,
    lineDraftsPending,
    candidatesToFollow,
    overdueTasks,
    todayTasks,
  } = data;

  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <h2 className="text-[15px] font-semibold tracking-tight">幹事アクション</h2>
        <Badge variant="warning">幹事以上に表示</Badge>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileWarning className="h-4 w-4 text-[var(--warning)]" />
              なじら会 協議・上程中の計画書
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {plansNeedingAttention.length === 0 ? (
              <EmptyRow text="協議中の計画書はありません" />
            ) : (
              plansNeedingAttention.map((plan) => (
                <Link
                  key={plan.id}
                  href={`/events/${plan.eventId}`}
                  className="flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-[var(--surface-muted)]"
                >
                  <span className="min-w-0 flex-1 truncate text-[13px] font-medium">
                    {plan.event.title}
                  </span>
                  <Badge variant={PLAN_STATUS_VARIANT[plan.status]}>
                    {PLAN_STATUS_LABEL[plan.status]}
                  </Badge>
                </Link>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-[var(--danger)]" />
              企画書 未提出の例会
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {unsubmittedUpcoming.length === 0 ? (
              <EmptyRow text="未提出の例会企画書はありません" />
            ) : (
              unsubmittedUpcoming.map((event) => (
                <Link
                  key={event.id}
                  href={`/events/${event.id}`}
                  className="flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-[var(--surface-muted)]"
                >
                  <span className="min-w-0 flex-1 truncate text-[13px] font-medium">
                    {event.title}
                  </span>
                  <Badge variant="danger">{formatDate(event.startAt)}</Badge>
                </Link>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquareText className="h-4 w-4 text-[var(--accent)]" />
              LINE投稿予定
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {lineDraftsPending.length === 0 ? (
              <EmptyRow text="投稿予定のLINE文はありません" />
            ) : (
              lineDraftsPending.map((post) => (
                <div
                  key={post.id}
                  className="flex items-center justify-between gap-3 rounded-xl px-3 py-2.5"
                >
                  <span className="min-w-0 flex-1 truncate text-[13px] font-medium">
                    {post.title}
                  </span>
                  <Badge variant={post.status === "SCHEDULED" ? "default" : "neutral"}>
                    {post.status === "SCHEDULED" ? "投稿予定" : "下書き"}
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserRoundSearch className="h-4 w-4 text-[var(--accent)]" />
              候補者フォロー予定
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {candidatesToFollow.length === 0 ? (
              <EmptyRow text="今週フォロー予定の候補者はいません" />
            ) : (
              candidatesToFollow.map((c) => (
                <Link
                  key={c.id}
                  href="/candidates"
                  className="flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-[var(--surface-muted)]"
                >
                  <span className="min-w-0 flex-1 truncate text-[13px] font-medium">
                    {c.name}
                    {c.companyName ? `（${c.companyName}）` : ""}
                  </span>
                  {c.nextActionDate && (
                    <Badge variant="warning">{relativeDayLabel(c.nextActionDate)}</Badge>
                  )}
                </Link>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-[var(--danger)]" />
              今日やること / 期限切れタスク
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
                今日
              </p>
              {todayTasks.length === 0 ? (
                <EmptyRow text="今日期限のタスクはありません" />
              ) : (
                <ul className="space-y-1.5">
                  {todayTasks.map((t) => (
                    <li key={t.id} className="rounded-xl px-3 py-2 text-[13px]">
                      {t.title}
                      {t.assignedTo && (
                        <span className="ml-1.5 text-[11px] text-[var(--muted-foreground)]">
                          @{t.assignedTo.name}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-[var(--muted-foreground)]">
                期限切れ
              </p>
              {overdueTasks.length === 0 ? (
                <EmptyRow text="期限切れのタスクはありません" />
              ) : (
                <ul className="space-y-1.5">
                  {overdueTasks.map((t) => (
                    <li
                      key={t.id}
                      className="flex items-center justify-between rounded-xl bg-[var(--danger)]/10 px-3 py-2 text-[13px]"
                    >
                      <span>{t.title}</span>
                      <Badge variant="danger">{t.dueDate && formatDate(t.dueDate)}</Badge>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function EmptyRow({ text }: { text: string }) {
  return <p className="px-3 py-2 text-[13px] text-[var(--muted-foreground)]">{text}</p>;
}
