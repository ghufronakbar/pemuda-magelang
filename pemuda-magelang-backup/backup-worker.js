require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const cron = require('node-cron');
const nodemailer = require('nodemailer');
const cloudinary = require('cloudinary').v2;
const { S3Client, ListObjectsV2Command, GetObjectCommand } = require('@aws-sdk/client-s3');
const moment = require('moment');

// --- KONFIGURASI ---
const STATE_FILE = path.join(__dirname, 'state.json');
const TEMP_DIR = path.join(__dirname, 'temp');

// Config Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});

const S3_ENDPOINT = process.env.S3_ENDPOINT || 'http://minio:9000';

// [FIX] Pastikan folder temp ada
fs.mkdirSync(TEMP_DIR, { recursive: true });

// --- SETUP CLIENT ---

const s3 = new S3Client({
    region: 'us-east-1',
    endpoint: S3_ENDPOINT,
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_KEY,
    },
    forcePathStyle: true,
});

const mailer = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.BACKUP_NODEMAILER_EMAIL_USER,
        pass: process.env.BACKUP_NODEMAILER_EMAIL_PASS,
    },
});

// --- HELPER FUNCTIONS ---

function getLastSyncTime() {
    try {
        if (fs.existsSync(STATE_FILE) && fs.lstatSync(STATE_FILE).isFile()) {
            const content = fs.readFileSync(STATE_FILE, 'utf-8');
            if (!content.trim()) return new Date(0);
            const data = JSON.parse(content);
            return new Date(data.lastRun);
        }
    } catch (error) {
        console.warn("⚠️ Warning: Gagal membaca state.json, memulai full backup.");
    }
    return new Date(0);
}

function updateLastSyncTime() {
    try {
        fs.writeFileSync(STATE_FILE, JSON.stringify({ lastRun: new Date() }));
    } catch (error) {
        console.error("❌ Gagal update state.json:", error.message);
    }
}

async function sendNotification(status, details) {
    const subject = status === 'SUCCESS' || status === 'PARTIAL_SUCCESS'
        ? `✅ Laporan Backup: Pemuda Magelang [${moment().format('YYYY-MM-DD')}]`
        : `🚨 Backup GAGAL: Pemuda Magelang`;

    try {
        if (!process.env.BACKUP_NODEMAILER_EMAIL_USER) return;

        await mailer.sendMail({
            from: `"Backup Bot" <${process.env.BACKUP_NODEMAILER_EMAIL_USER}>`,
            to: process.env.BACKUP_NODEMAILER_EMAIL_TO,
            subject: subject,
            text: details,
        });
        console.log('📧 Notifikasi email terkirim.');
    } catch (e) {
        console.error('❌ Gagal kirim email:', e.message);
    }
}

async function uploadToCloudinary(filePath, folder, resourceType, publicId) {
    const options = {
        folder: folder,
        resource_type: resourceType,
        use_filename: true,
        unique_filename: false,
        overwrite: true
    };
    if (publicId) options.public_id = publicId;

    return await cloudinary.uploader.upload(filePath, options);
}

// --- CORE PROCESSES ---

async function backupDatabase() {
    console.log('🗄️ Memulai Backup Database...');
    const timestamp = moment().format('YYYY-MM-DD_HH-mm');
    const fileName = `db_backup_${timestamp}.sql.gz`;
    const filePath = path.join(TEMP_DIR, fileName);

    const cmd = `PGPASSWORD='${process.env.POSTGRES_PASSWORD}' pg_dump -h ${process.env.POSTGRES_HOST} -U ${process.env.POSTGRES_USER} -d ${process.env.POSTGRES_DB} | gzip > "${filePath}"`;

    await new Promise((resolve, reject) => {
        exec(cmd, (error) => {
            if (error) reject(error);
            else resolve();
        });
    });

    console.log(`📦 Database ter-dump. Mengupload ke Cloudinary...`);
    // Database selalu 'raw'
    await uploadToCloudinary(filePath, 'pemuda_magelang_backup/database', 'raw', fileName);

    console.log(`✅ Database OK: ${fileName}`);
    fs.unlinkSync(filePath);
    return fileName;
}

