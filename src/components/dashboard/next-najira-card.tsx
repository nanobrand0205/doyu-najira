import Link from "next/link";
import { Handshake, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatTimeRange, relativeDayLabel } from "@/lib/format";
import type { Event, NajiraAgendaItem } from "@prisma/client";

type NajiraWithAgenda = Event & { agendaItems: NajiraAgendaItem[] };

export function NextNajiraCard({ event }: { event: NajiraWithAgenda | null }) {
  if (!event) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Handshake className="h-4 w-4 text-[var(--accent)]" />
            次回なじら会
          </CardTitle>
        </CardHeader>
        <CardContent className="text-[13px] text-[var(--muted-foreground)]">
          予定されているなじら会はありません。
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Handshake className="h-4 w-4 text-[var(--accent)]" />
            次回なじら会
          </CardTitle>
          <Badge variant="default">{relativeDayLabel(event.startAt)}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <Link href={`/najira/${event.id}`} className="block">
          <p className="text-[16px] font-semibold leading-snug tracking-tight hover:text-[var(--primary)]">
            {event.title}
          </p>
        </Link>
        <p className="mt-1 text-[13px] text-[var(--muted-foreground)]">
          {formatTimeRange(event.startAt, event.endAt)}
        </p>
        {event.venue && (
          <div className="mt-3 flex items-center gap-2 text-[13px] text-[var(--muted-foreground)]">
            <MapPin className="h-3.5 w-3.5" />
            {event.venue}
          </div>
        )}
        {event.agendaItems.length > 0 && (
          <ul className="mt-4 space-y-1.5">
            {event.agendaItems.slice(0, 4).map((item) => (
              <li
                key={item.id}
                className="flex items-center gap-2 text-[13px] text-[var(--foreground)]"
              >
                <span className="h-1 w-1 shrink-0 rounded-full bg-[var(--accent)]" />
                {item.title}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
