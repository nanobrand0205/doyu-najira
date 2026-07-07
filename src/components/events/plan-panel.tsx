"use client";

import { useState } from "react";
import { FileText, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlanStatusStepper } from "./plan-status-stepper";
import { PLAN_STATUS_LABEL, PLAN_STATUS_VARIANT } from "@/lib/labels";
import { formatDate } from "@/lib/format";
import { updatePlanStatus } from "@/app/(app)/events/[id]/actions";
import type { Plan, PlanStatus } from "@prisma/client";

export function PlanPanel({
  eventId,
  plans,
  editable,
}: {
  eventId: string;
  plans: Plan[];
  editable: boolean;
}) {
  const [latest, ...history] = plans;
  const [status, setStatus] = useState<PlanStatus | null>(latest?.status ?? null);

  if (!latest) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-[13px] text-[var(--muted-foreground)]">
          まだ企画書が登録されていません。
        </CardContent>
      </Card>
    );
  }

  async function handleChange(next: PlanStatus) {
    setStatus(next);
    await updatePlanStatus(eventId, latest.id, next);
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <CardTitle>{latest.title}(v{latest.version})</CardTitle>
            <Badge variant={PLAN_STATUS_VARIANT[status ?? latest.status]}>
              {PLAN_STATUS_LABEL[status ?? latest.status]}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <PlanStatusStepper
            current={status ?? latest.status}
            editable={editable}
            onChange={handleChange}
          />
          {latest.fileUrl && (
            <a
              href={latest.fileUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[var(--accent)]"
            >
              <FileText className="h-4 w-4" />
              企画書ファイルを開く
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
          {latest.comments && (
            <div className="rounded-xl bg-[var(--surface-muted)] p-3 text-[13px]">
              <p className="mb-1 text-[11px] font-medium text-[var(--muted-foreground)]">
                コメント
              </p>
              {latest.comments}
            </div>
          )}
          {latest.approvalNotes && (
            <div className="rounded-xl bg-[var(--success)]/10 p-3 text-[13px]">
              <p className="mb-1 text-[11px] font-medium text-[var(--muted-foreground)]">
                承認メモ
              </p>
              {latest.approvalNotes}
            </div>
          )}
        </CardContent>
      </Card>

      {history.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-[13px] text-[var(--muted-foreground)]">
              旧版履歴
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {history.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between rounded-xl border border-[var(--border)] px-3 py-2"
              >
                <div>
                  <p className="text-[13px] font-medium">{p.title} (v{p.version})</p>
                  <p className="text-[11px] text-[var(--muted-foreground)]">
                    {formatDate(p.createdAt)}
                  </p>
                </div>
                <Badge variant="neutral">{PLAN_STATUS_LABEL[p.status]}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
