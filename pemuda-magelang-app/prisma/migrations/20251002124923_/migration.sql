/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Community` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Community` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Community" ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Community_userId_key" ON "public"."Community"("userId");

-- AddForeignKey
ALTER TABLE "public"."Community" ADD CONSTRAINT "Community_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
