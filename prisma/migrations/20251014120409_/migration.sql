-- AlterTable
ALTER TABLE "public"."AppData" ADD COLUMN     "baseLogo" TEXT NOT NULL DEFAULT '/static/logo.svg',
ADD COLUMN     "footerText" TEXT NOT NULL DEFAULT 'Platform kolaborasi untuk karya, komunitas, dan kegiatan kebudayaan.';
