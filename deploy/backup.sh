#!/usr/bin/env bash
# Nightly backup: pg_dump (custom format) + weekly uploads tarball.
# Cron (as deploy user): 0 3 * * * /var/www/oltinoy/deploy/backup.sh >> /var/log/oltinoy-backup.log 2>&1
set -euo pipefail

DB_NAME="oltinoy"
DB_USER="oltinoy"
BACKUP_DIR="/var/backups/oltinoy"
UPLOAD_DIR="/var/www/oltinoy/uploads"
KEEP_DAYS=14
KEEP_WEEKLY=4

mkdir -p "$BACKUP_DIR"

DATE="$(date +%F)"
DUMP_FILE="$BACKUP_DIR/db-$DATE.dump"

echo "[backup] $(date -Iseconds) starting pg_dump -> $DUMP_FILE"
pg_dump -Fc -U "$DB_USER" -h localhost "$DB_NAME" > "$DUMP_FILE"

echo "[backup] pruning db dumps older than $KEEP_DAYS days"
find "$BACKUP_DIR" -maxdepth 1 -name 'db-*.dump' -mtime +"$KEEP_DAYS" -delete

# Weekly uploads archive (Sunday only), keep last N.
if [ "$(date +%u)" = "7" ]; then
  ARCHIVE="$BACKUP_DIR/uploads-$DATE.tar.gz"
  echo "[backup] archiving uploads -> $ARCHIVE"
  tar -czf "$ARCHIVE" -C "$(dirname "$UPLOAD_DIR")" "$(basename "$UPLOAD_DIR")"

  echo "[backup] pruning uploads archives, keeping last $KEEP_WEEKLY"
  # shellcheck disable=SC2012
  ls -1t "$BACKUP_DIR"/uploads-*.tar.gz 2>/dev/null | tail -n +"$((KEEP_WEEKLY + 1))" | xargs -r rm -f
fi

echo "[backup] $(date -Iseconds) done"
