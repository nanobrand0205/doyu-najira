import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { isSuperAdmin } from "@/lib/permissions";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createBranch } from "./actions";

export default async function NewBranchPage() {
  const session = await auth();
  if (!isSuperAdmin(session?.user.role)) {
    redirect("/admin");
  }

  return (
    <div className="mx-auto max-w-lg">
      <PageHeader
        title="支部を追加"
        description="最初の支部管理者を1名登録します。会員・チームなどの初期データは、追加後にその支部管理者が登録します。"
      />
      <Card>
        <CardContent className="pt-5">
          <form action={createBranch} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="slug">スラッグ (英数字)</Label>
              <Input id="slug" name="slug" placeholder="例: tsubame" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="branchName">支部名</Label>
              <Input id="branchName" name="branchName" placeholder="例: 燕支部" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="displayName">アプリ内表示名(任意)</Label>
              <Input id="displayName" name="displayName" placeholder="例: つばめボード" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="officerMeetingLabel">幹事会の名称</Label>
                <Input id="officerMeetingLabel" name="officerMeetingLabel" placeholder="例: なじら会" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="regularMeetingLabel">例会の名称</Label>
                <Input id="regularMeetingLabel" name="regularMeetingLabel" placeholder="例: 例会" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="adminEmail">最初の支部管理者のメールアドレス</Label>
              <Input id="adminEmail" name="adminEmail" type="email" required />
            </div>
            <div className="flex justify-end">
              <Button type="submit">支部を作成</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
