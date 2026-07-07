"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CopyButton } from "@/components/copy-button";
import { formatDateTime } from "@/lib/format";
import { EMAIL_STATUS_LABEL } from "@/lib/labels";
import { gmailInvitationTemplate, gmailThanksTemplate } from "@/lib/templates";
import { markEmailSent, saveEmailDraft } from "@/app/(app)/candidates/actions";
import type { Candidate, EmailLog, Event } from "@prisma/client";

export function CandidateEmailPanel({
  candidate,
  nextEvent,
  emailLogs,
  editable,
}: {
  candidate: Candidate;
  nextEvent: Event | null;
  emailLogs: EmailLog[];
  editable: boolean;
}) {
  const invite = nextEvent ? gmailInvitationTemplate(nextEvent, candidate.name) : null;
  const thanks = nextEvent ? gmailThanksTemplate(nextEvent, candidate.name) : null;
  const [inviteBody, setInviteBody] = useState(invite?.body ?? "");
  const [thanksBody, setThanksBody] = useState(thanks?.body ?? "");
  const [isPending, startTransition] = useTransition();

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Gmail下書き</CardTitle>
        </CardHeader>
        <CardContent>
          {!nextEvent ? (
            <p className="text-[13px] text-[var(--muted-foreground)]">
              案内できる次回例会がまだ登録されていません。
            </p>
          ) : (
            <Tabs defaultValue="invite">
              <TabsList>
                <TabsTrigger value="invite">案内</TabsTrigger>
                <TabsTrigger value="thanks">お礼</TabsTrigger>
              </TabsList>
              <TabsContent value="invite">
                <p className="mb-1 text-[12px] font-medium text-[var(--muted-foreground)]">
                  件名: {invite!.subject}
                </p>
                <Textarea
                  value={inviteBody}
                  onChange={(e) => setInviteBody(e.target.value)}
                  rows={9}
                />
                <div className="mt-2 flex justify-end gap-2">
                  {editable && (
                    <Button
                      size="sm"
                      variant="secondary"
                      disabled={isPending}
                      onClick={() =>
                        startTransition(() =>
                          saveEmailDraft(candidate.id, invite!.subject, inviteBody)
                        )
                      }
                    >
                      下書きとして保存
                    </Button>
                  )}
                  <CopyButton text={`件名: ${invite!.subject}\n\n${inviteBody}`} />
                </div>
              </TabsContent>
              <TabsContent value="thanks">
                <p className="mb-1 text-[12px] font-medium text-[var(--muted-foreground)]">
                  件名: {thanks!.subject}
                </p>
                <Textarea
                  value={thanksBody}
                  onChange={(e) => setThanksBody(e.target.value)}
                  rows={6}
                />
                <div className="mt-2 flex justify-end gap-2">
                  {editable && (
                    <Button
                      size="sm"
                      variant="secondary"
                      disabled={isPending}
                      onClick={() =>
                        startTransition(() =>
                          saveEmailDraft(candidate.id, thanks!.subject, thanksBody)
                        )
                      }
                    >
                      下書きとして保存
                    </Button>
                  )}
                  <CopyButton text={`件名: ${thanks!.subject}\n\n${thanksBody}`} />
                </div>
              </TabsContent>
            </Tabs>
          )}
          <p className="mt-3 text-[11px] text-[var(--muted-foreground)]">
            実際の送信は設定画面でGmail連携を有効にすると行えます。それまではコピーしてGmailに貼り付けてください。
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-[13px] text-[var(--muted-foreground)]">
            メール送信履歴
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {emailLogs.length === 0 ? (
            <p className="text-[13px] text-[var(--muted-foreground)]">まだ送信履歴はありません。</p>
          ) : (
            emailLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-[var(--border)] px-3 py-2.5"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-medium">{log.subject}</p>
                  <p className="text-[11px] text-[var(--muted-foreground)]">
                    {log.sentAt ? `送信: ${formatDateTime(log.sentAt)}` : "未送信"}
                  </p>
                </div>
                <Badge variant={log.status === "SENT" ? "success" : "neutral"}>
                  {EMAIL_STATUS_LABEL[log.status]}
                </Badge>
                {editable && log.status === "DRAFT" && (
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={isPending}
                    onClick={() => startTransition(() => markEmailSent(log.id, candidate.id))}
                  >
                    送信済みにする
                  </Button>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
