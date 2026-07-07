import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

const GOOGLE_SCOPES = [
  "openid",
  "email",
  "profile",
  "https://www.googleapis.com/auth/drive.file",
  "https://www.googleapis.com/auth/calendar.events",
  "https://www.googleapis.com/auth/gmail.send",
  "https://www.googleapis.com/auth/gmail.compose",
].join(" ");

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
              params: {
                scope: GOOGLE_SCOPES,
                access_type: "offline",
                prompt: "consent",
              },
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
