import Link from "next/link";
import { CalendarDays, MapPin, ListChecks } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/format";
import type { NajiraListItem } from "@/lib/data/najira";

export function NajiraCard({ event }: { event: NajiraListItem }) {
  const doneCount = event.agendaItems.filter((a) => a.isDone).length;

  return (
    <Link href={`/najira/${event.id}`}>
      <Card className="h-full transition-transform hover:-translate-y-0.5 hover:shadow-md">
        <CardContent className="p-5">
          <div className="flex items-center justify-between gap-2">
            <Badge variant={event.status === "COMPLETED" ? "success" : "default"}>
              {event.status === "COMPLETED" ? "実施済み" : "予定"}
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
          {event.agendaItems.length > 0 && (
            <Badge variant="neutral" className="mt-4">
              <ListChecks className="h-3 w-3" />
              議題 {doneCount}/{event.agendaItems.length}
            </Badge>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
