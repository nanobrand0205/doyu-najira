import { prisma } from "@/lib/prisma";

export function listFiscalYears(branchId: string) {
  return prisma.fiscalYear.findMany({ where: { branchId }, orderBy: { year: "desc" } });
}

export async function getOrgChart(branchId: string, year?: number) {
  const fiscalYear = year
    ? await prisma.fiscalYear.findUnique({ where: { branchId_year: { branchId, year } } })
    : await prisma.fiscalYear.findFirst({ where: { branchId, isCurrent: true } });

  if (!fiscalYear) return null;

  const [positions, teams] = await Promise.all([
    prisma.orgPosition.findMany({
      where: { branchId, fiscalYearId: fiscalYear.id },
      include: { member: true },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.team.findMany({
      where: { branchId, fiscalYearId: fiscalYear.id },
      include: { memberships: { include: { member: true } } },
    }),
  ]);

  const grouped = positions.reduce<Record<string, typeof positions>>((acc, p) => {
    (acc[p.category] ??= []).push(p);
    return acc;
  }, {});

  return { fiscalYear, grouped, teams };
}

export type OrgChartData = NonNullable<Awaited<ReturnType<typeof getOrgChart>>>;
