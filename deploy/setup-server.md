# Server sozlash — Oltinoy Collection (DigitalOcean droplet, Ubuntu 24.04)

Yangi droplet'da saytni ishga tushirish uchun quyidagi qadamlarni ketma-ket bajaring. Faqat shu fayl asosida to'liq o'rnatish mumkin bo'lishi kerak.

## 1. Tizim yangilash va asosiy paketlar

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git build-essential ufw fail2ban nginx postgresql postgresql-contrib
```

## 2. Deploy foydalanuvchisi yaratish (root emas)

```bash
sudo adduser deploy
sudo usermod -aG sudo deploy
su - deploy
```

Qolgan barcha qadamlarni `deploy` foydalanuvchisi ostida bajaring.

## 3. UFW (firewall)

```bash
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
sudo ufw status
```

## 4. fail2ban (SSH himoyasi)

```bash
sudo systemctl enable --now fail2ban
```

Standart sshd jail avtomatik yoqilgan bo'ladi — qo'shimcha sozlash shart emas.

## 5. Node.js 22 LTS (nvm orqali)

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
source ~/.bashrc
nvm install 22
nvm alias default 22
node -v   # v22.x
npm i -g pm2
```

## 6. PostgreSQL 16 — baza va foydalanuvchi

```bash
sudo -u postgres psql <<'SQL'
CREATE ROLE oltinoy WITH LOGIN PASSWORD 'CHANGE_ME_STRONG';
CREATE DATABASE oltinoy OWNER oltinoy;
SQL
```

PostgreSQL faqat `localhost`da tinglashini tekshiring (`/etc/postgresql/16/main/postgresql.conf` → `listen_addresses = 'localhost'`, standart holat).

## 7. Repo klonlash va env

```bash
sudo mkdir -p /var/www/oltinoy
sudo chown deploy:deploy /var/www/oltinoy
git clone <REPO_URL> /var/www/oltinoy
cd /var/www/oltinoy
cp .env.example .env
nano .env   # DATABASE_URL, SITE_URL, BOT_TOKEN, ADMIN_CHAT_ID, CHANNEL_ID,
            # AUTH_SECRET (openssl rand -base64 32), ADMIN_USERNAME/PASSWORD,
            # UPLOAD_DIR=/var/www/oltinoy/uploads, GA/Metrika ID'lari
mkdir -p /var/www/oltinoy/uploads/products
```

## 8. O'rnatish, migratsiya, seed, build

```bash
npm ci
npx prisma migrate deploy
npm run db:seed
npm run build
```

## 9. PM2 orqali ishga tushirish

```bash
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup systemd -u deploy --hp /home/deploy
# Yuqoridagi buyruq chiqargan `sudo env PATH=... pm2 startup ...` qatorini bajaring.
```

**Majburiy** — pm2-logrotate (disk to'lib qolgan holat oldini olish uchun):

```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 14
pm2 set pm2-logrotate:compress true
pm2 set pm2-logrotate:rotateInterval "0 0 * * *"
```

## 10. Nginx

```bash
sudo cp deploy/nginx.conf /etc/nginx/sites-available/oltinoycollection.uz
sudo ln -s /etc/nginx/sites-available/oltinoycollection.uz /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

## 11. Certbot (TLS)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx --redirect -d oltinoycollection.uz -d www.oltinoycollection.uz
sudo systemctl status certbot.timer   # avto-yangilanish yoqilganini tekshirish
```

Certbot HTTP blokka `listen 443 ssl` + sertifikat yo'llarini qo'shadi va HTTP→HTTPS
redirectni avtomatik sozlaydi. **Oldindan shart:** `oltinoycollection.uz` va
`www.oltinoycollection.uz` uchun DNS **A record** server IP'ga yo'naltirilgan bo'lishi kerak,
aks holda certbot domenni tasdiqlay olmaydi.

```bash
# tekshirish (ixtiyoriy):
dig +short oltinoycollection.uz   # server IP chiqishi kerak
```

## 12. Backup cron

```bash
chmod +x deploy/backup.sh deploy/deploy.sh
sudo mkdir -p /var/backups/oltinoy
sudo chown deploy:deploy /var/backups/oltinoy
crontab -e
# qo'shing:
# 0 3 * * * /var/www/oltinoy/deploy/backup.sh >> /var/log/oltinoy-backup.log 2>&1
```

## 13. Tekshirish

```bash
pm2 status                    # oltinoy-web va oltinoy-bot "online" bo'lishi kerak
curl -I https://oltinoycollection.uz/   # 200 OK
pm2 logs oltinoy-bot --lines 20   # bot @username bilan ishga tushganini ko'ring
```

Botga Telegram'da `/start` yuboring — javob kelishi kerak. Saytdan bron qoldirib, admin chatga xabar kelishini tekshiring.

Shu bilan birinchi marta o'rnatish yakunlanadi. Keyingi yangilanishlar uchun [../README.md](../README.md) dagi "Deploy" bo'limiga qarang.
