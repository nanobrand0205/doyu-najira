import type { Role } from "@prisma/client";
import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
      memberId?: string;
      // null only for SUPER_ADMIN, who is not scoped to a single branch
      branchId: string | null;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    uid?: string;
    role?: Role;
    memberId?: string;
    branchId?: string | null;
  }
}
