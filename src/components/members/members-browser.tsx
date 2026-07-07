"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MemberCard } from "./member-card";
import { TEAM_NAME_LABEL } from "@/lib/labels";
import type { MemberListItem } from "@/lib/data/members";
import type { TeamName } from "@prisma/client";

export function MembersBrowser({ members }: { members: MemberListItem[] }) {
  const [team, setTeam] = useState<string>("all");
  const [query, setQuery] = useState("");

  const teamOptions = useMemo(() => {
    const set = new Set<TeamName>();
    members.forEach((m) => m.teamMemberships.forEach((tm) => set.add(tm.team.name)));
    return Array.from(set);
  }, [members]);

  const filtered = useMemo(() => {
    return members.filter((m) => {
      if (team !== "all" && !m.teamMemberships.some((tm) => tm.team.name === team)) return false;
      if (query) {
        const q = query.toLowerCase();
        const hit =
          m.name.toLowerCase().includes(q) ||
          m.companyName.toLowerCase().includes(q) ||
          (m.industry ?? "").toLowerCase().includes(q) ||
          (m.strengths ?? "").toLowerCase().includes(q);
        if (!hit) return false;
      }
      return true;
    });
  }, [members, team, query]);

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <Tabs value={team} onValueChange={setTeam}>
          <TabsList>
            <TabsTrigger value="all">すべて</TabsTrigger>
            {teamOptions.map((t) => (
              <TabsTrigger key={t} value={t}>
                {TEAM_NAME_LABEL[t]}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <div className="relative w-full max-w-[260px]">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--muted-foreground)]" />
          <Input
            placeholder="氏名・会社名・業種で検索"
            className="pl-9"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-[var(--border)] py-16 text-center text-[13px] text-[var(--muted-foreground)]">
          該当する会員はいません。
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((member) => (
            <MemberCard key={member.id} member={member} />
          ))}
        </div>
      )}
    </div>
  );
}
