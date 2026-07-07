import { prisma } from "@/lib/prisma";

export function listFiles() {
  return prisma.fileAsset.findMany({
    orderBy: { createdAt: "desc" },
    include: { uploadedBy: true, relatedEvent: true },
  });
}

export function listEventOptions() {
  return prisma.event.findMany({
    orderBy: { startAt: "desc" },
    select: { id: true, title: true, type: true },
    take: 50,
  });
}

export type FileListItem = Awaited<ReturnType<typeof listFiles>>[number];
