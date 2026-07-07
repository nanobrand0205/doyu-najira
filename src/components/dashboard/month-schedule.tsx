import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/format";
import { EVENT_TYPE_LABEL } from "@/lib/labels";
import type { Event, Team } from "@prisma/client";

type EventWithTeam = Event & { team: Team | null };

function linkFor(event: Event) {
  return event.type === "NAJIRA" ? `/najira/${event.id}` : `/events/${event.id}`;
}

export function MonthSchedule({ events }: { events: EventWithTeam[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>今月の三条支部予定</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {events.length === 0 ? (
          <p className="px-5 pb-5 text-[13px] text-[var(--muted-foreground)]">
            今月の予定はまだ登録されていません。
          </p>
        ) : (
          <ul className="divide-y divide-[var(--border)]">
            {events.map((event) => (
              <li key={event.id}>
                <Link
                  href={linkFor(event)}
                  className="flex items-center gap-4 px-5 py-3 transition-colors hover:bg-[var(--surface-muted)]"
                >
                  <div className="flex w-12 shrink-0 flex-col items-center rounded-xl bg-[var(--surface-muted)] py-1.5">
                    <span className="text-[10px] text-[var(--muted-foreground)]">
                      {formatDate(event.startAt, "M月")}
                    </span>
                    <span className="text-[15px] font-semibold leading-tight">
                      {formatDate(event.startAt, "d")}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-medium">{event.title}</p>
                    <p className="text-[12px] text-[var(--muted-foreground)]">
                      {formatDate(event.startAt, "E曜日")} · {event.venue ?? "会場未定"}
                    </p>
                  </div>
                  <Badge variant="neutral" className="shrink-0">
                    {EVENT_TYPE_LABEL[event.type]}
                  </Badge>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
