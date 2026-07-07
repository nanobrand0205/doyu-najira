import Link from "next/link";
import { FileText, Image as ImageIcon, FileSpreadsheet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FILE_TYPE_LABEL } from "@/lib/labels";
import { formatDate } from "@/lib/format";
import type { FileAsset, Member, Event } from "@prisma/client";

type FileWithRelations = FileAsset & {
  uploadedBy: Member | null;
  relatedEvent: Event | null;
};

function iconFor(type: FileAsset["type"]) {
  if (type === "PHOTO") return ImageIcon;
  if (type === "GUEST_LIST") return FileSpreadsheet;
  return FileText;
}

export function FilesFeed({ files }: { files: FileWithRelations[] }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>新着資料</CardTitle>
          <Link href="/files" className="text-[12px] font-medium text-[var(--accent)]">
            資料BOXを見る
          </Link>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ul className="divide-y divide-[var(--border)]">
          {files.map((file) => {
            const Icon = iconFor(file.type);
            return (
              <li key={file.id}>
                <a
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
                      {formatDate(file.createdAt)} · {file.uploadedBy?.name ?? "不明"}
                    </p>
                  </div>
                  <Badge variant="neutral" className="shrink-0">
                    {FILE_TYPE_LABEL[file.type]}
                  </Badge>
                </a>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
