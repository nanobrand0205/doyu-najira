"use client";

import { useTransition } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { CANDIDATE_STATUS_LABEL, CANDIDATE_STATUS_ORDER } from "@/lib/labels";
import type { CandidateStatus } from "@prisma/client";

const MAIN_FLOW: CandidateStatus[] = CANDIDATE_STATUS_ORDER.filter(
  (s) => s !== "HOLD" && s !== "DECLINED"
);

export function CandidateStatusStepper({
  current,
  editable,
  onChange,
}: {
  current: CandidateStatus;
  editable: boolean;
  onChange?: (status: CandidateStatus) => Promise<void>;
}) {
  const [isPending, startTransition] = useTransition();
  const currentIndex = MAIN_FLOW.indexOf(current);

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {MAIN_FLOW.map((status, index) => {
          const done = index < currentIndex;
          const active = index === currentIndex;
          return (
            <button
              key={status}
              disabled={!editable || isPending}
              onClick={() => onChange && startTransition(() => onChange(status))}
              className={cn(
                "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] font-medium transition-colors",
                active
                  ? "border-transparent bg-[var(--primary)] text-[var(--primary-foreground)]"
                  : done
                    ? "border-transparent bg-[var(--accent-soft)] text-[var(--primary)]"
                    : "border-[var(--border)] text-[var(--muted-foreground)]",
                editable && !isPending && "cursor-pointer hover:opacity-80"
              )}
            >
              {done && <Check className="h-3 w-3" />}
              {CANDIDATE_STATUS_LABEL[status]}
            </button>
          );
        })}
      </div>
      {editable && (
        <div className="flex gap-2">
          {(["HOLD", "DECLINED"] as CandidateStatus[]).map((status) => (
            <button
              key={status}
              disabled={isPending}
              onClick={() => onChange && startTransition(() => onChange(status))}
              className={cn(
                "rounded-full border px-3 py-1 text-[11px] font-medium transition-colors",
                current === status
                  ? "border-transparent bg-[var(--danger)]/15 text-[var(--danger)]"
                  : "border-[var(--border)] text-[var(--muted-foreground)] hover:bg-[var(--surface-muted)]"
              )}
            >
              {CANDIDATE_STATUS_LABEL[status]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
