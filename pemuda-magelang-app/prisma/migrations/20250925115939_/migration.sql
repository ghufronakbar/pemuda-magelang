/*
  Warnings:

  - The `status` column on the `Article` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `Hub` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `type` on the `Partner` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `platform` on the `SocialMedia` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."SocialMediaPlatformEnum" AS ENUM ('instagram', 'twitter', 'facebook', 'youtube', 'linkedin', 'tiktok', 'website', 'email', 'phone', 'address', 'whatsapp', 'other');

-- CreateEnum
CREATE TYPE "public"."ArticleStatusEnum" AS ENUM ('draft', 'published', 'banned');

-- CreateEnum
CREATE TYPE "public"."HubStatusEnum" AS ENUM ('active', 'inactive', 'soon');

-- CreateEnum
CREATE TYPE "public"."PartnerTypeEnum" AS ENUM ('supported', 'collaborator', 'media');

-- AlterTable
ALTER TABLE "public"."Article" DROP COLUMN "status",
ADD COLUMN     "status" "public"."ArticleStatusEnum" NOT NULL DEFAULT 'draft';

-- AlterTable
ALTER TABLE "public"."Hub" DROP COLUMN "status",
ADD COLUMN     "status" "public"."HubStatusEnum" NOT NULL DEFAULT 'active';

-- AlterTable
ALTER TABLE "public"."Partner" DROP COLUMN "type",
ADD COLUMN     "type" "public"."PartnerTypeEnum" NOT NULL;

-- AlterTable
ALTER TABLE "public"."SocialMedia" DROP COLUMN "platform",
ADD COLUMN     "platform" "public"."SocialMediaPlatformEnum" NOT NULL;

-- DropEnum
DROP TYPE "public"."ArticleStatus";

-- DropEnum
DROP TYPE "public"."HubStatus";

-- DropEnum
DROP TYPE "public"."PartnerType";

-- DropEnum
DROP TYPE "public"."SocialMediaPlatform";
