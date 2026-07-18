import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Přiřazení obrázků (cover) ke kurzům podle slugu.
// Nedestruktivní – mění POUZE coverImage, nic jiného nepřepisuje.
// Spuštění: npx tsx prisma/set-covers.ts
// Obrázky leží v platform/public/... a nasazují se spolu s webem.
const covers: Record<string, string> = {
  "zlate-osetreni-kleopatra": "/kurzy/kleopatra/cover.png",
  // sem budeme přidávat další kurzy, jak budou přicházet obrázky:
  // "pdrn-losos": "/kurzy/pdrn/cover.png",
};

async function main() {
  for (const [slug, coverImage] of Object.entries(covers)) {
    const res = await prisma.course.updateMany({
      where: { slug },
      data: { coverImage },
    });
    console.log(`${slug}: ${res.count ? "✓ nastaveno" : "⚠ kurz nenalezen"}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
