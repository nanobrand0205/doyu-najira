import { requireBranchSession } from "@/lib/data/guard";
import { listMembers } from "@/lib/data/members";
import { PageHeader } from "@/components/layout/page-header";
import { MembersBrowser } from "@/components/members/members-browser";

export default async function MembersPage() {
  const { branchId } = await requireBranchSession();
  const members = await listMembers(branchId);

  return (
    <div>
      <PageHeader
        title="会員一覧"
        description="支部にどんな会員がいて、今年度どんな役職かがわかります。"
      />
      <MembersBrowser members={members} />
    </div>
  );
}
