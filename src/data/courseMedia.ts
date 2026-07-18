// Doplňková média ke kurzům (ukázkové video + galerie) pro veřejnou stránku kurzu.
// Klíč = slug kurzu. Sem přidáváme, jak přicházejí obrázky/videa k jednotlivým kurzům.
export type CourseMedia = {
  youtubeId?: string; // ID YouTube videa (ukázka ze školení)
  youtubeStart?: number; // volitelný start v sekundách
  gallery?: string[]; // cesty k obrázkům v /public
};

export const courseMedia: Record<string, CourseMedia> = {
  "zlate-osetreni-kleopatra": {
    youtubeId: "YW4wcLli8sk",
    youtubeStart: 6,
    gallery: ["/kurzy/kleopatra/1.png", "/kurzy/kleopatra/2.png", "/kurzy/kleopatra/3.png"],
  },
};
