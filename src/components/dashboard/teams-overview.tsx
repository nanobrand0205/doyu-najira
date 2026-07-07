import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { Team, TeamMembership, Member } from "@prisma/client";

type TeamWithMembers = Team & {
  memberships: (TeamMembership & { member: Member })[];
};

export function TeamsOverview({ teams }: { teams: TeamWithMembers[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>今年度チーム編成</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-3">
        {teams.map((team) => {
          const leader = team.memberships.find((m) => m.isLeader);
          return (
            <Link
              key={team.id}
              href={`/organization`}
              className="rounded-xl border border-[var(--border)] p-4 transition-colors hover:bg-[var(--surface-muted)]"
            >
              <p className="text-[13px] font-semibold">{team.displayName}</p>
              {leader && (
                <p className="mt-1 text-[12px] text-[var(--muted-foreground)]">
                  リーダー: {leader.member.name}
                </p>
              )}
              <div className="mt-3 flex items-center -space-x-2">
                {team.memberships.slice(0, 5).map((m) => (
                  <Avatar key={m.id} className="h-7 w-7 border-2 border-[var(--surface)]">
                    <AvatarFallback>{m.member.name.slice(0, 1)}</AvatarFallback>
                  </Avatar>
                ))}
              </div>
              <Badge variant="neutral" className="mt-3">
                {team.memberships.length}名
              </Badge>
            </Link>
          );
        })}
      </CardContent>
    </Card>
  );
}
