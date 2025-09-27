/*
  Warnings:

  - You are about to drop the column `bradingVideo` on the `AppData` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."AppData" DROP COLUMN "bradingVideo",
ADD COLUMN     "brandingVideo" TEXT;
