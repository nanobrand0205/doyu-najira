"use client";

import { useMemo, useState } from "react";
import { Search, FileText, Image as ImageIcon, FileSpreadsheet, ExternalLink } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDate } from "@/lib/format";
import { FILE_TYPE_LABEL } from "@/lib/labels";
import type { FileListItem } from "@/lib/data/files";
import type { FileType } from "@prisma/client";

function iconFor(type: FileType) {
  if (type === "PHOTO") return ImageIcon;
  if (type === "GUEST_LIST") return FileSpreadsheet;
  return FileText;
}

export function FilesBrowser({ files }: { files: FileListItem[] }) {
  const [type, setType] = useState<string>("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return files.filter((f) => {
      if (type !== "all" && f.type !== type) return false;
      if (query && !f.title.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [files, type, query]);

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="種別" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">すべての種別</SelectItem>
            {Object.entries(FILE_TYPE_LABEL).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="relative w-full max-w-[240px]">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--muted-foreground)]" />
          <Input
            placeholder="資料名で検索"
            className="pl-9"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-[var(--border)] py-16 text-center text-[13px] text-[var(--muted-foreground)]">
          該当する資料はありません。
        </p>
      ) : (
        <Card>
          <CardContent className="divide-y divide-[var(--border)] p-0">
            {filtered.map((file) => {
              const Icon = iconFor(file.type);
              return (
                <a
                  key={file.id}
                  href={file.driveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-[var(--surface-muted)]"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--surface-muted)]">
                    <Icon className="h-4 w-4 text-[var(--muted-foreground)]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-medium">{file.title}</p>
                    <p className="text-[11px] text-[var(--muted-foreground)]">
                      {formatDate(file.createdAt)} · {file.uploadedBy?.name ?? "不明"}
                      {file.relatedEvent && ` · ${file.relatedEvent.title}`}
                    </p>
                  </div>
                  <Badge variant="neutral" className="shrink-0">
                    {FILE_TYPE_LABEL[file.type]}
                  </Badge>
                  {file.isLatest && (
                    <Badge variant="success" className="shrink-0">
                      最新版
                    </Badge>
                  )}
                  <ExternalLink className="h-3.5 w-3.5 shrink-0 text-[var(--muted-foreground)]" />
                </a>
              );
            })}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
