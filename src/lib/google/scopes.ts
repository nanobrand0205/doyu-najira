// Scopes requested when a branch_admin connects the branch's shared Google
// Workspace account (Settings → Google連携), separate from personal login.
export const BRANCH_GOOGLE_SCOPES = [
  "https://www.googleapis.com/auth/drive.file",
  "https://www.googleapis.com/auth/calendar.events",
  "https://www.googleapis.com/auth/gmail.send",
  "https://www.googleapis.com/auth/gmail.compose",
].join(" ");
