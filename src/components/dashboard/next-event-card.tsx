import Link from "next/link";
import { CalendarDays, MapPin, Mic2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatTimeRange, relativeDayLabel } from "@/lib/format";
import type { Event, Member, Team } from "@prisma/client";

type EventWithRelations = Event & {
  team: Team | null;
  chairMember?: Member | null;
  roomLeaderMember?: Member | null;
};

export function NextEventCard({ event }: { event: EventWithRelations | null }) {
  if (!event) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-[var(--accent)]" />
            次回例会
          </CardTitle>
        </CardHeader>
        <CardContent className="text-[13px] text-[var(--muted-foreground)]">
          予定されている例会はありません。
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-60 blur-2xl"
        style={{ background: "var(--accent-soft)" }}
      />
      <CardHeader className="relative">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-[var(--accent)]" />
            次回例会
          </CardTitle>
          <Badge variant="default">{relativeDayLabel(event.startAt)}</Badge>
        </div>
      </CardHeader>
      <CardContent className="relative">
        <Link href={`/events/${event.id}`} className="block">
          <p className="text-[16px] font-semibold leading-snug tracking-tight hover:text-[var(--primary)]">
            {event.title}
          </p>
        </Link>
        <p className="mt-1 text-[13px] text-[var(--muted-foreground)]">
          {formatTimeRange(event.startAt, event.endAt)}
        </p>
        <div className="mt-4 flex flex-col gap-2 text-[13px]">
          {event.venue && (
            <div className="flex items-center gap-2 text-[var(--muted-foreground)]">
              <MapPin className="h-3.5 w-3.5" />
              {event.venue}
            </div>
          )}
          {event.speakerName && (
            <div className="flex items-center gap-2 text-[var(--muted-foreground)]">
              <Mic2 className="h-3.5 w-3.5" />
              報告者: {event.speakerName}
            </div>
          )}
        </div>
        {event.team && (
          <Badge variant="neutral" className="mt-4">
            担当: {event.team.displayName}
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}
