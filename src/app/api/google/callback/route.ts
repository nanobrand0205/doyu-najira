import { NextResponse } from "next/server";
import { google } from "googleapis";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canManageSensitive } from "@/lib/permissions";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  const session = await auth();
  if (!session?.user.branchId || !canManageSensitive(session.user.role)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const cookieState = request.headers
    .get("cookie")
    ?.match(/google_connect_state=([^;]+)/)?.[1];
  if (!code || !state || state !== cookieState) {
    return NextResponse.redirect(new URL("/settings?googleError=invalid_state", request.url));
  }

  const redirectUri = new URL("/api/google/callback", request.url).toString();
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    redirectUri
  );

  const branchId = session.user.branchId;

  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
    const { data } = await oauth2.userinfo.get();

    const tokenData = {
      status: "CONNECTED" as const,
      connectedEmail: data.email ?? undefined,
      accessToken: tokens.access_token ?? undefined,
      refreshToken: tokens.refresh_token ?? undefined,
      expiryDate: tokens.expiry_date ? new Date(tokens.expiry_date) : undefined,
      scope: tokens.scope ?? undefined,
    };

    await prisma.googleIntegration.upsert({
      where: { branchId },
      update: tokenData,
      create: { branchId, ...tokenData },
    });
  } catch {
    await prisma.googleIntegration
      .upsert({
        where: { branchId },
        update: { status: "ERROR" },
        create: { branchId, status: "ERROR" },
      })
      .catch(() => {});
    return NextResponse.redirect(
      new URL("/settings?googleError=token_exchange_failed", request.url)
    );
  }

  const res = NextResponse.redirect(new URL("/settings?googleConnected=1", request.url));
  res.cookies.delete("google_connect_state");
  return res;
}
