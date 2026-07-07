"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDate, relativeDayLabel } from "@/lib/format";
import { CANDIDATE_STATUS_LABEL, CANDIDATE_STATUS_VARIANT } from "@/lib/labels";
import type { CandidateListItem } from "@/lib/data/candidates";

const TABS = [
  { value: "active", label: "フォロー中" },
  { value: "all", label: "すべて" },
  { value: "JOINED", label: "入会済み" },
  { value: "HOLD_DECLINED", label: "保留・見送り" },
] as const;

export function CandidatesBrowser({ candidates }: { candidates: CandidateListItem[] }) {
  const [tab, setTab] = useState<string>("active");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return candidates.filter((c) => {
      if (tab === "active" && ["JOINED", "HOLD", "DECLINED"].includes(c.status)) return false;
      if (tab === "JOINED" && c.status !== "JOINED") return false;
      if (tab === "HOLD_DECLINED" && !["HOLD", "DECLINED"].includes(c.status)) return false;
      if (query) {
        const q = query.toLowerCase();
        const hit =
          c.name.toLowerCase().includes(q) ||
          (c.companyName ?? "").toLowerCase().includes(q);
        if (!hit) return false;
      }
      return true;
    });
  }, [candidates, tab, query]);

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            {TABS.map((t) => (
              <TabsTrigger key={t.value} value={t.value}>
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <div className="relative w-full max-w-[240px]">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--muted-foreground)]" />
          <Input
            placeholder="氏名・会社名で検索"
            className="pl-9"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-[var(--border)] py-16 text-center text-[13px] text-[var(--muted-foreground)]">
          該当する候補者はいません。
        </p>
      ) : (
        <Card>
          <CardContent className="divide-y divide-[var(--border)] p-0">
            {filtered.map((c) => (
              <Link
                key={c.id}
                href={`/candidates/${c.id}`}
                className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-[var(--surface-muted)]"
              >
                <Avatar className="h-9 w-9">
                  <AvatarFallback>{c.name.slice(0, 1)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-medium">
                    {c.name}
                    {c.companyName && (
                      <span className="ml-1.5 font-normal text-[var(--muted-foreground)]">
                        {c.companyName}
                      </span>
                    )}
                  </p>
                  <p className="text-[11px] text-[var(--muted-foreground)]">
                    担当: {c.assignedTo?.name ?? "未定"}
                    {c.nextActionDate &&
                      ` · 次回連絡 ${formatDate(c.nextActionDate)} (${relativeDayLabel(c.nextActionDate)})`}
                  </p>
                </div>
                <Badge variant={CANDIDATE_STATUS_VARIANT[c.status]} className="shrink-0">
                  {CANDIDATE_STATUS_LABEL[c.status]}
                </Badge>
              </Link>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
