# AGENT PROMPT — "Oltinoy Collection" Wholesale Fashion Platform

You are a senior full-stack engineer. Build a production-ready wholesale (optom) modest-fashion catalog + booking platform for the Uzbek brand **Oltinoy Collection**. Follow this spec exactly. Where the spec is silent, choose the simplest solution that preserves performance, SEO, and type safety. Work milestone by milestone (Section 17), committing after each with clear messages, and keep the app deployable at every milestone.

---

## 1. Business Context

- Oltinoy Collection is a Tashkent-based brand with its **own sewing workshop (tikuv sexi)**. New dresses/abayas/rumol collections drop **weekly**.
- Sales model: **B2B wholesale (optom)**. Buyers are resellers ("optomchilar") across Uzbekistan. Current sales run through a Telegram channel; physical store: **BEK BARAKA bozori, 12-qator, 473-do'kon, Tashkent**. Phone: **+998 97 423 81 41**. Orders TG: **@oltinoy_shopping**.
- Products: abayas, dresses (ko'ylak), headscarf sets (rumol). Standard sizes **46–56**. Wholesale price displayed publicly (e.g. "140 000 so'm ~ OPTOM").
- Goal of the site: (1) rank at the top of **Google, Yandex, and AI answer engines (ChatGPT/Perplexity/Gemini/Claude)** for wholesale modest-fashion queries in Uzbek and Russian; (2) convert visitors into **bookings (bron)** delivered to the admin via a Telegram bot; (3) let admin publish a product once and have it auto-posted to the Telegram channel.
- **No online payments in this phase.** Booking = reservation request; admin confirms by phone/Telegram.
- Audience is ~89% mobile → **mobile-first is mandatory**.

## 2. Fixed Tech Stack (do not substitute)

| Layer | Choice |
|---|---|
| Framework | Next.js 15, App Router, TypeScript strict, React Server Components first |
| DB | PostgreSQL 16 (local on droplet) + Prisma ORM |
| Styling | Tailwind CSS v4 |
| i18n | next-intl (locales: `uz` default, `ru`), `localePrefix: 'as-needed'` |
| Auth (admin only) | Auth.js v5 (credentials provider, bcrypt) |
| Validation | zod everywhere (server actions, API routes, env) |
| Telegram | grammY (separate long-polling process for updates; `Api` class called directly from Next server actions for outbound messages) |
| Images | sharp pipeline on upload, files stored on droplet disk, served by Nginx |
| Infra | DigitalOcean droplet (Ubuntu 24.04), Nginx reverse proxy + TLS (certbot), PM2 (`web` + `bot` processes), pm2-logrotate |
| Analytics | Google Analytics 4 + Yandex.Metrika (both injected via env IDs, loaded with `next/script` `strategy="afterInteractive"`) |

No Docker. No external object storage. No payment providers. No Redis (in-memory rate limiting + Nginx `limit_req` is enough at this scale).

## 3. High-Level Architecture

```
                        ┌─────────────────────────────────────────┐
                        │        DigitalOcean Droplet             │
   Visitor ── HTTPS ──▶ │  Nginx :443                             │
                        │   ├── /uploads/*  → disk (immutable)    │
                        │   └── proxy → Next.js :3000 (PM2 "web") │
                        │         │                               │
                        │         ├── Prisma ──▶ PostgreSQL 16    │
                        │         └── grammY Api (outbound msgs)──┼──▶ Telegram
                        │                                         │    ├─ Admin chat (booking alerts)
                        │  PM2 "bot" (grammY long polling) ◀──────┼────┤─ Channel (auto-posts)
                        │         └── Prisma ──▶ PostgreSQL       │    └─ Subscribers (/start)
                        └─────────────────────────────────────────┘
```

- **Outbound** Telegram messages (booking alert, channel auto-post, broadcast) are sent synchronously from Next server actions using `new Api(BOT_TOKEN)` — no bot instance needed in the web process.
- **Inbound** updates (inline-button callbacks, /start, /stop, admin commands) are handled by the separate `bot` PM2 process. Both processes share the same Prisma client package and `DATABASE_URL`.

## 4. Repository Structure

```
oltinoy/
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── layout.tsx            # html lang, fonts, JSON-LD Organization+WebSite
│   │   │   ├── page.tsx              # Home
│   │   │   ├── katalog/
│   │   │   │   ├── page.tsx          # all products + filters
│   │   │   │   └── [category]/page.tsx
│   │   │   ├── mahsulot/[slug]/page.tsx
│   │   │   ├── blog/page.tsx
│   │   │   ├── blog/[slug]/page.tsx
│   │   │   ├── biz-haqimizda/page.tsx
│   │   │   ├── aloqa/page.tsx
│   │   │   └── (admin)/admin/...     # protected group, own layout, ALWAYS uz
│   │   ├── api/
│   │   │   ├── booking/route.ts      # POST create booking (rate-limited)
│   │   │   ├── view/route.ts         # POST beacon: increment viewCount
│   │   │   └── upload/route.ts       # admin image upload (auth-guarded)
│   │   ├── sitemap.ts
│   │   ├── robots.ts
│   │   ├── llms.txt/route.ts
│   │   ├── manifest.ts
│   │   └── icon.png / apple-icon.png / opengraph-image.png (brand fallback)
│   ├── bot/
│   │   ├── index.ts                  # long-polling entry (PM2 "bot")
│   │   └── handlers/ (start, callbacks, adminCommands)
│   ├── components/ (ui/, catalog/, booking/, admin/, seo/JsonLd.tsx)
│   ├── lib/ (db.ts, telegram.ts, images.ts, seo.ts, ratelimit.ts, format.ts, env.ts)
│   ├── i18n/ (routing.ts, request.ts)
│   └── messages/ (uz.json, ru.json)
├── ecosystem.config.cjs
├── deploy/ (nginx.conf, deploy.sh, backup.sh, setup-server.md)
├── .env.example
└── README.md                          # ops runbook
```

## 5. Database Schema (authoritative — implement exactly)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum ProductStatus {
  ACTIVE
  SOLD_OUT
  HIDDEN
}

