"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createCandidate } from "@/app/(app)/candidates/actions";

export function NewCandidateDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-4 w-4" />
          候補者を登録
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>入会候補者を登録</DialogTitle>
        </DialogHeader>
        <form
          action={async (formData) => {
            await createCandidate(formData);
            setOpen(false);
          }}
          className="space-y-4"
        >
          <div className="space-y-1.5">
            <Label htmlFor="name">氏名</Label>
            <Input id="name" name="name" required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="companyName">会社名</Label>
              <Input id="companyName" name="companyName" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="position">役職</Label>
              <Input id="position" name="position" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="email">メール</Label>
              <Input id="email" name="email" type="email" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone">電話</Label>
              <Input id="phone" name="phone" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="notes">備考</Label>
            <Textarea id="notes" name="notes" rows={3} />
          </div>
          <div className="flex justify-end">
            <Button type="submit">登録する</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
