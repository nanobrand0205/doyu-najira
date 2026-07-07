import { prisma } from "@/lib/prisma";

export function listFiles(branchId: string) {
  return prisma.fileAsset.findMany({
    where: { branchId },
    orderBy: { createdAt: "desc" },
    include: { uploadedBy: true, relatedEvent: true },
  });
}

export function listEventOptions(branchId: string) {
  return prisma.event.findMany({
    where: { branchId },
    orderBy: { startAt: "desc" },
    select: { id: true, title: true, type: true },
    take: 50,
  });
}

export type FileListItem = Awaited<ReturnType<typeof listFiles>>[number];
