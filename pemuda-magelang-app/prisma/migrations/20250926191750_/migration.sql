/*
  Warnings:

  - You are about to drop the column `isVerified` on the `Talent` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."TalentStatusEnum" AS ENUM ('pending', 'approved', 'rejected', 'banned');

-- AlterTable
ALTER TABLE "public"."Product" ALTER COLUMN "status" DROP DEFAULT;

-- AlterTable
ALTER TABLE "public"."Talent" DROP COLUMN "isVerified",
ADD COLUMN     "status" "public"."TalentStatusEnum" NOT NULL DEFAULT 'approved';
