import { auth } from "@/lib/auth";
import { listEvents } from "@/lib/data/events";
import { canEditOperations } from "@/lib/permissions";
import { PageHeader } from "@/components/layout/page-header";
import { EventsBrowser } from "@/components/events/events-browser";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function EventsPage() {
  const session = await auth();
  const events = await listEvents();

  return (
    <div>
      <PageHeader
        title="例会"
        description="チームMTGからなじら会上程、e-doyu登録、本番までの進み具合が一目でわかります。"
        actions={
          canEditOperations(session?.user.role) ? (
            <Button asChild size="sm">
              <Link href="/events/new">
                <Plus className="h-4 w-4" />
                例会を登録
              </Link>
            </Button>
          ) : undefined
        }
      />
      <EventsBrowser events={events} />
    </div>
  );
}
