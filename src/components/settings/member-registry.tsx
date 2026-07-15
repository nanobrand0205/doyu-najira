"use client";

import { useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createMember } from "@/app/(app)/settings/actions";

type MemberRow = {
  id: string;
  name: string;
  companyName: string;
  companyPosition: string | null;
  user: { id: string } | null;
};

export function MemberRegistry({ members }: { members: MemberRow[] }) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>会員登録</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <p className="text-[13px] text-[var(--muted-foreground)]">
          ここで氏名・会社名を登録しておくと、本人が初めてGoogleでログインした際に
          「お名前と会社名」の入力だけで自動的に紐づきます。ログイン用メールアドレスの登録は不要です。
        </p>

        <div className="divide-y divide-[var(--border)] rounded-xl border border-[var(--border)]">
          {members.length === 0 && (
            <p className="px-4 py-6 text-center text-[13px] text-[var(--muted-foreground)]">
              まだ会員が登録されていません。
            </p>
          )}
          {members.map((m) => (
            <div key={m.id} className="flex items-center gap-3 px-4 py-2.5">
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-medium">{m.name}</p>
                <p className="truncate text-[11px] text-[var(--muted-foreground)]">
                  {m.companyName}
                  {m.companyPosition ? ` / ${m.companyPosition}` : ""}
                </p>
              </div>
              {m.user ? (
                <Badge variant="success">ログイン紐づけ済み</Badge>
              ) : (
                <Badge variant="neutral">未ログイン</Badge>
              )}
            </div>
          ))}
        </div>

        <form
          ref={formRef}
          action={async (formData) => {
            await createMember(formData);
            formRef.current?.reset();
          }}
          className="grid gap-2 sm:grid-cols-2"
        >
          <Input name="name" placeholder="氏名 (例: 近藤 誠)" required />
          <Input name="companyName" placeholder="会社名 (例: 近藤印刷株式会社)" required />
          <Input name="companyPosition" placeholder="役職 (任意)" />
          <Input name="joinedYear" type="number" placeholder="入会年度 (任意)" />
          <Input name="introducedBy" placeholder="紹介者 (任意)" className="sm:col-span-2" />
          <Button type="submit" variant="outline" size="sm" className="sm:col-span-2">
            会員を追加
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
