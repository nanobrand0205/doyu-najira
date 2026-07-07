"use server";

import { signIn } from "@/lib/auth";

export async function demoSignIn(email: string) {
  await signIn("demo", { email, redirectTo: "/" });
}

export async function googleSignIn() {
  await signIn("google", { redirectTo: "/" });
}
