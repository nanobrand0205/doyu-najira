import { auth } from "@/lib/auth";
import { listFiles, listEventOptions } from "@/lib/data/files";
import { canEditOperations } from "@/lib/permissions";
import { PageHeader } from "@/components/layout/page-header";
import { FilesBrowser } from "@/components/files/files-browser";
import { FileRegisterDialog } from "@/components/files/file-register-dialog";

export default async function FilesPage() {
  const session = await auth();
  const [files, events] = await Promise.all([listFiles(), listEventOptions()]);

  return (
    <div>
      <PageHeader
        title="資料BOX"
        description="LINEで流れて消えてしまう前に、Google Driveへ保存して一覧できるようにします。"
        actions={
          canEditOperations(session?.user.role) ? (
            <FileRegisterDialog events={events} />
          ) : undefined
        }
      />
      <FilesBrowser files={files} />
    </div>
  );
}
