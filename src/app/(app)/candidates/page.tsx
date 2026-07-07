import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { listCandidates } from "@/lib/data/candidates";
import { canEditOperations } from "@/lib/permissions";
import { PageHeader } from "@/components/layout/page-header";
import { CandidatesBrowser } from "@/components/candidates/candidates-browser";
import { NewCandidateDialog } from "@/components/candidates/new-candidate-dialog";

export default async function CandidatesPage() {
  const session = await auth();
  if (!canEditOperations(session?.user.role)) {
    redirect("/");
  }
  const candidates = await listCandidates();

  return (
    <div>
      <PageHeader
        title="候補者フォロー"
        description="入会候補者への声がけ・案内・お礼を、途切れさせずに追いかけます。"
        actions={<NewCandidateDialog />}
      />
      <CandidatesBrowser candidates={candidates} />
    </div>
  );
}
