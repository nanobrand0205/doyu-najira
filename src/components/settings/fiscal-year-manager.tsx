"use client";

import { useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createFiscalYear, setCurrentFiscalYear } from "@/app/(app)/settings/actions";
import type { FiscalYear } from "@prisma/client";

export function FiscalYearManager({ years }: { years: FiscalYear[] }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Card>
      <CardHeader>
        <CardTitle>年度設定</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {years.map((y) => (
            <div
              key={y.id}
              className="flex items-center justify-between rounded-xl border border-[var(--border)] px-3 py-2.5"
            >
              <span className="text-[13px] font-medium">{y.year}年度</span>
              {y.isCurrent ? (
                <Badge variant="success">現在年度</Badge>
              ) : (
                <Button
                  size="sm"
                  variant="secondary"
                  disabled={isPending}
                  onClick={() => startTransition(() => setCurrentFiscalYear(y.id))}
                >
                  現在年度にする
                </Button>
              )}
            </div>
          ))}
        </div>

        <form action={createFiscalYear} className="flex items-center gap-2 pt-2">
          <Input name="year" type="number" placeholder="例: 2027" className="max-w-[140px]" />
          <Button type="submit" size="sm" variant="outline">
            年度を追加
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
