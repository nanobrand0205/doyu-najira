"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FILE_TYPE_LABEL } from "@/lib/labels";
import { registerFile } from "@/app/(app)/files/actions";

export function FileRegisterDialog({
  events,
}: {
  events: { id: string; title: string }[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-4 w-4" />
          資料を登録
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Google Driveの資料を登録</DialogTitle>
          <DialogDescription>
            LINEで送られた資料はGoogle Driveに保存し、共有リンクをここに登録してください。
          </DialogDescription>
        </DialogHeader>
        <form
          action={async (formData) => {
            await registerFile(formData);
            setOpen(false);
          }}
          className="space-y-4"
        >
          <div className="space-y-1.5">
            <Label htmlFor="title">タイトル</Label>
            <Input id="title" name="title" placeholder="例:7月例会チラシ_最新版.pdf" required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="type">種別</Label>
            <select
              id="type"
              name="type"
              className="flex h-10 w-full rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 text-[13px]"
              defaultValue="OTHER"
            >
              {Object.entries(FILE_TYPE_LABEL).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="driveUrl">Google Drive 共有URL</Label>
            <Input
              id="driveUrl"
              name="driveUrl"
              placeholder="https://drive.google.com/..."
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="relatedEventId">関連する例会・なじら会(任意)</Label>
            <select
              id="relatedEventId"
              name="relatedEventId"
              className="flex h-10 w-full rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 text-[13px]"
              defaultValue=""
            >
              <option value="">なし</option>
              {events.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.title}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end pt-2">
            <Button type="submit">登録する</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
