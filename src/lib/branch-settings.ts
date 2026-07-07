import { prisma } from "@/lib/prisma";

export type BranchLabels = {
  branchName: string;
  displayName: string;
  officerMeetingLabel: string;
  regularMeetingLabel: string;
  teamLabel: string;
  signatureName: string;
};

const DEFAULT_LABELS: BranchLabels = {
  branchName: "支部",
  displayName: "Doyu Board",
  officerMeetingLabel: "幹事会",
  regularMeetingLabel: "例会",
  teamLabel: "チーム",
  signatureName: "支部",
};

// Falls back to generic defaults when a branch hasn't customized its
// settings yet, so every screen always has a label to render.
export async function getBranchSettings(branchId: string): Promise<BranchLabels> {
  const settings = await prisma.branchSettings.findUnique({ where: { branchId } });
  if (!settings) return DEFAULT_LABELS;
  return {
    branchName: settings.branchName || DEFAULT_LABELS.branchName,
    displayName: settings.displayName || DEFAULT_LABELS.displayName,
    officerMeetingLabel: settings.officerMeetingLabel || DEFAULT_LABELS.officerMeetingLabel,
    regularMeetingLabel: settings.regularMeetingLabel || DEFAULT_LABELS.regularMeetingLabel,
    teamLabel: settings.teamLabel || DEFAULT_LABELS.teamLabel,
    signatureName: settings.signatureName || settings.branchName || DEFAULT_LABELS.signatureName,
  };
}
