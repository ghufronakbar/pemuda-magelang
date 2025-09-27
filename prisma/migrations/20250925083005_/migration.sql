/*
  Warnings:

  - Added the required column `talentId` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Product" ADD COLUMN     "talentId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Product" ADD CONSTRAINT "Product_talentId_fkey" FOREIGN KEY ("talentId") REFERENCES "public"."Talent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
