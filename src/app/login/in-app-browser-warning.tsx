"use client";

import { useState } from "react";

const IN_APP_BROWSER_PATTERNS = [
  /Line\//i,
  /Instagram/i,
  /FBAN|FBAV|FB_IAB/i,
  /Twitter/i,
  /MicroMessenger/i,
  /KAKAOTALK/i,
];

function isInAppBrowser(userAgent: string) {
  return IN_APP_BROWSER_PATTERNS.some((pattern) => pattern.test(userAgent));
}

export function InAppBrowserWarning() {
  const [show] = useState(() =>
    typeof navigator !== "undefined" ? isInAppBrowser(navigator.userAgent) : false
  );
  const [copied, setCopied] = useState(false);

  if (!show) return null;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard API unavailable; the manual instructions below still apply
    }
  }

  return (
    <div className="mb-4 rounded-2xl border border-[var(--warning)]/30 bg-[var(--warning)]/10 p-4 text-[13px] text-[var(--foreground)]">
      <p className="font-medium">この画面はアプリ内ブラウザで開かれています</p>
      <p className="mt-1 text-[var(--muted-foreground)]">
        LINEなどのアプリ内でこのページを開いていると、Googleログインがブロックされます。右上や下の「⋯」メニューから「外部ブラウザで開く」を選ぶか、下のボタンでURLをコピーしてSafari/Chromeに貼り付けて開いてください。
      </p>
      <button
        type="button"
        onClick={handleCopy}
        className="mt-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-[12px] font-medium"
      >
        {copied ? "コピーしました" : "URLをコピーする"}
      </button>
    </div>
  );
}
