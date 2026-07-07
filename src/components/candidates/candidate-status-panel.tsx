"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CandidateStatusStepper } from "./candidate-status-stepper";
import { CANDIDATE_STATUS_LABEL, CANDIDATE_STATUS_VARIANT } from "@/lib/labels";
import { Badge } from "@/components/ui/badge";
import { updateCandidateStatus } from "@/app/(app)/candidates/actions";
import type { CandidateStatus } from "@prisma/client";

export function CandidateStatusPanel({
  candidateId,
  status,
  editable,
}: {
  candidateId: string;
  status: CandidateStatus;
  editable: boolean;
}) {
  const [current, setCurrent] = useState(status);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>ステータス</CardTitle>
          <Badge variant={CANDIDATE_STATUS_VARIANT[current]}>
            {CANDIDATE_STATUS_LABEL[current]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <CandidateStatusStepper
          current={current}
          editable={editable}
          onChange={async (next) => {
            setCurrent(next);
            await updateCandidateStatus(candidateId, next);
          }}
        />
      </CardContent>
    </Card>
  );
}
