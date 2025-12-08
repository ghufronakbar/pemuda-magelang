-- CreateEnum
CREATE TYPE "public"."ArticleTypeEnum" AS ENUM ('detak', 'gerak', 'dampak');

-- AlterTable
ALTER TABLE "public"."Article" ADD COLUMN     "type" "public"."ArticleTypeEnum" NOT NULL DEFAULT 'gerak';
