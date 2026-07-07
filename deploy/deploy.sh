#!/usr/bin/env bash
# Zero-manual-step deploy. Run as the "deploy" user from /var/www/oltinoy:
#   ./deploy/deploy.sh
set -euo pipefail

APP_DIR="/var/www/oltinoy"
DOMAIN="${DOMAIN:-oltinoy.uz}"

cd "$APP_DIR"

echo "[deploy] $(date -Iseconds) pulling latest…"
git pull --ff-only

echo "[deploy] installing dependencies…"
npm ci

echo "[deploy] applying database migrations…"
npx prisma migrate deploy

echo "[deploy] building (next build + bot bundle)…"
npm run build

echo "[deploy] reloading PM2 processes…"
pm2 reload ecosystem.config.cjs --update-env

echo "[deploy] health check…"
sleep 3
if curl -fsS "https://$DOMAIN/" -o /dev/null; then
  echo "[deploy] ✅ https://$DOMAIN/ is responding"
else
  echo "[deploy] ⚠️  health check failed — inspect 'pm2 logs oltinoy-web' and consider:"
  echo "           git log --oneline -5   # find the previous good commit"
  echo "           git checkout <sha> && npm ci && npm run build && pm2 reload ecosystem.config.cjs"
  exit 1
fi

echo "[deploy] done."
