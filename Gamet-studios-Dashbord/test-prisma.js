import pkg from "@prisma/client";

const { PrismaClient } = pkg;

const prisma = new PrismaClient();

async function test() {
  console.log("Prisma Client wird getestet...");

  try {
    const count = await prisma.guildSettings.count();
    console.log(`✅ Prisma funktioniert! Anzahl Einträge: ${count}`);
  } catch (e) {
    console.error("❌ Prisma Fehler:", e.message);
  } finally {
    await prisma.$disconnect();
  }
}

test();
