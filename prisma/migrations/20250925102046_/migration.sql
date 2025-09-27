-- CreateEnum
CREATE TYPE "public"."Icon" AS ENUM ('heart', 'brain', 'globe', 'rocket', 'star', 'hand', 'smile', 'thumbsUp', 'thumbsDown', 'people', 'handshake', 'mapPin', 'sparkles', 'bookOpen', 'users', 'messageSquare', 'layers', 'grid');

-- CreateEnum
CREATE TYPE "public"."PartnerType" AS ENUM ('supported', 'collaborator', 'media');

-- CreateTable
CREATE TABLE "public"."AppData" (
    "id" TEXT NOT NULL,
    "heroTitle" TEXT NOT NULL,
    "heroDescription" TEXT NOT NULL,
    "heroImage" TEXT,
    "aboutTitle" TEXT NOT NULL,
    "aboutDescription" TEXT NOT NULL,
    "aboutImage" TEXT,
    "brandingTitle" TEXT NOT NULL,
    "brandingDescription" TEXT NOT NULL,
    "bradingVideo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AppData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."HeroItem" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "appDataId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HeroItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AboutItem" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "icon" "public"."Icon" NOT NULL,
    "appDataId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AboutItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Partner" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "href" TEXT NOT NULL,
    "type" "public"."PartnerType" NOT NULL,
    "appDataId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Partner_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."HeroItem" ADD CONSTRAINT "HeroItem_appDataId_fkey" FOREIGN KEY ("appDataId") REFERENCES "public"."AppData"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AboutItem" ADD CONSTRAINT "AboutItem_appDataId_fkey" FOREIGN KEY ("appDataId") REFERENCES "public"."AppData"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Partner" ADD CONSTRAINT "Partner_appDataId_fkey" FOREIGN KEY ("appDataId") REFERENCES "public"."AppData"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
