import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { MemberListItem } from "@/lib/data/members";

export function MemberCard({ member }: { member: MemberListItem }) {
  const team = member.teamMemberships[0]?.team;
  const topPosition = member.orgPositions[0];

  return (
    <Link href={`/members/${member.id}`}>
      <Card className="h-full transition-transform hover:-translate-y-0.5 hover:shadow-md">
        <CardContent className="flex flex-col items-center p-5 text-center">
          <Avatar className="h-16 w-16">
            <AvatarImage src={member.photoUrl ?? undefined} />
            <AvatarFallback className="text-[18px]">{member.name.slice(0, 1)}</AvatarFallback>
          </Avatar>
          <p className="mt-3 text-[14px] font-semibold">{member.name}</p>
          <p className="text-[12px] text-[var(--muted-foreground)]">{member.companyName}</p>
          <div className="mt-3 flex flex-wrap justify-center gap-1.5">
            {topPosition && <Badge variant="default">{topPosition.title}</Badge>}
            {team && <Badge variant="neutral">{team.displayName}</Badge>}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
