/pemuda-magelang-infra/             <-- Root Project (Git Repo Utama)
├── docker-compose.yml              <-- Orkestrator utama
├── .env                            <-- Environment Variables RAHASIA (DB creds, MinIO keys)
│
├── nginx/                          <-- TAMBAHAN PENTING
│   ├── Dockerfile                  <-- (Opsional, jika butuh modul khusus)
│   └── default.conf                <-- Config routing (Nextjs vs MinIO)
│
├── pemuda-magelang-app/            <-- Next.js App
│   ├── Dockerfile
│   ├── .env.production             <-- Env untuk BUILD TIME (NEXT_PUBLIC_...)
│   └── ... (source code nextjs)
│
└── pemuda-magelang-backup/         <-- Backup Service
    ├── Dockerfile
    ├── backup-script.js            <-- Script Node.js Anda
    └── package.json


    