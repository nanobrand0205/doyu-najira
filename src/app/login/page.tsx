import { prisma } from "@/lib/prisma";
import { roleLabel } from "@/lib/permissions";
import { demoSignIn, googleSignIn } from "./actions";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const isDemoMode = process.env.DEMO_MODE === "true";

export default async function LoginPage() {
  const demoUsers = isDemoMode
    ? await prisma.user.findMany({
        orderBy: { createdAt: "asc" },
        include: { member: true, branch: { include: { settings: true } } },
      })
    : [];

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--background)] px-6">
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-[560px] w-[900px] -translate-x-1/2 rounded-full opacity-40 blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, var(--accent-soft), transparent 70%)",
        }}
      />

      <div className="relative z-10 w-full max-w-sm">
        <div className="mb-10 flex flex-col items-center gap-3 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--primary)] text-xl font-bold text-[var(--primary-foreground)] shadow-lg">
            D
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Doyu Board</h1>
            <p className="mt-1 text-[13px] text-[var(--muted-foreground)]">
              支部の、今どうなってるかが見えるボード。
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[0_1px_2px_rgba(15,23,20,0.04),0_20px_40px_-24px_rgba(15,23,20,0.25)]">
          <form action={googleSignIn}>
            <Button type="submit" size="lg" className="w-full">
              <GoogleIcon />
              Googleでログイン
            </Button>
          </form>
          <p className="mt-3 text-center text-[12px] text-[var(--muted-foreground)]">
            所属する支部の同友会Googleアカウントでログインしてください
          </p>
        </div>

        {isDemoMode && (
          <div className="mt-6 rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface-muted)]/60 p-5">
            <div className="mb-3 flex items-center gap-2">
              <Badge variant="warning">DEMO MODE</Badge>
              <span className="text-[12px] text-[var(--muted-foreground)]">
                Google連携なしで役割ごとの画面を確認できます
              </span>
            </div>
            <div className="flex flex-col gap-1.5">
              {demoUsers.map((u) => (
                <form action={demoSignIn.bind(null, u.email!)} key={u.id}>
                  <button
                    type="submit"
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors hover:bg-[var(--surface)]"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={u.image ?? undefined} />
                      <AvatarFallback>{u.name?.slice(0, 1)}</AvatarFallback>
                    </Avatar>
                    <span className="flex-1">
                      <span className="block text-[13px] font-medium">{u.name}</span>
                      <span className="block text-[11px] text-[var(--muted-foreground)]">
                        {u.member?.companyName ??
                          (u.branch ? undefined : "運営 (全支部管理)")}
                      </span>
                    </span>
                    {u.branch?.settings && (
                      <Badge variant="outline">{u.branch.settings.branchName}</Badge>
                    )}
                    <Badge variant="neutral">{roleLabel(u.role)}</Badge>
                  </button>
                </form>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4">
      <path
        fill="#4285F4"
        d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.63h6.46a5.52 5.52 0 0 1-2.4 3.63v3h3.88c2.27-2.09 3.58-5.17 3.58-8.81z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.07 7.94-2.92l-3.88-3c-1.08.72-2.45 1.15-4.06 1.15-3.13 0-5.78-2.11-6.73-4.95H1.27v3.1A12 12 0 0 0 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.28A7.2 7.2 0 0 1 4.89 12c0-.79.14-1.56.38-2.28v-3.1H1.27A12 12 0 0 0 0 12c0 1.94.46 3.77 1.27 5.38l4-3.1z"
      />
      <path
        fill="#EA4335"
        d="M12 4.77c1.76 0 3.35.61 4.6 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.69 1.27 6.62l4 3.1C6.22 6.88 8.87 4.77 12 4.77z"
      />
    </svg>
  );
}
