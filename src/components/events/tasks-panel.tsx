"use client";

import { useTransition } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/format";
import { TASK_PRIORITY_LABEL, TASK_PRIORITY_VARIANT } from "@/lib/labels";
import { toggleTaskDone } from "@/app/(app)/events/[id]/actions";
import { cn } from "@/lib/utils";
import type { Member, Task } from "@prisma/client";

type TaskWithAssignee = Task & { assignedTo: Member | null };

export function TasksPanel({
  eventId,
  tasks,
  editable,
}: {
  eventId: string;
  tasks: TaskWithAssignee[];
  editable: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  if (tasks.length === 0) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-[13px] text-[var(--muted-foreground)]">
          この例会に紐づくタスクはまだありません。
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="divide-y divide-[var(--border)] p-0">
        {tasks.map((task) => {
          const done = task.status === "DONE";
          return (
            <div key={task.id} className="flex items-center gap-3 px-5 py-3">
              <button
                disabled={!editable || isPending}
                onClick={() =>
                  startTransition(() => toggleTaskDone(task.id, eventId, !done))
                }
                className={cn(
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 text-[10px] font-bold transition-colors",
                  done
                    ? "border-[var(--accent)] bg-[var(--accent)] text-white"
                    : "border-[var(--border)]",
                  editable && "cursor-pointer"
                )}
              >
                {done && "✓"}
              </button>
              <div className="min-w-0 flex-1">
                <p
                  className={cn(
                    "text-[13px] font-medium",
                    done && "text-[var(--muted-foreground)] line-through"
                  )}
                >
                  {task.title}
                </p>
                <p className="text-[11px] text-[var(--muted-foreground)]">
                  {task.assignedTo?.name ?? "担当未定"}
                  {task.dueDate && ` · 期限 ${formatDate(task.dueDate)}`}
                </p>
              </div>
              <Badge variant={TASK_PRIORITY_VARIANT[task.priority]} className="shrink-0">
                {TASK_PRIORITY_LABEL[task.priority]}
              </Badge>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
