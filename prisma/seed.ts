import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Reálné kurzy Akademie Drsov a jejich ceny.
// Spuštění: npx prisma db seed   (idempotentní – upsert podle slugu)
type SeedCourse = {
  slug: string;
  title: string;
  description: string;
  price: number;
  originalPrice: number | null;
  isFree?: boolean;
  coverImage?: string;
  order: number;
};

const courses: SeedCourse[] = [
  {
    slug: "makeup-pavel-kortan",
    title: "Online kurz – Makeup s Pavlem Kortánem",
    description:
      "Kurz „Objev se mnou, jak se líčit jednoduše“ tě naučí pracovat s make-upem tak, aby ti pomáhal zvýraznit přirozenou krásu.",
    price: 1450,
    originalPrice: 2500,
    order: 1,
  },
  {
    slug: "maderoterapie-specialni-postup",
    title: "Online kurz – Speciální postup maderoterapie",
    description:
      "Maderoterapie s přístrojem Roller je moderní tvarovací a detoxikační metoda, která podporuje zpevnění kontur.",
    price: 6900,
    originalPrice: null,
    order: 2,
  },
  {
    slug: "zlate-osetreni-kleopatra",
    title: "Online kurz – Zlaté ošetření Kleopatra",
    description:
      "Zlaté kleopatřino ošetření je luxusní rituál inspirovaný egyptskou královnou, který kombinuje 24karátové zlato.",
    price: 1590,
    originalPrice: null,
    coverImage: "/kurzy/kleopatra/cover.png",
    order: 3,
  },
  {
    slug: "osetreni-lotosovy-kvet",
    title: "Online kurz – Ošetření lotosový květ",
    description:
      "Lotosový vánek je luxusní rostlinné ošetření inspirované čistotou a regenerační silou indického lotosu.",
    price: 790,
    originalPrice: 990,
    order: 4,
  },
  {
    slug: "pdrn-losos",
    title: "Online kurz – Ošetření lososí sperma PDRN",
    description:
      "PDRN (losos) je luxusní omlazující metoda péče o pleť, která podporuje regeneraci buněk, tvorbu kolagenu a redukci vrásek.",
    price: 1790,
    originalPrice: 3190,
    order: 5,
  },
  {
    slug: "ozonizer-obsluha",
    title: "Online kurz obsluhy – Ozonizér",
    description:
      "Ozónické čištění pleti je šetrná a zároveň vysoce účinná metoda péče o pleť využívající ozón (aktivní kyslík).",
    price: 149,
    originalPrice: null,
    order: 6,
  },
  {
    slug: "vacupress-tela",
    title: "Online kurz – Speciální technika vacupress těla",
    description:
      "Vacupress je tělová technika podporující lymfatickou drenáž, prokrvení a tvarování postavy.",
    price: 7900,
    originalPrice: null,
    order: 7,
  },
  {
    slug: "bf-lifting",
    title: "Online kurz – Speciální technika BF lifting",
    description:
      "BF lifting je pokročilá technika nechirurgického liftingu obličeje s viditelným omlazujícím efektem.",
    price: 7900,
    originalPrice: null,
    order: 8,
  },
];

async function main() {
  for (const c of courses) {
    await prisma.course.upsert({
      where: { slug: c.slug },
      update: {
        title: c.title,
        description: c.description,
        price: c.price,
        originalPrice: c.originalPrice,
        isFree: c.isFree ?? false,
        order: c.order,
      },
      create: {
        slug: c.slug,
        title: c.title,
        description: c.description,
        price: c.price,
        originalPrice: c.originalPrice,
        coverImage: c.coverImage,
        accessMonths: 6,
        isPublished: true,
        isFree: c.isFree ?? false,
        order: c.order,
      },
    });
    console.log(`✓ ${c.title} – ${c.price} Kč`);
  }
  console.log(`\nHotovo: ${courses.length} kurzů.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
