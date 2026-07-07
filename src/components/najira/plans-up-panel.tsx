import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PLAN_STATUS_LABEL, PLAN_STATUS_VARIANT } from "@/lib/labels";
import type { Event, Plan } from "@prisma/client";

type PlanWithEvent = Plan & { event: Event };

export function PlansUpPanel({ plans }: { plans: PlanWithEvent[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>上程されている例会計画書</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {plans.length === 0 ? (
          <p className="text-[13px] text-[var(--muted-foreground)]">
            現在上程中の計画書はありません。
          </p>
        ) : (
          plans.map((plan) => (
            <Link
              key={plan.id}
              href={`/events/${plan.eventId}`}
              className="flex items-center justify-between gap-3 rounded-xl border border-[var(--border)] px-3 py-2.5 transition-colors hover:bg-[var(--surface-muted)]"
            >
              <span className="min-w-0 flex-1 truncate text-[13px] font-medium">
                {plan.event.title}
              </span>
              <Badge variant={PLAN_STATUS_VARIANT[plan.status]}>
                {PLAN_STATUS_LABEL[plan.status]}
              </Badge>
            </Link>
          ))
        )}
      </CardContent>
    </Card>
  );
}