enum BookingStatus {
  NEW
  CONFIRMED
  CONTACTED
  CANCELLED
  COMPLETED
}

model Category {
  id        Int       @id @default(autoincrement())
  slug      String    @unique          // "abaya", "koylak", "rumol"
  nameUz    String
  nameRu    String
  sortOrder Int       @default(0)
  isActive  Boolean   @default(true)
  products  Product[]
}

model Product {
  id            Int            @id @default(autoincrement())
  slug          String         @unique          // from nameUz, transliterated, unique-suffixed
  sku           String?        @unique          // e.g. "A-102"
  nameUz        String
  nameRu        String
  descriptionUz String?        @db.Text
  descriptionRu String?        @db.Text
  materialUz    String?                          // "Gulli qismi PRADO & Adnatonisi XB LION"
  materialRu    String?
  price         Int                              // UZS wholesale, e.g. 140000
  oldPrice      Int?
  sizes         String[]                         // ["46","48","50","52","54","56"]
  minOrderQty   Int            @default(1)
  status        ProductStatus  @default(ACTIVE)
  isNew         Boolean        @default(true)
  viewCount     Int            @default(0)
  categoryId    Int
  category      Category       @relation(fields: [categoryId], references: [id])
  images        ProductImage[]
  bookings      Booking[]
  tgMessageIds  Int[]          @default([])      // channel post ids (media group)
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt

  @@index([status, categoryId, createdAt])
}

model ProductImage {
  id        Int     @id @default(autoincrement())
  productId Int
  product   Product @relation(fields: [productId], references: [id], onDelete: Cascade)
  fileName  String  // base name without extension; variants derived (see §11)
  width     Int     // of the "lg" variant
  height    Int
  sortOrder Int     @default(0)
  altUz     String?
  altRu     String?
}

model Booking {
  id               Int           @id @default(autoincrement())
  productId        Int
  product          Product       @relation(fields: [productId], references: [id])
  size             String
  quantity         Int           @default(1)
  customerName     String
  phone            String        // normalized +998XXXXXXXXX
  tgUsername       String?
  note             String?
  status           BookingStatus @default(NEW)
  adminNote        String?
  adminTgMessageId Int?          // message id in admin chat, for editing on status change
  createdAt        DateTime      @default(now())
  updatedAt        DateTime      @updatedAt

  @@index([status, createdAt])
}

model AdminUser {
  id           Int      @id @default(autoincrement())
  username     String   @unique
  passwordHash String
  createdAt    DateTime @default(now())
}

