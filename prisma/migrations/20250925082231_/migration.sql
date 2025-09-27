-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('superadmin', 'admin', 'user');

-- CreateEnum
CREATE TYPE "public"."SocialMediaPlatform" AS ENUM ('instagram', 'twitter', 'facebook', 'youtube', 'linkedin', 'tiktok', 'website', 'email', 'phone', 'address', 'whatsapp', 'other');

-- CreateEnum
CREATE TYPE "public"."ArticleStatus" AS ENUM ('draft', 'published', 'banned');

-- AlterTable
ALTER TABLE "public"."Product" ADD COLUMN     "images" TEXT[],
ALTER COLUMN "price" DROP NOT NULL;

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "profilePicture" TEXT,
    "role" "public"."Role" NOT NULL DEFAULT 'user',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Talent" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "profession" TEXT NOT NULL,
    "industry" TEXT NOT NULL,
    "profilePicture" TEXT,
    "bannerPicture" TEXT,
    "description" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Talent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SocialMedia" (
    "id" TEXT NOT NULL,
    "platform" "public"."SocialMediaPlatform" NOT NULL,
    "url" TEXT NOT NULL,
    "talentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SocialMedia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Article" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "thumbnailImage" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "tags" TEXT[],
    "views" INTEGER NOT NULL DEFAULT 0,
    "status" "public"."ArticleStatus" NOT NULL DEFAULT 'draft',
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Article_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Talent_slug_key" ON "public"."Talent"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Talent_userId_key" ON "public"."Talent"("userId");

-- AddForeignKey
ALTER TABLE "public"."Talent" ADD CONSTRAINT "Talent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SocialMedia" ADD CONSTRAINT "SocialMedia_talentId_fkey" FOREIGN KEY ("talentId") REFERENCES "public"."Talent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Article" ADD CONSTRAINT "Article_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
