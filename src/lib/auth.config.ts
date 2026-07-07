import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

// Personal login only needs identity scopes. Drive/Calendar/Gmail access is
// connected separately per-branch via /api/google/connect (see
// src/lib/google/scopes.ts), independent of who happens to be logged in.
const GOOGLE_SCOPES = ["openid", "email", "profile"].join(" ");

const PUBLIC_PATHS = ["/login"];

// Edge-safe config: no Prisma adapter here (middleware runs on the edge
// runtime). Used for route-level authorization checks only.
export const authConfig: NextAuthConfig = {
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers:
    process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            authorization: {
              params: { scope: GOOGLE_SCOPES },
            },
          }),
        ]
      : [],
  callbacks: {
    authorized({ auth, request }) {
      const isPublic = PUBLIC_PATHS.some((p) =>
        request.nextUrl.pathname.startsWith(p)
      );
      if (isPublic) return true;
      return !!auth?.user;
    },
  },
  trustHost: true,
};
