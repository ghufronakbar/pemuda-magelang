/*
  Warnings:

  - Changed the type of `icon` on the `AboutItem` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."IconEnum" AS ENUM ('heart', 'brain', 'globe', 'rocket', 'star', 'hand', 'smile', 'thumbsUp', 'thumbsDown', 'people', 'handshake', 'mapPin', 'sparkles', 'bookOpen', 'users', 'messageSquare', 'layers', 'grid');

-- AlterTable
ALTER TABLE "public"."AboutItem" DROP COLUMN "icon",
ADD COLUMN     "icon" "public"."IconEnum" NOT NULL;

-- DropEnum
DROP TYPE "public"."Icon";
