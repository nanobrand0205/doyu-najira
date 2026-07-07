import { google } from "googleapis";
import { prisma } from "@/lib/prisma";

// Builds an authenticated googleapis OAuth2 client from the branch's own
// Google Workspace connection (Settings → Google連携), stored in
// GoogleIntegration. This is intentionally separate from NextAuth's personal
// login Account rows: Drive/Calendar/Gmail belong to the branch's shared
// account, not to whichever staff member happens to be logged in. Returns
// null when the branch hasn't connected Google yet.
export async function getGoogleAuthForBranch(branchId: string) {
  const integration = await prisma.googleIntegration.findUnique({ where: { branchId } });
  if (!integration?.accessToken) return null;

  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );
  oauth2Client.setCredentials({
    access_token: integration.accessToken,
    refresh_token: integration.refreshToken,
    expiry_date: integration.expiryDate?.getTime(),
  });
  return oauth2Client;
}
