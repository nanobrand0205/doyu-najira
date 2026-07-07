import Link from "next/link";
import { Plus } from "lucide-react";
import { auth } from "@/lib/auth";
import { listNajira } from "@/lib/data/najira";
import { canEditOperations } from "@/lib/permissions";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { NajiraCard } from "@/components/najira/najira-card";

export default async function NajiraListPage() {
  const [session, events] = await Promise.all([auth(), listNajira()]);

  return (
    <div>
      <PageHeader
        title="なじら会"
        description="次第・関連資料・上程中の計画書・決定事項をひとつにまとめています。"
        actions={
          canEditOperations(session?.user.role) ? (
            <Button asChild size="sm">
              <Link href="/najira/new">
                <Plus className="h-4 w-4" />
                なじら会を登録
              </Link>
            </Button>
          ) : undefined
        }
      />
      {events.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-[var(--border)] py-16 text-center text-[13px] text-[var(--muted-foreground)]">
          登録されているなじら会はありません。
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <NajiraCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
