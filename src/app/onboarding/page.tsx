import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { OnboardingForm } from "./onboarding-form";

export default async function OnboardingPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  if (session.user.branchId) {
    redirect("/");
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--background)] px-6">
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-[560px] w-[900px] -translate-x-1/2 rounded-full opacity-40 blur-3xl"
        style={{
          background: "radial-gradient(closest-side, var(--accent-soft), transparent 70%)",
        }}
      />

      <div className="relative z-10 w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--primary)] text-xl font-bold text-[var(--primary-foreground)] shadow-lg">
            D
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">はじめまして</h1>
            <p className="mt-1 text-[13px] text-[var(--muted-foreground)]">
              お名前と会社名を入力してください。会員情報と自動的に紐づきます。
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_1px_2px_rgba(15,23,20,0.04),0_20px_40px_-24px_rgba(15,23,20,0.25)]">
          <OnboardingForm />
        </div>
      </div>
    </div>
  );
}
