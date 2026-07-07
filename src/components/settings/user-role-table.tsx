"use client";

import { useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { roleLabel } from "@/lib/permissions";
import { updateUserRole } from "@/app/(app)/settings/actions";
import type { Role, User } from "@prisma/client";

const ROLES: Role[] = ["MEMBER", "SECRETARY", "ADMIN", "MANAGER"];

export function UserRoleTable({ users }: { users: User[] }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Card>
      <CardHeader>
        <CardTitle>ユーザー権限</CardTitle>
      </CardHeader>
      <CardContent className="divide-y divide-[var(--border)] p-0">
        {users.map((u) => (
          <div key={u.id} className="flex items-center gap-3 px-5 py-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={u.image ?? undefined} />
              <AvatarFallback>{u.name?.slice(0, 1)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-medium">{u.name}</p>
              <p className="truncate text-[11px] text-[var(--muted-foreground)]">{u.email}</p>
            </div>
            <Select
              value={u.role}
              disabled={isPending}
              onValueChange={(role) =>
                startTransition(() => updateUserRole(u.id, role as Role))
              }
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ROLES.map((r) => (
                  <SelectItem key={r} value={r}>
                    {roleLabel(r)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
