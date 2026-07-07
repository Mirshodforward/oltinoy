# Oltinoy Collection

Wholesale (optom) modest-fashion katalog + booking platformasi. Next.js 15 (App Router) + PostgreSQL/Prisma + grammY Telegram bot. To'liq spec: [oltinoy-agent-prompt.md](oltinoy-agent-prompt.md).

## Tez boshlash (lokal)

```bash
npm install
cp .env.example .env        # DATABASE_URL va boshqa qiymatlarni to'ldiring
npx prisma migrate dev      # baza jadvallarini yaratadi
npm run db:seed             # demo kategoriya/mahsulot/admin/blog
npm run dev                 # http://localhost:3000
npm run dev:bot             # ikkinchi terminalda — Telegram botni ishga tushiradi
```

Admin panel: `/admin/login` — `.env` dagi `ADMIN_USERNAME` / `ADMIN_INITIAL_PASSWORD` bilan.

## Milestone holati

| # | Bosqich | Holat |
|---|---|---|
| M1 | Foundation (i18n, Prisma, dizayn tizimi) | ✅ |
| M2 | Katalog (home, katalog, mahsulot, blog, statik sahifalar) | ✅ |
| M3 | Booking + Bot (bron API, grammY, /start–/stop, /stats) | ✅ |
| M4 | Admin (auth, CRUD, upload, kanal auto-post, broadcast) | ✅ |
| M5 | SEO/AEO + Performance | ✅ (Lighthouse hisobotini production domenda qayta tekshiring) |
| M6 | Ops (nginx, PM2, backup, deploy) | ✅ |

### §9 SEO/AEO checklist

- ✅ Har bir public sahifa server-rendered/static (ISR), view-source to'liq kontent
- ✅ `app/sitemap.ts` — ikkala til, `alternates.languages`, `lastModified`
- ✅ `app/robots.ts` — AI crawlerlar (GPTBot, ClaudeBot, PerplexityBot va h.k.) ochiq, `/admin` `/api` yopiq
- ✅ `app/llms.txt/route.ts` — bilingual brend xulosasi
- ✅ JSON-LD: Organization, WebSite+SearchAction, LocalBusiness, Product+Offer+BreadcrumbList, FAQPage, Article
- ✅ Har bir route'da `generateMetadata` (unique title/description, canonical, alternates, OG/Twitter)
- ✅ Filtrlangan/qidiruv/paginatsiya URL'lari `noindex` + canonical toza URL'ga
- ✅ H1 bitta, semantik landmark'lar, breadcrumb'lar, mazmunli alt matnlar
- ⬜ Production domenda Google Rich Results Test va Lighthouse (mobile) hisobotini qo'shing

## Deploy (production)

Birinchi marta: [deploy/setup-server.md](deploy/setup-server.md) — nol-dan droplet sozlash (Node, PostgreSQL, Nginx, certbot, PM2, backup cron).

Keyingi har bir yangilanish uchun, `deploy` foydalanuvchisi sifatida `/var/www/oltinoy` ichida:

```bash
./deploy/deploy.sh
```

Bu skript: `git pull` → `npm ci` → `prisma migrate deploy` → `npm run build` (Next.js) → `pm2 reload` → health-check qiladi. Bot webhook orqali web ichida ishlagani uchun alohida qadam kerak emas (webhook faqat domen/token o'zgarganda `npm run bot:webhook` bilan qayta o'rnatiladi).

### Rollback

```bash
git log --oneline -5              # yaxshi ishlagan commitni toping
git checkout <sha>
npm ci
npx prisma migrate deploy         # ehtiyot bo'ling: yangi migratsiyalarni orqaga qaytarmaydi
npm run build
pm2 reload ecosystem.config.cjs
```

Baza sxemasi o'zgargan bo'lsa, avval `deploy/backup.sh` orqali olingan so'nggi dump'dan tiklashni ko'rib chiqing (pastga qarang).

### Backup / restore

Har kuni soat 03:00 da cron orqali `deploy/backup.sh` ishlaydi: `pg_dump -Fc` → `/var/backups/oltinoy/db-YYYY-MM-DD.dump` (14 kun saqlanadi), yakshanbalari `/uploads` arxivi (4 hafta saqlanadi).

Tiklash:

```bash
pm2 stop oltinoy-web oltinoy-bot
pg_restore -U oltinoy -h localhost -d oltinoy --clean --if-exists /var/backups/oltinoy/db-2026-01-01.dump
pm2 start ecosystem.config.cjs
```

Uploads arxivini tiklash:

```bash
tar -xzf /var/backups/oltinoy/uploads-2026-01-01.tar.gz -C /var/www/oltinoy/
```

### Log joylashuvlari

- PM2 ilova loglari: `~/.pm2/logs/oltinoy-web-*.log`, `~/.pm2/logs/oltinoy-bot-*.log` (`pm2-logrotate` bilan avto-rotatsiya: 10M, 14 kun, siqilgan)
- Ko'rish: `pm2 logs oltinoy-web` / `pm2 logs oltinoy-bot`
- Nginx: `/var/log/nginx/access.log`, `/var/log/nginx/error.log`
- Backup cron logi: `/var/log/oltinoy-backup.log`

### Yangi admin qo'shish

Hozircha bitta admin roli bor (Auth.js credentials). Yangi admin qo'shish uchun droplet'da:

```bash
cd /var/www/oltinoy
node -e "
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const db = new PrismaClient();
(async () => {
  const hash = await bcrypt.hash('YANGI_PAROL', 12);
  await db.adminUser.create({ data: { username: 'yangi_admin', passwordHash: hash } });
  console.log('Admin yaratildi');
  process.exit(0);
})();
"
```

## Muhim eslatmalar

- **PM2 loglar** — `pm2-logrotate` majburiy o'rnatilgan bo'lishi kerak (o'tgan hodisa: rotatsiyasiz loglar diskni to'ldirgan). `setup-server.md` §9 ga qarang.
- **Slug'lar** — mahsulot/post e'lon qilingandan keyin slug o'zgartirilmasin (SEO). Admin forma buni ogohlantiradi.
- **Rasm pipeline** — sharp orqali `lg`/`md`/`sm` variantlar avtomatik generatsiya qilinadi (`src/lib/images-server.ts`). Runtime'da qayta optimallashtirish yo'q — droplet CPU tejaladi.
- **Bitta jarayon (webhook)** — web (`oltinoy`) ham saytni beradi, ham Telegram update'larini (`/start`, callback) `POST /api/telegram` orqali qabul qiladi. Alohida bot jarayoni yo'q. Lokal dev'da esa polling ishlatiladi (`npm run dev:bot`, [src/bot/index.ts](src/bot/index.ts)).
