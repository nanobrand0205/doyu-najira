"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { claimMemberAccount } from "./actions";

const ERROR_MESSAGES = {
  not_found: "該当する会員情報が見つかりませんでした。入力内容をご確認いただくか、事務局にご連絡ください。",
  ambiguous: "同じお名前・会社名の会員が複数見つかりました。お手数ですが事務局にご連絡ください。",
  invalid_input: "お名前と会社名を入力してください。",
  not_logged_in: "ログインが確認できませんでした。もう一度ログインしてください。",
} as const;

export function OnboardingForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      const result = await claimMemberAccount(name, companyName);
      if (result.ok) {
        router.push("/");
        router.refresh();
      } else {
        setError(ERROR_MESSAGES[result.reason]);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <label htmlFor="onboarding-name" className="text-[13px] font-medium">
          お名前
        </label>
        <Input
          id="onboarding-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="例: 近藤 誠"
          required
        />
      </div>
      <div className="space-y-1.5">
        <label htmlFor="onboarding-company" className="text-[13px] font-medium">
          会社名
        </label>
        <Input
          id="onboarding-company"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          placeholder="例: 近藤印刷株式会社"
          required
        />
      </div>
      {error && <p className="text-[12px] text-[var(--danger)]">{error}</p>}
      <Button type="submit" size="lg" className="w-full" disabled={isPending}>
        {isPending ? "確認中..." : "会員情報と紐づける"}
      </Button>
    </form>
  );
}
