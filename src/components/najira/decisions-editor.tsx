"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CopyButton } from "@/components/copy-button";
import { saveNajiraDetail } from "@/app/(app)/najira/[id]/actions";
import type { NajiraDetail } from "@prisma/client";

export function DecisionsEditor({
  eventId,
  detail,
  editable,
}: {
  eventId: string;
  detail: NajiraDetail | null;
  editable: boolean;
}) {
  const [decisions, setDecisions] = useState(detail?.decisions ?? "");
  const [continuedTopics, setContinuedTopics] = useState(detail?.continuedTopics ?? "");
  const [homeworkForNext, setHomeworkForNext] = useState(detail?.homeworkForNext ?? "");
  const [guestFollowUp, setGuestFollowUp] = useState(detail?.guestFollowUp ?? "");
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  const shareText = `【なじら会 決定事項】
■決定事項
${decisions || "・"}
■継続協議
${continuedTopics || "・"}
■ゲストフォロー
${guestFollowUp || "・"}
■次回までの宿題
${homeworkForNext || "・"}`;

  function handleSave() {
    startTransition(async () => {
      await saveNajiraDetail(eventId, {
        decisions,
        continuedTopics,
        homeworkForNext,
        guestFollowUp,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>決定事項・継続協議・宿題</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Field
          label="決定事項"
          value={decisions}
          onChange={setDecisions}
          editable={editable}
        />
        <Field
          label="継続協議事項"
          value={continuedTopics}
          onChange={setContinuedTopics}
          editable={editable}
        />
        <Field
          label="ゲストフォロー"
          value={guestFollowUp}
          onChange={setGuestFollowUp}
          editable={editable}
        />
        <Field
          label="次回までの宿題"
          value={homeworkForNext}
          onChange={setHomeworkForNext}
          editable={editable}
        />

        <div className="flex items-center justify-end gap-2 pt-1">
          {editable && (
            <Button size="sm" onClick={handleSave} disabled={isPending}>
              {saved ? "保存しました" : "保存"}
            </Button>
          )}
          <CopyButton text={shareText} />
        </div>
      </CardContent>
    </Card>
  );
}

function Field({
  label,
  value,
  onChange,
  editable,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  editable: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {editable ? (
        <Textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} />
      ) : (
        <p className="whitespace-pre-wrap rounded-xl bg-[var(--surface-muted)] p-3 text-[13px]">
          {value || "未記入"}
        </p>
      )}
    </div>
  );
}
