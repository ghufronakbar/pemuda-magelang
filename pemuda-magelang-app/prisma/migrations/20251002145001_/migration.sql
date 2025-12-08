/*
  Warnings:

  - You are about to drop the `HeroItem` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."HeroItem" DROP CONSTRAINT "HeroItem_appDataId_fkey";

-- DropTable
DROP TABLE "public"."HeroItem";
