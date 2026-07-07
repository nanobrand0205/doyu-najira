"use client";

import { useTransition } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { PLAN_STATUS_LABEL, PLAN_STATUS_ORDER } from "@/lib/labels";
import type { PlanStatus } from "@prisma/client";

export function PlanStatusStepper({
  current,
  editable,
  onChange,
}: {
  current: PlanStatus;
  editable: boolean;
  onChange?: (status: PlanStatus) => Promise<void>;
}) {
  const [isPending, startTransition] = useTransition();
  const currentIndex = PLAN_STATUS_ORDER.indexOf(current);

  return (
    <div className="flex flex-wrap gap-2">
      {PLAN_STATUS_ORDER.map((status, index) => {
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
              editable && !isPending && "cursor-pointer hover:opacity-80",
              (!editable || isPending) && "cursor-default"
            )}
          >
            {done && <Check className="h-3 w-3" />}
            {PLAN_STATUS_LABEL[status]}
          </button>
        );
      })}
    </div>
  );
}