async function backupImages() {
    console.log('🖼️ Memulai Backup Images (Incremental)...');
    const lastSync = getLastSyncTime();
    const checkTime = new Date(lastSync.getTime() - 60000); // Toleransi 1 menit
    console.log(`⏳ Mencari file lebih baru dari: ${checkTime.toISOString()}`);

    const bucketName = process.env.S3_BUCKET_NAME;
    let successCount = 0;
    let failCount = 0;
    let skippedCount = 0;

    const command = new ListObjectsV2Command({ Bucket: bucketName });
    const response = await s3.send(command);

    if (!response.Contents) {
        console.log('ℹ️ Bucket kosong.');
        return { success: 0, failed: 0 };
    }

    for (const item of response.Contents) {
        // [LOGIC SKIP] Jika file lama, lewati
        if (item.LastModified <= checkTime) {
            continue;
        }

        console.log(`⬆️ Processing: ${item.Key}`);
        const tempFilePath = path.join(TEMP_DIR, item.Key.replace(/\//g, '_'));

        try {
            // 1. Download dari MinIO
            const getObj = await s3.send(new GetObjectCommand({ Bucket: bucketName, Key: item.Key }));
            const byteArray = await getObj.Body.transformToByteArray();

            // Cek File Kosong (0 Byte)
            if (byteArray.length === 0) {
                console.warn(`⚠️ File 0 Byte (Skipped): ${item.Key}`);
                skippedCount++;
                continue;
            }

            await fs.promises.writeFile(tempFilePath, Buffer.from(byteArray));

            // 2. Upload ke Cloudinary (Coba mode IMAGE dulu)
            try {
                await uploadToCloudinary(tempFilePath, 'pemuda_magelang_backup/images', 'image');
                console.log(`✅ Success (Image): ${item.Key}`);
                successCount++;
            } catch (cloudErr) {
                // [FALLBACK] Jika gagal sebagai image (error 400), coba sebagai RAW
                console.warn(`⚠️ Gagal sebagai Image, mencoba mode RAW... (${cloudErr.message})`);
                try {
                    await uploadToCloudinary(tempFilePath, 'pemuda_magelang_backup/images', 'raw');
                    console.log(`✅ Success (Raw Fallback): ${item.Key}`);
                    successCount++;
                } catch (rawErr) {
                    throw new Error(`Gagal Image & Raw: ${rawErr.message}`);
                }
            }

        } catch (error) {
            // [CATCH ERROR INSIDE LOOP] Agar loop tidak berhenti
            console.error(`❌ GAGAL FILE: ${item.Key} -> ${error.message}`);
            failCount++;
        } finally {
            // Selalu hapus file temp meskipun gagal/sukses
            if (fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);
        }
    }

    return { success: successCount, failed: failCount, skipped: skippedCount };
}

// --- MAIN RUNNER ---

async function runBackup() {
    console.log('🚀 === BACKUP JOB STARTED (ROBUST MODE) ===');
    const startTime = new Date();
    let dbStatus = 'SKIPPED/FAIL';
    let imgStats = { success: 0, failed: 0 };

    try {
        // 1. Backup DB (Jika DB gagal, script tetap lanjut coba backup gambar)
        try {
            dbStatus = await backupDatabase();
        } catch (dbErr) {
            console.error("🔥 Database Backup Failed:", dbErr.message);
            dbStatus = `GAGAL (${dbErr.message})`;
        }

        // 2. Backup Images
        imgStats = await backupImages();

        // 3. Update State (Hanya update jika setidaknya ada yang berhasil)
        updateLastSyncTime();

        const duration = (new Date() - startTime) / 1000;

        // Tentukan status global
        const globalStatus = (dbStatus.startsWith('GAGAL') || imgStats.failed > 0) ? 'PARTIAL_SUCCESS' : 'SUCCESS';

        const message = `
        Laporan Backup Harian
        ---------------------
        Status Global: ${globalStatus}
        Waktu: ${moment().format('DD/MM/YYYY HH:mm:ss')}
        Durasi: ${duration} detik
        
        [Database]
        File: ${dbStatus}
        
        [Images]
        Berhasil: ${imgStats.success}
        Gagal   : ${imgStats.failed}
        Skipped : ${imgStats.skipped} (0 byte / lama)
        
        Cek log server untuk detail file yang gagal.
        `;

        await sendNotification(globalStatus, message);
        console.log('✅ Job Selesai.');

    } catch (error) {
        // Error yang tidak terduga sama sekali
        console.error('🔥 ERROR CRITICAL (UNHANDLED):', error);
        await sendNotification('FAILURE', `CRITICAL ERROR: ${error.message}`);
    }
}

// --- SCHEDULER ---

if (process.argv.includes('--manual')) {
    runBackup();
} else {
    console.log('🕒 Backup Service Berjalan. Menunggu jadwal cron (02:00)...');
    cron.schedule('0 2 * * *', () => {
        runBackup();
    });
}