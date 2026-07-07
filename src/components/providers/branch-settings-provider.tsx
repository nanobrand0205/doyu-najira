"use client";

import { createContext, useContext } from "react";
import type { BranchLabels } from "@/lib/branch-settings";

export type { BranchLabels };

const BranchSettingsContext = createContext<BranchLabels | null>(null);

export function BranchSettingsProvider({
  labels,
  children,
}: {
  labels: BranchLabels;
  children: React.ReactNode;
}) {
  return (
    <BranchSettingsContext.Provider value={labels}>{children}</BranchSettingsContext.Provider>
  );
}

// Falls back to generic defaults if used outside the provider (e.g. in
// isolated stories/tests) rather than throwing.
export function useBranchLabels(): BranchLabels {
  const ctx = useContext(BranchSettingsContext);
  return (
    ctx ?? {
      branchName: "支部",
      displayName: "Doyu Board",
      officerMeetingLabel: "幹事会",
      regularMeetingLabel: "例会",
      teamLabel: "チーム",
      signatureName: "支部",
    }
  );
}
