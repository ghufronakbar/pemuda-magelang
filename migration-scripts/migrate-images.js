const fs = require('fs');
const path = require('path');
// [TAMBAH] Import CreateBucketCommand dan HeadBucketCommand
const { S3Client, PutObjectCommand, CreateBucketCommand, HeadBucketCommand } = require('@aws-sdk/client-s3');
const mime = require('mime-types');
const { glob } = require('glob');

const SOURCE_DIR = path.resolve(__dirname, '../old-backup/images');
const BUCKET_NAME = 'pemuda-uploads';

const S3_CONFIG = {
    endpoint: 'http://localhost:9000',
    region: 'us-east-1',
    credentials: {
        accessKeyId: 'minio_admin',
        secretAccessKey: '4saMitakaWangyy1919'
    },
    forcePathStyle: true
};

const s3Client = new S3Client(S3_CONFIG);

// [BARU] Fungsi untuk memastikan Bucket ada
async function ensureBucketExists() {
    try {
        // Cek apakah bucket ada
        await s3Client.send(new HeadBucketCommand({ Bucket: BUCKET_NAME }));
        console.log(`✅ Bucket '${BUCKET_NAME}' sudah ada.`);
    } catch (error) {
        if (error.name === 'NotFound' || error.$metadata?.httpStatusCode === 404) {
            console.log(`⚠️ Bucket '${BUCKET_NAME}' tidak ditemukan. Membuat baru...`);
            try {
                await s3Client.send(new CreateBucketCommand({ Bucket: BUCKET_NAME }));
                console.log(`✅ Bucket '${BUCKET_NAME}' berhasil dibuat.`);

                // [OPSIONAL] Set policy public di sini agak rumit via SDK, 
                // lebih mudah dilakukan manual atau via mc command jika perlu public read.
                // Tapi untuk restore, yang penting file masuk dulu.
            } catch (createError) {
                console.error("❌ Gagal membuat bucket:", createError);
                process.exit(1);
            }
        } else {
            console.error("❌ Error mengecek bucket:", error);
            process.exit(1);
        }
    }
}

async function migrate() {
    console.log(`🚀 Memulai migrasi gambar dari: ${SOURCE_DIR}`);

    // 1. Pastikan Bucket Ada
    await ensureBucketExists();

    const files = await glob('**/*.*', { cwd: SOURCE_DIR });
    console.log(`📦 Ditemukan ${files.length} file untuk diupload.`);

    let successCount = 0;
    let failCount = 0;

    for (const filePath of files) {
        try {
            const fullPath = path.join(SOURCE_DIR, filePath);
            const fileBuffer = fs.readFileSync(fullPath);
            const contentType = mime.lookup(fullPath) || 'application/octet-stream';

            const command = new PutObjectCommand({
                Bucket: BUCKET_NAME,
                Key: filePath,
                Body: fileBuffer,
                ContentType: contentType
            });

            await s3Client.send(command);
            // Ganti process.stdout dengan console log biar rapi
            // process.stdout.write(`✅ Uploaded: ${filePath}\n`); 
            successCount++;
        } catch (error) {
            console.error(`❌ Gagal upload ${filePath}:`, error.message);
            failCount++;
        }
    }

    console.log('\n--- RINGKASAN MIGRASI ---');
    console.log(`Total File: ${files.length}`);
    console.log(`Berhasil  : ${successCount}`);
    console.log(`Gagal     : ${failCount}`);
}

migrate();