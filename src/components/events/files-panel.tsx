import { FileText, Image as ImageIcon, FileSpreadsheet, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FILE_TYPE_LABEL } from "@/lib/labels";
import { formatDate } from "@/lib/format";
import type { FileAsset } from "@prisma/client";

function iconFor(type: FileAsset["type"]) {
  if (type === "PHOTO") return ImageIcon;
  if (type === "GUEST_LIST") return FileSpreadsheet;
  return FileText;
}

export function FilesPanel({ files }: { files: FileAsset[] }) {
  if (files.length === 0) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-[13px] text-[var(--muted-foreground)]">
          この例会に紐づく資料はまだありません。資料BOXから追加してください。
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="divide-y divide-[var(--border)] p-0">
        {files.map((file) => {
          const Icon = iconFor(file.type);
          return (
            <a
              key={file.id}
              href={file.driveUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-[var(--surface-muted)]"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--surface-muted)]">
                <Icon className="h-4 w-4 text-[var(--muted-foreground)]" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-medium">{file.title}</p>
                <p className="text-[11px] text-[var(--muted-foreground)]">
                  {formatDate(file.createdAt)}
                  {file.isLatest && " · 最新版"}
                </p>
              </div>
              <Badge variant="neutral" className="shrink-0">
                {FILE_TYPE_LABEL[file.type]}
              </Badge>
              <ExternalLink className="h-3.5 w-3.5 shrink-0 text-[var(--muted-foreground)]" />
            </a>
          );
        })}
      </CardContent>
    </Card>
  );
}
