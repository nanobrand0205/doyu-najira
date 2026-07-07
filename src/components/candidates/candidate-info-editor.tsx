"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { updateCandidateNotes, updateNextActionDate } from "@/app/(app)/candidates/actions";

export function CandidateInfoEditor({
  candidateId,
  nextActionDate,
  notes,
  editable,
}: {
  candidateId: string;
  nextActionDate: Date | null;
  notes: string | null;
  editable: boolean;
}) {
  const [date, setDate] = useState(
    nextActionDate ? nextActionDate.toISOString().slice(0, 10) : ""
  );
  const [notesValue, setNotesValue] = useState(notes ?? "");
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  function handleSave() {
    startTransition(async () => {
      await Promise.all([
        updateNextActionDate(candidateId, date),
        updateCandidateNotes(candidateId, notesValue),
      ]);
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>フォローメモ</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="nextActionDate">次回連絡日</Label>
          {editable ? (
            <Input
              id="nextActionDate"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          ) : (
            <p className="text-[13px]">{date || "未設定"}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="notes">備考</Label>
          {editable ? (
            <Textarea
              id="notes"
              value={notesValue}
              onChange={(e) => setNotesValue(e.target.value)}
              rows={5}
            />
          ) : (
            <p className="whitespace-pre-wrap text-[13px]">{notesValue || "未記入"}</p>
          )}
        </div>
        {editable && (
          <div className="flex justify-end">
            <Button size="sm" onClick={handleSave} disabled={isPending}>
              {saved ? "保存しました" : "保存"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
