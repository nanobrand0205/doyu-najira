import { PrismaClient } from "@prisma/client";
import { seedSanjoBranch } from "../src/lib/seed/sanjo";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Doyu Board demo data (三条支部)...");
  await seedSanjoBranch(prisma);
  console.log("Seed completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
