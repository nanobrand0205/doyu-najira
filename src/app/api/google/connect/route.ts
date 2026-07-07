import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { auth } from "@/lib/auth";
import { canManageSensitive } from "@/lib/permissions";
import { BRANCH_GOOGLE_SCOPES } from "@/lib/google/scopes";

// Starts the branch-level Google connection (Settings → Google連携). This is
// separate from personal login: it connects the branch's shared Google
// Workspace account for Drive/Calendar/Gmail, requested only from
// branch_admin, not tied to whichever staff member is signed in.
export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user.branchId || !canManageSensitive(session.user.role)) {
    return NextResponse.redirect(new URL("/settings", request.url));
  }
  if (!process.env.GOOGLE_CLIENT_ID) {
    return NextResponse.redirect(new URL("/settings?googleError=not_configured", request.url));
  }

  const state = randomBytes(16).toString("hex");
  const redirectUri = new URL("/api/google/callback", request.url).toString();

  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: redirectUri,
    response_type: "code",
    access_type: "offline",
    prompt: "consent",
    scope: BRANCH_GOOGLE_SCOPES,
    state,
  });

  const res = NextResponse.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
  );
  res.cookies.set("google_connect_state", state, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 600,
    path: "/",
  });
  return res;
}
