import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Nastaví uživateli roli ADMIN.
// Nejdřív se na webu zaregistrujte svým e-mailem, pak spusťte:
//   npx tsx prisma/make-admin.ts vas@email.cz
const email = process.argv[2];

async function main() {
  if (!email) {
    console.error("Použití: npx tsx prisma/make-admin.ts vas@email.cz");
    process.exit(1);
  }
  const res = await prisma.user.updateMany({
    where: { email },
    data: { role: "ADMIN" },
  });
  console.log(
    res.count
      ? `✓ ${email} je nyní ADMIN. Odhlaste se a znovu přihlaste.`
      : `⚠ Uživatel ${email} nenalezen – nejdřív se zaregistrujte na /registrace.`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
