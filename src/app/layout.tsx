import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/layout/Providers";

export const metadata: Metadata = {
  title: {
    default: "Akademie Drsov – Členská platforma",
    template: "%s | Akademie Drsov",
  },
  description:
    "Profesionální vzdělávání v oboru kosmetiky a masáží. Neomezený přístup ke všem video kurzům, skriptům a materiálům.",
  keywords: ["kosmetika", "masáže", "kurzy", "akademie", "drsov", "vzdělávání"],
  openGraph: {
    type: "website",
    locale: "cs_CZ",
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: "Akademie Drsov",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="cs" suppressHydrationWarning>
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
