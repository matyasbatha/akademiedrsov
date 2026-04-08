# Akademie Drsov – Členská platforma

Vlastní členská platforma postavená na Next.js, Prisma, Stripe a Neon PostgreSQL.

## Stack

- **Next.js 15** (App Router, TypeScript)
- **Tailwind CSS** (barvy Akademie Drsov – námořní modrá + zlatá)
- **Prisma ORM** + **Neon PostgreSQL** (databáze)
- **NextAuth v5** (přihlášení e-mailem + Google)
- **Stripe** (měsíční/roční předplatné, Customer Portal, webhooks)
- **UploadThing** (nahrávání PDF a obrázků)
- **Vercel** (hosting)

---

## Rychlý start (lokální vývoj)

### 1. Vytvořte databázi na Neon

1. Jděte na [neon.tech](https://neon.tech) a registrujte se
2. Vytvořte nový projekt
3. Zkopírujte **Connection string** (postgresql://...)

### 2. Nastavte Stripe

1. Jděte na [dashboard.stripe.com](https://dashboard.stripe.com)
2. Vytvořte 2 produkty:
   - **Měsíční členství** → cena 999 Kč/měsíc → zkopírujte Price ID (price_...)
   - **Roční členství** → cena 9 990 Kč/rok → zkopírujte Price ID
3. Aktivujte **Customer Portal** v: Billing → Customer portal → Settings

### 3. Nastavte Google OAuth (volitelné)

1. [console.cloud.google.com](https://console.cloud.google.com)
2. Vytvořte projekt → APIs & Services → Credentials → OAuth 2.0
3. Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`

### 4. Nastavte UploadThing

1. [uploadthing.com](https://uploadthing.com) → registrace
2. Vytvořte app → zkopírujte token

### 5. Nastavte `.env`

Otevřete soubor `platform/.env` a vyplňte všechny hodnoty:

```env
DATABASE_URL="postgresql://..."    # z Neon
NEXTAUTH_SECRET="..."               # openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_MONTHLY_PRICE_ID="price_..."
STRIPE_YEARLY_PRICE_ID="price_..."
UPLOADTHING_TOKEN="..."
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
```

### 6. Spusťte databázové migrace

```bash
cd platform
npx prisma migrate dev --name init
```

### 7. Spusťte vývojový server

```bash
npm run dev
```

### 8. Nastavte Stripe webhooks lokálně

```bash
# Instalujte Stripe CLI: https://stripe.com/docs/stripe-cli
stripe login
stripe listen --forward-to localhost:3000/api/stripe/webhook
```
Zkopírujte `whsec_...` do `.env` jako `STRIPE_WEBHOOK_SECRET`.

### 9. Vytvořte admin účet

Po prvním spuštění se registrujte jako uživatel, pak spusťte v databázi:

```sql
UPDATE "User" SET role = 'ADMIN' WHERE email = 'vas@email.cz';
```

Nebo přes Prisma Studio:
```bash
npx prisma studio
```

---

## Nasazení na Vercel + Neon

### 1. Nahrajte projekt na GitHub

```bash
cd platform
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/VAS-GITHUB/akademie-drsov.git
git push -u origin main
```

### 2. Nasaďte na Vercel

1. [vercel.com](https://vercel.com) → Import Git Repository
2. Vyberte váš repozitář
3. **Root directory**: `platform`
4. Přidejte všechny environment proměnné (stejné jako v `.env`)
5. `NEXTAUTH_URL` = `https://vase-domena.cz`
6. `NEXT_PUBLIC_APP_URL` = `https://vase-domena.cz`
7. Klikněte Deploy

### 3. Spusťte migrace v produkci

Po prvním deployi spusťte migrace přes Vercel CLI nebo Neon Dashboard.

### 4. Nastavte doménu akademiedrsov.cz

1. Ve Vercel: Settings → Domains → Add domain → `akademiedrsov.cz`
2. Vercel vám ukáže DNS záznamy
3. V Websupport DNS nastavte:
   - `A` záznam pro `@` → IP adresa Vercelu (nebo CNAME)
   - `CNAME` pro `www` → `cname.vercel-dns.com`

### 5. Nastavte Stripe webhooks pro produkci

1. Stripe Dashboard → Developers → Webhooks → Add endpoint
2. URL: `https://akademiedrsov.cz/api/stripe/webhook`
3. Events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
4. Zkopírujte `whsec_...` do Vercel environment proměnných

### 6. Nastavte Google OAuth pro produkci

V Google Console přidejte:
- Authorized redirect URI: `https://akademiedrsov.cz/api/auth/callback/google`

---

## Struktura projektu

```
platform/
├── src/
│   ├── app/
│   │   ├── (public)/          # Veřejné stránky (/, /clenstvi)
│   │   ├── (auth)/            # Přihlášení, registrace
│   │   ├── (member)/          # Dashboard, kurzy, lekce, účet
│   │   ├── admin/             # Admin panel
│   │   └── api/               # API routes (auth, stripe, upload, admin)
│   ├── actions/               # Server Actions (auth, courses, admin)
│   ├── components/
│   │   ├── layout/            # Header, Footer, Providers
│   │   ├── member/            # CheckoutButton, VideoPlayer, atd.
│   │   └── admin/             # AdminUserActions, atd.
│   ├── lib/                   # prisma, auth, stripe, membership, utils
│   └── types/                 # NextAuth type extensions
├── prisma/
│   └── schema.prisma          # Databázový model
├── .env                       # Environment proměnné (neverzovat!)
└── README.md
```

---

## URL struktura

| URL | Přístup |
|-----|---------|
| `/` | Veřejná (landing page) |
| `/clenstvi` | Veřejná (ceník) |
| `/prihlaseni` | Veřejná |
| `/registrace` | Veřejná |
| `/dashboard` | Přihlášen |
| `/kurzy` | Přihlášen |
| `/kurzy/[slug]` | Člen (nebo free kurzy) |
| `/lekce/[slug]` | Člen (nebo free lekce) |
| `/ucet` | Přihlášen |
| `/admin` | Admin |
| `/admin/kurzy` | Admin |
| `/admin/uzivatele` | Admin |

---

## Jak přidat kurz (workflow)

1. Přihlaste se jako admin
2. Jděte na `/admin/kurzy` → **Nový kurz**
3. Vyplňte název, popis, cover obrázek
4. Přejděte na **Lekce** → přidejte lekce s Vimeo/YouTube URL
5. Zaškrtněte **Publikovaný** u kurzu i lekcí
6. Kurz se okamžitě zobrazí členům
