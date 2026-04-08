import { Metadata } from "next";
import CheckoutButton from "@/components/member/CheckoutButton";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Členství",
  description: "Získejte neomezený přístup ke všem kurzům a materiálům Akademie Drsov.",
};

const allFeatures = [
  "Neomezený přístup ke všem video kurzům",
  "Kompletní skripta a PDF ke stažení",
  "Mezinárodně uznávané certifikáty",
  "Kurzy o ozónování, masážích, kosmetice přístrojové",
  "Pravidelně přidávaný nový obsah",
  "Správa předplatného přes Stripe Portal",
  "Přístup na všech zařízeních",
  "20+ let odborného know-how",
];

export default function ClenstviPage() {
  return (
    <div className="bg-white">
      <section className="bg-navy py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Členství <span className="text-gold">Akademie Drsov</span>
          </h1>
          <p className="text-white/70 text-xl max-w-2xl mx-auto">
            Jeden poplatek. Neomezený přístup. Profesionální vzdělávání kdykoli a odkudkoli.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {/* Měsíční */}
            <div className="rounded-2xl border-2 border-gold bg-navy p-8 relative shadow-xl">
              <div className="absolute -top-3 left-8 bg-gold text-navy text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wide">
                Nejoblíbenější
              </div>
              <h2 className="text-xl font-bold text-white mb-1">Měsíční členství</h2>
              <p className="text-white/60 text-sm mb-6">Zrušit kdykoliv</p>
              <div className="mb-6">
                <span className="text-5xl font-bold text-white">999</span>
                <span className="text-white/60 text-lg ml-1">Kč / měsíc</span>
              </div>
              <CheckoutButton
                planKey="monthly"
                className="w-full bg-gold text-navy py-4 rounded-xl font-bold text-lg hover:bg-gold-dark transition-all block text-center"
              >
                Začít měsíční členství
              </CheckoutButton>
            </div>

            {/* Roční */}
            <div className="rounded-2xl border-2 border-green-400 p-8 relative">
              <div className="absolute -top-3 left-8 bg-green-500 text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wide">
                Ušetříte 2 000 Kč
              </div>
              <h2 className="text-xl font-bold text-navy mb-1">Roční členství</h2>
              <p className="text-gray-500 text-sm mb-6">Placeno jednou ročně</p>
              <div className="mb-2">
                <span className="text-5xl font-bold text-navy">9 990</span>
                <span className="text-gray-500 text-lg ml-1">Kč / rok</span>
              </div>
              <p className="text-green-600 text-sm font-medium mb-6">= 833 Kč / měsíc</p>
              <CheckoutButton
                planKey="yearly"
                className="w-full border-2 border-navy text-navy py-4 rounded-xl font-bold text-lg hover:bg-navy hover:text-white transition-all block text-center"
              >
                Začít roční členství
              </CheckoutButton>
            </div>
          </div>

          {/* Co je zahrnuto */}
          <div className="bg-gray-50 rounded-2xl p-8">
            <h3 className="text-xl font-bold text-navy mb-6">Oba plány zahrnují:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {allFeatures.map((f) => (
                <div key={f} className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-gold mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700">{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Zdarma */}
          <div className="mt-6 text-center">
            <p className="text-gray-500 mb-3">Chcete nejprve vyzkoušet?</p>
            <Link
              href="/registrace"
              className="inline-flex items-center gap-2 text-navy font-semibold border-2 border-navy px-6 py-3 rounded-xl hover:bg-navy hover:text-white transition-all"
            >
              Registrovat se a získat 2 kurzy zdarma
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
