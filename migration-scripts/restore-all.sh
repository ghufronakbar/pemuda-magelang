#!/bin/bash

# ==========================================
# MASTER RESTORE SCRIPT - PEMUDA MAGELANG
# ==========================================
# Script ini akan:
# 1. Restore Database (PostgreSQL)
# 2. Restore Gambar (MinIO)
# 3. Fix Permission Bucket (Public Read)
# ==========================================

# Pastikan script dijalankan dari root project
if [ ! -d "./migration-scripts" ]; then
    echo "❌ Error: Harap jalankan script dari root folder project!"
    echo "   Contoh: ./migration-scripts/restore-all.sh"
    exit 1
fi

echo "🚀 === MEMULAI PROSES TOTAL RESTORE === 🚀"
echo ""

# --- STEP 1: RESTORE DATABASE ---
echo "🔹 [STEP 1/3] Menjalankan Restore Database..."
chmod +x ./migration-scripts/restore-db.sh
./migration-scripts/restore-db.sh

if [ $? -ne 0 ]; then
    echo "❌ Gagal saat restore database. Proses dihentikan."
    exit 1
fi
echo "✅ Database restored."
echo ""

# --- STEP 2: RESTORE GAMBAR ---
echo "🔹 [STEP 2/3] Menjalankan Migrasi Gambar ke MinIO..."
# Kita jalankan node script yang sudah Anda buat (pastikan path benar)
node migration-scripts/migrate-images.js

if [ $? -ne 0 ]; then
    echo "❌ Gagal saat migrasi gambar. Proses dihentikan."
    exit 1
fi
echo "✅ Gambar uploaded."
echo ""

# --- STEP 3: FIX PERMISSION (PUBLIC READ) ---
echo "🔹 [STEP 3/3] Memastikan Policy Bucket Public..."

# Kita gunakan docker compose run untuk menjalankan perintah 'mc' (MinIO Client)
# Ini memastikan bucket 'pemuda-uploads' bisa diakses publik (download) tanpa login.
docker compose run --rm --entrypoint /bin/sh minio-setup -c "
    /usr/bin/mc alias set myminio http://minio:9000 \${MINIO_ROOT_USER} \${MINIO_ROOT_PASSWORD}; 
    /usr/bin/mc anonymous set download myminio/\${S3_BUCKET_NAME}; 
    exit
"

if [ $? -ne 0 ]; then
    echo "❌ Gagal setting policy bucket."
    exit 1
fi
echo "✅ Bucket Policy Updated (Public Read)."
echo ""

echo "🎉 === SEMUA PROSES SELESAI! === 🎉"
echo "Silakan cek website: http://pemuda.magelangkota.go.id"