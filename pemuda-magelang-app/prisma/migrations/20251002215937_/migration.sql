/*
  Warnings:

  - You are about to drop the column `views` on the `Article` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Article" DROP COLUMN "views";

-- CreateTable
CREATE TABLE "public"."TrackView" (
    "id" SERIAL NOT NULL,
    "ip" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,

    CONSTRAINT "TrackView_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."TrackView" ADD CONSTRAINT "TrackView_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "public"."Article"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
