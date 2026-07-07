import Link from "next/link";
import { Plus } from "lucide-react";
import { listBranchesForAdmin } from "@/lib/data/admin";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default async function AdminBranchesPage() {
  const branches = await listBranchesForAdmin();

  return (
    <div>
      <PageHeader
        title="支部一覧"
        description="Doyu Boardを利用している支部の一覧です。"
        actions={
          <Button asChild size="sm">
            <Link href="/admin/new">
              <Plus className="h-4 w-4" />
              支部を追加
            </Link>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2">
        {branches.map((branch) => (
          <Card key={branch.id}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[15px] font-semibold tracking-tight">
                  {branch.settings?.branchName ?? branch.slug}
                </p>
                <Badge variant={branch.isActive ? "success" : "neutral"}>
                  {branch.isActive ? "稼働中" : "停止中"}
                </Badge>
              </div>
              <p className="mt-1 text-[12px] text-[var(--muted-foreground)]">
                アプリ内表示名: {branch.settings?.displayName ?? "-"}
              </p>
              <p className="mt-0.5 text-[12px] text-[var(--muted-foreground)]">slug: {branch.slug}</p>
              <div className="mt-3 flex gap-1.5">
                <Badge variant="neutral">会員 {branch._count.members}名</Badge>
                <Badge variant="neutral">ユーザー {branch._count.users}名</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
