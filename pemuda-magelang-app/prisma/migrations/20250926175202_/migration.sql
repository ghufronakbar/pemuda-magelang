-- CreateEnum
CREATE TYPE "public"."ProductStatusEnum" AS ENUM ('draft', 'published', 'banned');

-- AlterTable
ALTER TABLE "public"."Product" ADD COLUMN     "status" "public"."ProductStatusEnum" NOT NULL DEFAULT 'published',
ALTER COLUMN "category" DROP DEFAULT;
