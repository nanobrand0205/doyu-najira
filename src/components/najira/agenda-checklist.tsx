"use client";

import { useState, useTransition } from "react";
import { Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { addAgendaItem, toggleAgendaItem } from "@/app/(app)/najira/[id]/actions";
import type { NajiraAgendaItem } from "@prisma/client";

export function AgendaChecklist({
  eventId,
  items,
  editable,
}: {
  eventId: string;
  items: NajiraAgendaItem[];
  editable: boolean;
}) {
  const [newTitle, setNewTitle] = useState("");
  const [isPending, startTransition] = useTransition();

  return (
    <Card>
      <CardHeader>
        <CardTitle>次第</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1.5">
        {items.length === 0 ? (
          <p className="py-4 text-center text-[13px] text-[var(--muted-foreground)]">
            議題はまだ登録されていません。
          </p>
        ) : (
          items.map((item) => (
            <div key={item.id} className="flex items-center gap-3 rounded-xl px-2 py-2">
              <button
                disabled={!editable || isPending}
                onClick={() =>
                  startTransition(() => toggleAgendaItem(item.id, eventId, !item.isDone))
                }
                className={cn(
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 text-[10px] font-bold transition-colors",
                  item.isDone
                    ? "border-[var(--accent)] bg-[var(--accent)] text-white"
                    : "border-[var(--border)]",
                  editable && "cursor-pointer"
                )}
              >
                {item.isDone && "✓"}
              </button>
              <span
                className={cn(
                  "text-[13px]",
                  item.isDone && "text-[var(--muted-foreground)] line-through"
                )}
              >
                {item.title}
              </span>
            </div>
          ))
        )}

        {editable && (
          <form
            className="flex gap-2 pt-2"
            action={() => {
              if (!newTitle.trim()) return;
              startTransition(() => addAgendaItem(eventId, newTitle));
              setNewTitle("");
            }}
          >
            <Input
              placeholder="議題を追加"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <Button type="submit" size="icon" variant="secondary" disabled={isPending}>
              <Plus className="h-4 w-4" />
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
