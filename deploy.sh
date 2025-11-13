#!/usr/bin/env bash
set -euo pipefail

APPDIR="/home/deploy/apps/pemuda"
WEBROOT="/var/www/next_static"    # target static files (site)
UPLOADS="/var/www/uploads"        # keep uploads intact
PM2_APP="pemuda"
ECOSYS="$APPDIR/ecosystem.config.js"

echo ">>> Deploy start: $(date -u)"
cd "$APPDIR"

echo ">>> Install deps"
npm ci --prefer-offline --no-audit --progress=false

echo ">>> Build"
npm run build

# Export if script exists
if npm run | grep -q "export"; then
  echo ">>> Running npm run export"
  npm run export
fi

# Backup old webroot
sudo mkdir -p /var/backups/pemuda
if [ -d "$WEBROOT" ]; then
  TIMESTAMP=$(date +%s)
  sudo mv "$WEBROOT" /var/backups/pemuda/last."$TIMESTAMP"
fi

# Recreate target webroot and copy export output
sudo mkdir -p "$WEBROOT"
sudo rm -rf "$WEBROOT"/*

# Copy export output only if it exists (does not touch $UPLOADS)
if [ -d "out" ]; then
  echo ">>> Copying exported static files to $WEBROOT"
  sudo cp -a out/. "$WEBROOT"/
fi

# Copy static assets if present (.next/static) into webroot/_next/static
if [ -d ".next/static" ]; then
  sudo mkdir -p "$WEBROOT/_next/static"
  sudo cp -a .next/static/. "$WEBROOT/_next/static/" || true
fi

# Ensure uploads dir exists and DO NOT remove or overwrite it
sudo mkdir -p "$UPLOADS"
sudo chown -R www-data:www-data "$UPLOADS"
sudo chmod -R 755 "$UPLOADS"

# Ensure webroot permissions (www-data)
sudo chown -R www-data:www-data "$WEBROOT"
sudo find "$WEBROOT" -type d -exec chmod 755 {} \;
sudo find "$WEBROOT" -type f -exec chmod 644 {} \;

echo ">>> Start/Reload pm2 app (startOrReload)"
pm2 startOrReload "$ECOSYS" --only "$PM2_APP"

echo ">>> Test nginx and reload"
sudo nginx -t && sudo systemctl reload nginx

echo ">>> Deploy finished: $(date -u)"
