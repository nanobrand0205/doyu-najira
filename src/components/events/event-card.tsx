import Link from "next/link";
import { CalendarDays, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/format";
import { EVENT_STATUS_LABEL, PLAN_STATUS_LABEL, PLAN_STATUS_VARIANT } from "@/lib/labels";
import type { EventListItem } from "@/lib/data/events";

export function EventCard({ event }: { event: EventListItem }) {
  const latestPlan = event.plans[0];

  return (
    <Link href={`/events/${event.id}`}>
      <Card className="h-full transition-transform hover:-translate-y-0.5 hover:shadow-md">
        <CardContent className="p-5">
          <div className="flex items-center justify-between gap-2">
            <Badge variant="neutral">{event.team?.displayName ?? "支部全体"}</Badge>
            <Badge variant={event.status === "COMPLETED" ? "success" : "default"}>
              {EVENT_STATUS_LABEL[event.status]}
            </Badge>
          </div>
          <p className="mt-3 text-[15px] font-semibold leading-snug tracking-tight">
            {event.title}
          </p>
          <div className="mt-3 space-y-1.5 text-[12.5px] text-[var(--muted-foreground)]">
            <div className="flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5" />
              {formatDate(event.startAt, "yyyy年M月d日(E)")}
            </div>
            {event.venue && (
              <div className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                {event.venue}
              </div>
            )}
          </div>
          {latestPlan && (
            <Badge variant={PLAN_STATUS_VARIANT[latestPlan.status]} className="mt-4">
              {PLAN_STATUS_LABEL[latestPlan.status]}
            </Badge>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
