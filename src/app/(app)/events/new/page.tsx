import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canEditOperations } from "@/lib/permissions";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createEvent } from "./actions";

export default async function NewEventPage() {
  const session = await auth();
  if (!canEditOperations(session?.user.role)) {
    redirect("/events");
  }
  const teams = await prisma.team.findMany({ where: { fiscalYear: { isCurrent: true } } });

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="例会を登録" description="まずは下書きとして登録し、チームMTG・なじら会を経て育てていきます。" />
      <Card>
        <CardContent className="pt-5">
          <form action={createEvent} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="title">例会名</Label>
              <Input id="title" name="title" placeholder="例:9月例会「価格転嫁のリアル」" required />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="date">開催日</Label>
                <Input id="date" name="date" type="date" required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="startTime">開始</Label>
                <Input id="startTime" name="startTime" type="time" defaultValue="18:30" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="endTime">終了</Label>
                <Input id="endTime" name="endTime" type="time" defaultValue="20:30" />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="teamId">担当チーム</Label>
              <select
                id="teamId"
                name="teamId"
                className="flex h-10 w-full rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 text-[13px]"
              >
                <option value="">未定</option>
                {teams.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.displayName}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="venue">会場</Label>
              <Input id="venue" name="venue" placeholder="例:三条市東公民館 大ホール" />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="theme">テーマ</Label>
              <Input id="theme" name="theme" placeholder="例:価格転嫁のリアル" />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="purpose">目的</Label>
              <Textarea id="purpose" name="purpose" rows={3} />
            </div>

            <div className="flex justify-end gap-2">
              <Button type="submit">下書きとして登録</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
