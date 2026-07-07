"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CopyButton } from "@/components/copy-button";
import { formatDateTime } from "@/lib/format";
import { LINE_POST_STATUS_LABEL } from "@/lib/labels";
import {
  lineInvitationTemplate,
  lineReminderTemplate,
  lineThanksTemplate,
  gmailInvitationTemplate,
  gmailThanksTemplate,
} from "@/lib/templates";
import { markLinePostPosted, saveLinePostDraft } from "@/app/(app)/events/[id]/actions";
import type { Event, LinePost } from "@prisma/client";

export function LineGmailPanel({
  event,
  linePosts,
  editable,
}: {
  event: Event;
  linePosts: LinePost[];
  editable: boolean;
}) {
  const [invitation, setInvitation] = useState(lineInvitationTemplate(event));
  const [reminder, setReminder] = useState(lineReminderTemplate(event));
  const [thanks, setThanks] = useState(lineThanksTemplate(event));
  const gmailInvite = gmailInvitationTemplate(event, "○○");
  const gmailThanks = gmailThanksTemplate(event, "○○");
  const [isPending, startTransition] = useTransition();

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>LINE投稿文</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="invitation">
            <TabsList>
              <TabsTrigger value="invitation">案内</TabsTrigger>
              <TabsTrigger value="reminder">前日リマインド</TabsTrigger>
              <TabsTrigger value="thanks">お礼</TabsTrigger>
            </TabsList>
            <TabsContent value="invitation">
              <TemplateEditor
                value={invitation}
                onChange={setInvitation}
                onSaveDraft={() =>
                  editable &&
                  startTransition(() =>
                    saveLinePostDraft(event.id, `${event.title} 一次案内`, invitation)
                  )
                }
                editable={editable}
                pending={isPending}
              />
            </TabsContent>
            <TabsContent value="reminder">
              <TemplateEditor
                value={reminder}
                onChange={setReminder}
                onSaveDraft={() =>
                  editable &&
                  startTransition(() =>
                    saveLinePostDraft(event.id, `${event.title} 前日リマインド`, reminder)
                  )
                }
                editable={editable}
                pending={isPending}
              />
            </TabsContent>
            <TabsContent value="thanks">
              <TemplateEditor
                value={thanks}
                onChange={setThanks}
                onSaveDraft={() =>
                  editable &&
                  startTransition(() =>
                    saveLinePostDraft(event.id, `${event.title} お礼`, thanks)
                  )
                }
                editable={editable}
                pending={isPending}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Gmail下書き(候補者案内用)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="mb-1 text-[12px] font-medium text-[var(--muted-foreground)]">
              件名: {gmailInvite.subject}
            </p>
            <Textarea readOnly value={gmailInvite.body} rows={9} />
            <div className="mt-2 flex justify-end">
              <CopyButton text={`件名: ${gmailInvite.subject}\n\n${gmailInvite.body}`} />
            </div>
          </div>
          <div>
            <p className="mb-1 text-[12px] font-medium text-[var(--muted-foreground)]">
              件名: {gmailThanks.subject}
            </p>
            <Textarea readOnly value={gmailThanks.body} rows={6} />
            <div className="mt-2 flex justify-end">
              <CopyButton text={`件名: ${gmailThanks.subject}\n\n${gmailThanks.body}`} />
            </div>
          </div>
          <p className="text-[11px] text-[var(--muted-foreground)]">
            実際の送信はGmail連携(設定画面)を有効にすると候補者管理から行えます。
          </p>
        </CardContent>
      </Card>

      {linePosts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-[13px] text-[var(--muted-foreground)]">
              投稿履歴
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {linePosts.map((post) => (
              <div
                key={post.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-[var(--border)] px-3 py-2.5"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-medium">{post.title}</p>
                  <p className="text-[11px] text-[var(--muted-foreground)]">
                    {post.postedAt
                      ? `投稿: ${formatDateTime(post.postedAt)}`
                      : "未投稿"}
                  </p>
                </div>
                <Badge variant={post.status === "POSTED" ? "success" : "neutral"}>
                  {LINE_POST_STATUS_LABEL[post.status]}
                </Badge>
                {editable && post.status !== "POSTED" && (
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={isPending}
                    onClick={() =>
                      startTransition(() => markLinePostPosted(post.id, event.id))
                    }
                  >
                    投稿済みにする
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function TemplateEditor({
  value,
  onChange,
  onSaveDraft,
  editable,
  pending,
}: {
  value: string;
  onChange: (v: string) => void;
  onSaveDraft: () => void;
  editable: boolean;
  pending: boolean;
}) {
  return (
    <div>
      <Textarea value={value} onChange={(e) => onChange(e.target.value)} rows={9} />
      <div className="mt-2 flex justify-end gap-2">
        {editable && (
          <Button variant="secondary" size="sm" onClick={onSaveDraft} disabled={pending}>
            下書きとして保存
          </Button>
        )}
        <CopyButton text={value} />
      </div>
    </div>
  );
}
