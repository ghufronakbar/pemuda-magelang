#!/bin/bash

# Konfigurasi
CONTAINER_NAME="pemuda_db"
DB_USER="akaneKurokawa"
DB_NAME="pemuda_db"
BACKUP_FILE="./old-backup/appdb-backup.sql" 

echo "--- Memulai Restore Database ---"

if [ ! -f "$BACKUP_FILE" ]; then
    echo "Error: File backup tidak ditemukan di $BACKUP_FILE"
    exit 1
fi

# 1. (BARU) DROP SCHEMA PUBLIC & CREATE ULANG
# Ini akan menghapus semua tabel yang dibuat otomatis oleh Prisma/Migrator
# Agar database benar-benar kosong sebelum diisi backup.
echo "⚠️  Menghapus schema lama (agar tidak bentrok)..."
docker exec -i $CONTAINER_NAME psql -U $DB_USER -d $DB_NAME -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"

# 2. Buat Role dummy 'app' (jika diperlukan oleh dump lama)
echo "Creating dummy role 'app'..."
docker exec -i $CONTAINER_NAME psql -U $DB_USER -d $DB_NAME -c "DO \$\$ BEGIN IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'app') THEN CREATE ROLE app; END IF; END \$\$;"
docker exec -i $CONTAINER_NAME psql -U $DB_USER -d $DB_NAME -c "GRANT app TO \"$DB_USER\";"

# 3. Eksekusi Restore
echo "Restoring data..."
# Tambahkan redirection error log agar terminal lebih bersih, atau biarkan untuk debug
cat "$BACKUP_FILE" | docker exec -i $CONTAINER_NAME psql -U $DB_USER -d $DB_NAME

echo "--- Restore Database Selesai ---"