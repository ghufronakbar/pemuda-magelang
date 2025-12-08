-- CreateEnum
CREATE TYPE "public"."CommunityStatusEnum" AS ENUM ('pending', 'approved', 'rejected', 'banned');

-- CreateTable
CREATE TABLE "public"."Community" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "profilePicture" TEXT,
    "bannerPicture" TEXT,
    "ctaText" TEXT NOT NULL,
    "ctaLink" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "status" "public"."CommunityStatusEnum" NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Community_pkey" PRIMARY KEY ("id")
);