model Subscriber {
  id         Int      @id @default(autoincrement())
  telegramId BigInt   @unique   // careful: serialize as string in any JSON
  firstName  String?
  username   String?
  isActive   Boolean  @default(true)
  createdAt  DateTime @default(now())
}

model Post {
  id          Int       @id @default(autoincrement())
  slug        String    @unique
  titleUz     String
  titleRu     String
  excerptUz   String?
  excerptRu   String?
  contentUz   String    @db.Text   // markdown, rendered server-side
  contentRu   String    @db.Text
  coverImage  String?
  isPublished Boolean   @default(false)
  publishedAt DateTime?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model Setting {
  key   String @id     // "phone", "addressUz", "addressRu", "tgChannelUrl", "tgOrderUsername", "instagramUrl", "mapUrl"
  value String @db.Text
}
```

## 6. i18n & URL Strategy

- `uz` is default with **no prefix**; Russian lives under `/ru/...`. Same slugs in both locales (slugs generated from Uzbek names, Latin transliteration, lowercase, hyphens).
- Every public page declares `alternates.languages` (`uz`, `ru`, `x-default` → uz) and a self-referencing `canonical` via the Metadata API.
- All UI strings go through `messages/uz.json` and `messages/ru.json` — no hardcoded copy in components. Uzbek is the source of truth; write natural, sales-oriented copy (see tone in §15).
- Currency formatting helper: `140000 → "140 000 so'm"` (uz) / `"140 000 сум"` (ru). Dates in `Asia/Tashkent`.

## 7. Pages & Features

### 7.1 Public site

**Home `/`**
- Hero: brand statement — own sewing workshop, weekly new collections, wholesale prices. Primary CTA → catalog; secondary → Telegram channel.
- "Yangi kolleksiya" strip: latest 8 ACTIVE products.
- Category tiles (from DB).
- "Nega biz?" trust block: ✂️ o'z tikuv sexi (no middleman), 🔄 har hafta yangi modellar, 📦 optom narxlar, 🏬 Bek Barakadagi do'kon.
- FAQ accordion (content in §15) — rendered server-side, mirrored in FAQPage JSON-LD.
- Footer: address, phone (tel: link), Telegram links, categories, blog, language switcher.

**Catalog `/katalog` and `/katalog/[category]`**
- Grid (2 cols mobile / 4 desktop), each card: first image, name, price, size range, badges (`Yangi`, `Sotildi` overlay for SOLD_OUT).
- Filters via **URL searchParams** (shareable/indexable-safe): category, size, price min/max, sort (newest | price asc/desc | popular by viewCount). Filter UI is a small client component; the grid itself renders on the server.
- Pagination `?page=N` (24/page) with `rel=prev/next` semantics in metadata; filtered/paginated variants get `canonical` pointing to the clean category URL and `robots: index: false` when any filter param is present (category pages themselves are indexable).
- SOLD_OUT products remain visible (labelled), HIDDEN never rendered.

**Product `/mahsulot/[slug]`**
- Gallery: main image + thumbnails (client component, swipe on mobile, no heavy carousel lib).
- Name, SKU, price (large, "OPTOM NARX" label), oldPrice strikethrough if set, material, size chips, minOrderQty note, availability.
- **Booking form** (see 7.2) inline below the fold + sticky bottom CTA bar on mobile ("📩 Bron qilish").
- Secondary CTA: "Telegram orqali yozish" → `https://t.me/<tgOrderUsername>`.
- "O'xshash mahsulotlar": 4 from same category.
- Static params: `generateStaticParams` for ACTIVE+SOLD_OUT products; `revalidate = 3600`; on-demand `revalidateTag('products')` + `revalidatePath` fired by every admin mutation.
- View counter: tiny client beacon `navigator.sendBeacon('/api/view', {slug})` so the page stays fully static.

**Blog `/blog`, `/blog/[slug]`** — DB-backed markdown articles (admin-managed) for content SEO/AEO. Render markdown server-side (`marked` + sanitize). Article JSON-LD. Only `isPublished`.

**About `/biz-haqimizda`** — the workshop story, photos, "ishlab chiqaruvchidan to'g'ridan-to'g'ri" positioning.
**Contact `/aloqa`** — address, phone, hours, Telegram, embedded map link (from Settings), LocalBusiness JSON-LD lives here and on home.

### 7.2 Booking flow (core conversion path)

Form fields: size (chips, required, from product.sizes), quantity (number, min = product.minOrderQty), name (required), phone (required, mask `+998 __ ___ __ __`, normalize to `+998XXXXXXXXX`, validate with zod regex `^\+998\d{9}$`), Telegram username (optional), note (optional, 300 chars). Hidden **honeypot** field `website` — if filled, respond 200 but silently drop.

Server handling (`POST /api/booking`):
1. zod-validate; rate-limit **5 requests / 10 min per IP** (in-memory Map with TTL sweep) → 429 with friendly message.
2. Create `Booking` (status NEW).
3. Send admin alert via grammY `Api` (template §8.2) with inline keyboard; store returned `message_id` in `adminTgMessageId`.
4. If Telegram send fails, booking is still saved — log error, never fail the user.
5. Return success → UI swaps form for confirmation: "✅ Broningiz qabul qilindi! Tez orada operatorimiz siz bilan bog'lanadi." + channel link.

### 7.3 Admin panel `/admin` (Uzbek-only UI)

- Auth.js credentials; middleware protects `/admin/**` and `/api/upload`. Seed admin from `ADMIN_USERNAME` / `ADMIN_INITIAL_PASSWORD` env (bcrypt, cost 12). Login page `/admin/login`. No public registration.
- **Dashboard**: today's/this week's bookings count by status, total ACTIVE products, top 5 viewed products.
- **Products**: table (thumb, name, price, status, views, bookings count) + create/edit form:
  - fields per schema; slug auto-generated, editable; sizes as toggle chips 46–56; multi-image upload (drag-drop, reorder, set alt); markdown-free plain textareas for descriptions.
  - Buttons: `Saqlash`, `Saqlash va kanalga joylash 📣` (runs §8.3 auto-post; disabled with tooltip if already posted — tgMessageIds not empty; a separate `Qayta e'lon qilish` re-posts).
  - Status switcher ACTIVE/SOLD_OUT/HIDDEN. Every mutation calls `revalidateTag('products')`.
- **Bookings**: filterable table by status/date, inline status change (mirrors bot buttons — on change, edit the admin-chat TG message too), adminNote, phone as tel: link, product link.
- **Categories / Posts / Settings**: simple CRUD; Settings edits the `Setting` key-values listed in the schema comment.
- **Broadcast**: form (text + optional product picker to attach photo+link) → confirm screen showing recipient count → loop over active `Subscriber`s at **20 msg/sec** (sleep 50 ms), collect blocked users (403) and set `isActive=false`. Show result summary.

## 8. Telegram Bot Spec (grammY)

### 8.1 Processes & config
- `src/bot/index.ts` → long polling (`bot.start()`), PM2 process name `oltinoy-bot`. Web process never starts polling; it only uses `new Api(env.BOT_TOKEN)`.
- Env: `BOT_TOKEN`, `ADMIN_CHAT_ID` (admin group or personal chat), `CHANNEL_ID` (e.g. `@oltinoy_collection` or numeric `-100...`).
- All bot copy in Uzbek. Wrap every handler in try/catch with logged errors; the bot must never crash on a bad update (`bot.catch`).

### 8.2 New-booking alert → ADMIN_CHAT_ID

```
🆕 YANGI BRON  #B-{id}

📦 {product.nameUz}  (SKU: {sku})
📏 O'lcham: {size}   |   🔢 Soni: {quantity} dona
💰 Optom: {price} so'm  →  Jami: {price×qty} so'm

👤 {customerName}
📞 {phone}
✈️ @{tgUsername yoki "—"}
📝 {note yoki "—"}

🕐 {dd.MM.yyyy HH:mm} (Toshkent)
🔗 {SITE_URL}/mahsulot/{slug}
```

Inline keyboard (callback_data):
`✅ Tasdiqlash → bk:{id}:c` · `📞 Bog'lanildi → bk:{id}:t` · `❌ Bekor → bk:{id}:x`

Callback handler: update `Booking.status` (c→CONFIRMED, t→CONTACTED, x→CANCELLED), then `editMessageText` appending `\n\n➡️ HOLAT: {STATUS} ({admin first_name}, {HH:mm})` and swap keyboard to remaining sensible actions (a COMPLETED/CANCELLED booking gets no keyboard). Answer callback with a toast (`answerCallbackQuery`). Only users who are members of ADMIN_CHAT_ID may trigger callbacks — verify `callbackQuery.message.chat.id === ADMIN_CHAT_ID`.

### 8.3 Channel auto-post (triggered from admin panel)

`sendMediaGroup` to `CHANNEL_ID` with up to 10 product photos (use the `lg` JPEG variants, absolute URLs), caption on the first item:

```
✨ Oltinoy Collection ✨

🆕 {nameUz} sotuvga chiqdi 🔥

🧵 Materiali: {materialUz}
💯 NARXI ~ OPTOM: {price} so'm
📏 Razmer: STANDART {sizes joined "."}

📩 Bron qilish 👇
{SITE_URL}/mahsulot/{slug}

🏬 Bek Baraka 12-qator, 473-do'kon
☎️ {settings.phone}
```

Store returned message ids into `product.tgMessageIds`. This link-back from a channel with ~5k subscribers is also an SEO signal — always include the product URL.

### 8.4 Subscriber flow
- `/start`: upsert Subscriber (isActive=true), reply: greeting + what the bot does ("Yangi kolleksiya chiqqanda birinchilardan bo'lib xabar olasiz") + buttons: 🛍 Katalog (URL), ✈️ Kanal (URL).
- `/stop`: isActive=false + confirmation.
- Admin-chat-only commands: `/stats` → today's bookings by status, active products, subscriber count.

## 9. SEO / AEO — HARD REQUIREMENTS (this is the top priority of the project)

### 9.1 Rendering & indexing
1. Every public page is **server-rendered/static (ISR)**; zero content behind client-side fetching. View source must show full product data.
2. `app/sitemap.ts`: dynamic, includes home/catalog/categories/products/posts/static pages **in both locales** using the sitemap `alternates.languages` API; `lastModified` from `updatedAt`. Referenced in robots.
3. `app/robots.ts`: allow all; **explicitly allow AI crawlers** — `GPTBot`, `OAI-SearchBot`, `ChatGPT-User`, `ClaudeBot`, `Claude-Web`, `PerplexityBot`, `Google-Extended`, `YandexBot`, `Bingbot`. Disallow `/admin`, `/api`.
4. `app/llms.txt/route.ts` → plain-text/markdown summary for AI engines: who Oltinoy is (manufacturer + wholesaler, Tashkent, Bek Baraka), what it sells, price range, how to order (site booking / Telegram / phone), links to catalog, categories, FAQ, contact. Keep it under ~120 lines, factual, bilingual (uz section, then ru section).
5. Clean 404 with links back; 301 helpers if a slug changes (store no history — just never change slugs after publish; admin UI warns).

### 9.2 Structured data (JSON-LD via a typed `<JsonLd>` component, one script per entity)
- Site-wide: `Organization` (logo, sameAs: Telegram/Instagram), `WebSite` + `SearchAction` (catalog `?q=`… implement a simple name-search on /katalog to honor it).
- Home + /aloqa: `LocalBusiness` (`ClothingStore`) — name, address (streetAddress "Bek Baraka bozori, 12-qator, 473-do'kon", addressLocality "Tashkent", addressCountry "UZ"), telephone, openingHours, geo if available in Settings.
- Product pages: `Product` with `image[]`, `sku`, `material`, `brand`, `offers` → `Offer` (`priceCurrency: "UZS"`, `price`, `availability` mapped from status, `priceValidUntil` +30d, seller = Organization) + `BreadcrumbList`.
- Home FAQ: `FAQPage` matching the visible accordion exactly.
- Blog: `Article` (headline, datePublished, image, inLanguage).

### 9.3 Metadata
- `generateMetadata` on every route: unique title ≤ 60 chars, description 140–160 chars, both locales. Patterns:
  - Product: `"{nameUz} — optom {price} so'm | Oltinoy Collection"`
  - Category: `"{nameUz} optom narxlarda — Toshkent | Oltinoy Collection"`
- OpenGraph + Twitter card on all pages. **Product og:image = first product photo** (`lg` JPEG, absolute URL) — real photos beat generated cards for fashion CTR. Brand fallback image for other pages.
- `metadataBase` from `SITE_URL`. Verification meta tags for Google Search Console & Yandex.Webmaster via env (`GOOGLE_SITE_VERIFICATION`, `YANDEX_VERIFICATION`).

### 9.4 Content rules baked into templates
- H1 exactly once per page; semantic landmarks (`header/nav/main/footer`); breadcrumbs visible on catalog/product/blog.
- Every image gets meaningful `alt` (fallback: product name + category, per locale).
- Category pages render a 2–3 sentence indexable intro paragraph (from messages files) above the grid — not just a bare grid.
- Internal linking: product → category → home breadcrumb chain; related products block; footer links to all categories.

## 10. Performance Budget (enforced, not aspirational)

- Lighthouse (mobile, throttled) on Home / Catalog / Product: **Performance ≥ 95, SEO = 100, Best Practices ≥ 95, A11y ≥ 90**. LCP < 2.5 s, CLS < 0.05, INP < 200 ms.
- First-load JS on public pages **< 110 kB**. RSC by default; client components only: gallery, filters, booking form, language switcher, mobile nav, admin UI.
- `next/font/local` — self-host both families (no Google Fonts request), `display: swap`, preload the display face's Latin subset only.
- `next/image` everywhere, explicit width/height (no CLS), `priority` only on the LCP image, `sizes` attributes tuned for the 2-col mobile grid.
- No third-party scripts except GA4 + Metrika (`afterInteractive`). No UI kit, no carousel/slider libraries, no moment.js (use `Intl`).
- HTML responses must stay cacheable: no cookies on public pages, no dynamic APIs (`headers()`, `cookies()`) in public RSC trees.

## 11. Image Pipeline

Upload (admin, `/api/upload`, auth-guarded, max 15 MB/file, jpeg/png/webp only):
1. sharp: auto-rotate, strip EXIF/metadata.
2. Emit variants into `UPLOAD_DIR/products/`:
   - `{name}-lg.jpg` (1280w, q80) — also used for TG posts & og:image
   - `{name}-lg.webp`, `{name}-lg.avif`
   - `{name}-md.webp` (768w), `{name}-sm.webp` (384w, grid thumb)
3. `fileName` = `{cuid}` base; helper `imageUrl(fileName, size, format)` builds paths. A tiny custom `loader` for `next/image` maps requested widths → nearest variant so Next never re-optimizes at runtime (keeps CPU free on the droplet).
4. Deleting a product/image removes files from disk (best-effort).

## 12. Security & Robustness

- zod-validated `env.ts` — process refuses to boot with missing/invalid env.
- Admin: bcrypt(12), session cookie `httpOnly`+`secure`+`lax`, middleware guard, login rate-limit 5/15 min/IP, generic error message.
- Booking API: rate limit (§7.2), honeypot, input length caps, phone normalization; never echo Telegram errors to users.
- Upload: magic-byte sniffing (not just mimetype), randomized filenames, no user-controlled paths.
- Prisma only (no raw SQL). React escapes output; markdown from admin sanitized (`sanitize-html`) anyway.
- Nginx security headers (§13.2). `poweredByHeader: false`.
- Graceful shutdown handlers in both PM2 processes; global error logging to stdout (PM2 captures).

## 13. Infrastructure (DigitalOcean droplet)

### 13.1 Server layout
```
/var/www/oltinoy          # app repo (deploy user "deploy", not root)
/var/www/oltinoy/uploads  # UPLOAD_DIR (outside .next, survives builds)
/var/backups/oltinoy      # nightly pg_dump, 14-day rotation
```
Node 22 LTS via nvm · PostgreSQL 16 (localhost-only, dedicated `oltinoy` role/db, strong password) · UFW: allow 22/80/443 only · fail2ban for sshd.

### 13.2 Nginx (`deploy/nginx.conf` — adapt & symlink into sites-enabled)
```nginx
limit_req_zone $binary_remote_addr zone=booking:10m rate=6r/m;

server {
  listen 443 ssl http2;
  server_name oltinoy.uz www.oltinoy.uz;   # replace with real domain
  # certbot-managed ssl_certificate lines

  client_max_body_size 25m;
  gzip on; gzip_types text/plain text/css application/json application/javascript image/svg+xml; gzip_min_length 1024;

  add_header X-Content-Type-Options nosniff always;
  add_header Referrer-Policy strict-origin-when-cross-origin always;
  add_header X-Frame-Options SAMEORIGIN always;
  add_header Strict-Transport-Security "max-age=63072000; includeSubDomains" always;

  location /uploads/ {
    alias /var/www/oltinoy/uploads/;
    expires 365d;
    add_header Cache-Control "public, immutable";
    access_log off;
  }

  location /api/booking {
    limit_req zone=booking burst=4 nodelay;
    proxy_pass http://127.0.0.1:3000;
    include proxy_params;
  }

  location /_next/static/ {
    proxy_pass http://127.0.0.1:3000;
    include proxy_params;
    expires 365d;
    add_header Cache-Control "public, immutable";
  }

  location / {
    proxy_pass http://127.0.0.1:3000;
    include proxy_params;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
  }
}
server { listen 80; server_name oltinoy.uz www.oltinoy.uz; return 301 https://oltinoy.uz$request_uri; }
```
`www` → apex 301. Redirect handled at Nginx level.

### 13.3 PM2 (`ecosystem.config.cjs`)
```js
module.exports = {
  apps: [
    { name: "oltinoy-web", cwd: "/var/www/oltinoy", script: "node_modules/next/dist/bin/next",
      args: "start -p 3000", env: { NODE_ENV: "production" },
      max_memory_restart: "450M", time: true },
    { name: "oltinoy-bot", cwd: "/var/www/oltinoy", script: "dist/bot/index.js",
      env: { NODE_ENV: "production" }, max_memory_restart: "200M", time: true, restart_delay: 5000 },
  ],
};
```
Bot is compiled with `tsup src/bot/index.ts --format cjs -d dist/bot` in the build step.
**Mandatory** (past incident — unbounded PM2 logs filled the disk): install & configure `pm2-logrotate`: `max_size 10M`, `retain 14`, `compress true`, `rotateInterval "0 0 * * *"`. Document this in README.

### 13.4 Backups & deploy
- `deploy/backup.sh` + cron `0 3 * * *`: `pg_dump -Fc` → `/var/backups/oltinoy/db-$(date +%F).dump`, delete older than 14 days; weekly `tar` of `/uploads` (keep 4).
- `deploy/deploy.sh` (run as deploy user): `git pull → npm ci → prisma migrate deploy → npm run build (next build + tsup bot) → pm2 reload ecosystem.config.cjs → curl -f https://$DOMAIN/ || rollback note`. Zero manual steps besides running the script.
- `deploy/setup-server.md`: numbered first-time provisioning runbook (user, ufw, node, postgres, nginx, certbot, pm2 startup, cron).

## 14. Environment Variables (`.env.example` — every var documented)

```
DATABASE_URL=postgresql://oltinoy:CHANGE_ME@localhost:5432/oltinoy
SITE_URL=https://oltinoy.uz
BOT_TOKEN=123456:ABC...
ADMIN_CHAT_ID=-1001234567890
CHANNEL_ID=@oltinoy_collection
AUTH_SECRET=openssl-rand-base64-32
ADMIN_USERNAME=admin
ADMIN_INITIAL_PASSWORD=CHANGE_ME_STRONG
UPLOAD_DIR=/var/www/oltinoy/uploads
NEXT_PUBLIC_GA_ID=G-XXXXXXX
NEXT_PUBLIC_YM_ID=12345678
GOOGLE_SITE_VERIFICATION=
YANDEX_VERIFICATION=
```

## 15. Seed Data & Copy (prisma/seed.ts)

- Categories: `abaya / Abayalar / Абайи`, `koylak / Ko'ylaklar / Платья`, `rumol / Rumollar / Платки`, `toplam / To'plamlar / Комплекты`.
- Settings: phone `+998 97 423 81 41`; addressUz `Toshkent, Bek Baraka bozori, 12-qator, 473-do'kon`; addressRu equivalent; tgOrderUsername `oltinoy_shopping`; tgChannelUrl placeholder.
- 6 demo products across categories with realistic Uzbek names/materials/prices (139 000–165 000), sizes 46–56, placeholder images.
- Admin user from env.
- Home FAQ (also drives FAQPage JSON-LD), Uzbek originals + Russian translations:
  1. **Optom minimal buyurtma qancha?** — Har bir modelda minimal miqdor ko'rsatilgan; odatda 1 dona/razmerdan boshlab olish mumkin.
  2. **Bron qilsam nima bo'ladi?** — Saytda bron qoldirasiz, operatorimiz 1 ish kuni ichida telefon yoki Telegram orqali bog'lanib, buyurtmani tasdiqlaydi.
  3. **Viloyatlarga yuborasizlarmi?** — Ha, O'zbekistonning barcha viloyatlariga yetkazib berish xizmatlari orqali yuboramiz.
  4. **To'lov qanday?** — Hozircha to'lov buyurtma tasdiqlangandan so'ng kelishilgan usulda amalga oshiriladi (naqd / karta orqali).
  5. **Mahsulotlar o'zingiznikimi?** — Ha, barcha modellar o'z tikuv sexrimizda tikiladi — shu sababli narxlar optom va sifat nazoratimizda.
  6. **Yangi modellar qachon chiqadi?** — Har hafta yangi kolleksiya chiqaramiz. Birinchilardan bilish uchun Telegram botimizga obuna bo'ling.
- 2 seed blog posts (uz+ru), written for AEO: "Abaya optom olishda nimalarga e'tibor berish kerak" and "2026-yil kuzgi modest fashion trendlari" (~400 words each, natural keyword use: *abaya optom, ko'ylak optom Toshkent, hijob kiyimlar optom, musulmoncha liboslar*).

## 16. Design Direction

Act as the design lead of a small studio: deliberate, specific to this brand, nothing that reads as a generic template.

- **Subject**: a family atelier selling elegant modest fashion wholesale. Audience: women resellers 22–45, on phones, deciding fast. The page's single job: make the weekly drop feel desirable and make "Bron qilish" effortless.
- **Palette** (derive everything from these): `#14161F` ink-navy (from the channel's dark posts), `#F7F3EC` warm ivory (fabric), `#C9A227` oltin/gold (brand name — use sparingly: logo, price, active states), `#8A6F4D` muted bronze (secondary), `#2E5E4E` deep sage for success states. Light theme, ink-navy for header/footer.
- **Type**: characterful high-contrast serif for display (self-hosted, e.g. Fraunces or Prata — must cover Uzbek Latin diacritics: oʻ, gʻ, ʼ) + clean grotesk body (e.g. Manrope). Prices set in the display face — price *is* the product in optom.
- **Signature element**: a subtle stitched/seam motif — a fine dashed gold rule used as section divider and under the active nav item, echoing the sewing workshop. This is the one flourish; keep everything else quiet and disciplined.
- Product photography dominates; UI recedes. Generous whitespace, 2-col mobile grid, sticky mobile booking bar. Visible keyboard focus, `prefers-reduced-motion` respected, tap targets ≥ 44 px. No numbered-step decorations, no gradient-hero clichés.

## 17. Milestones & Definition of Done

**M1 — Foundation**: repo scaffold, Tailwind v4, next-intl routing, Prisma schema + migrate + seed, env validation, base layout (header/footer/lang switcher), fonts. DoD: `npm run dev` shows localized shell in uz & ru.

**M2 — Catalog**: home, catalog + category + filters + pagination + search, product page + gallery, related products, view beacon. DoD: full catalog browsable from seed data, view-source shows complete content.

**M3 — Booking + Bot**: booking form/API with rate-limit + honeypot, grammY bot process, admin alert with working inline status buttons, /start–/stop subscribers, /stats. DoD: a booking placed on the site changes status from a Telegram button press and the message edits itself.

**M4 — Admin**: auth, dashboard, product CRUD with upload pipeline (§11), channel auto-post, bookings table synced with bot, categories/posts/settings CRUD, broadcast. DoD: publish a product with photos from the panel → it appears on site instantly (revalidation) and posts to the channel.

**M5 — SEO/AEO + Performance**: every item in §9 checked one by one; JSON-LD validates in Google Rich Results test; sitemap/robots/llms.txt live; Lighthouse budget in §10 met (include the report). DoD: checklist table in README with ✅ per item.

**M6 — Ops**: nginx conf, ecosystem, pm2-logrotate, backup cron, deploy.sh, setup-server.md, README runbook (deploy, rollback, backup restore, log locations, adding an admin). DoD: fresh-droplet install possible by following setup-server.md alone.

**Global quality bar**: TypeScript strict with no `any`; zod on every boundary; loading/empty/error states for every list & form; all copy through messages files; conventional commits per feature; no console errors; works on 360 px-wide viewport.

## 18. Out of Scope (Phase 2 — do not build now, but don't block)

Online payments (Payme/Click), reseller accounts with gated pricing & volume discounts, Telegram Mini App storefront, PDF wholesale catalog export, multi-admin roles. Keep the schema/architecture friendly to these (e.g. Booking already has statuses; prices live in one place).
