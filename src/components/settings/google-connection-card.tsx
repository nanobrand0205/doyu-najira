"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { testDriveConnection } from "@/app/(app)/settings/actions";

export function GoogleConnectionCard({ connected }: { connected: boolean }) {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<string | null>(null);

  function handleTest() {
    setResult(null);
    startTransition(async () => {
      try {
        await testDriveConnection();
        setResult("フォルダ構成を作成/確認しました。");
      } catch (e) {
        setResult(e instanceof Error ? e.message : "エラーが発生しました。");
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Google連携</CardTitle>
          {connected ? (
            <Badge variant="success">
              <CheckCircle2 className="h-3 w-3" />
              連携済み
            </Badge>
          ) : (
            <Badge variant="neutral">
              <XCircle className="h-3 w-3" />
              未連携
            </Badge>
          )}
        </div>
        <CardDescription>
          Drive・Calendar・GmailはGoogle OAuthで連携します。三条支部専用のGoogleアカウントでログインしてください。
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <ul className="space-y-1.5 text-[13px] text-[var(--muted-foreground)]">
          <li>・Drive: 資料の保存とフォルダ構成の自動作成</li>
          <li>・Calendar: 例会・なじら会・締切のリマインダー登録</li>
          <li>・Gmail: 入会候補者への案内・お礼メール送信</li>
        </ul>
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={handleTest} disabled={isPending}>
            Driveフォルダ構成を作成
          </Button>
        </div>
        {result && <p className="text-[12px] text-[var(--muted-foreground)]">{result}</p>}
        {!connected && (
          <p className="text-[11px] text-[var(--muted-foreground)]">
            未連携の場合、GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET を設定してGoogleでログインし直してください。
          </p>
        )}
      </CardContent>
    </Card>
  );
}
