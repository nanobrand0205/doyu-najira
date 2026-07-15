import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { seedSanjoBranch } from "@/lib/seed/sanjo";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");
  if (!process.env.AUTH_SECRET || secret !== process.env.AUTH_SECRET) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const existing = await prisma.branch.findUnique({ where: { slug: "sanjo" } });
  if (existing) {
    return NextResponse.json({ status: "already-seeded", branchId: existing.id });
  }

  const result = await seedSanjoBranch(prisma);
  return NextResponse.json({ status: "seeded", ...result });
}
