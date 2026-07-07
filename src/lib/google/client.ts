import { google } from "googleapis";
import { prisma } from "@/lib/prisma";

// Builds an authenticated googleapis OAuth2 client for a signed-in user by
// reading the Google access/refresh token NextAuth stored on their Account
// row (see GOOGLE_SCOPES in auth.config.ts for the Drive/Calendar/Gmail
// scopes requested at sign-in). Returns null when the user has no linked
// Google account yet (e.g. DEMO_MODE, or before Google OAuth is configured).
export async function getGoogleAuthForUser(userId: string) {
  const account = await prisma.account.findFirst({
    where: { userId, provider: "google" },
  });
  if (!account?.access_token) return null;

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );
  oauth2Client.setCredentials({
    access_token: account.access_token,
    refresh_token: account.refresh_token,
    expiry_date: account.expires_at ? account.expires_at * 1000 : undefined,
  });
  return oauth2Client;
}
