import { redirect } from "next/navigation";
import { requireBranchSession } from "@/lib/data/guard";
import { canEditOperations } from "@/lib/permissions";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createNajira } from "./actions";

export default async function NewNajiraPage() {
  const { session } = await requireBranchSession();
  if (!canEditOperations(session.user.role)) {
    redirect("/najira");
  }

  return (
    <div className="mx-auto max-w-lg">
      <PageHeader title="なじら会を登録" description="タイトルは月から自動生成されます。" />
      <Card>
        <CardContent className="pt-5">
          <form action={createNajira} className="space-y-5">
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
              <Label htmlFor="venue">会場</Label>
              <Input id="venue" name="venue" placeholder="例:三条商工会議所 会議室A" />
            </div>
            <div className="flex justify-end">
              <Button type="submit">登録する</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
