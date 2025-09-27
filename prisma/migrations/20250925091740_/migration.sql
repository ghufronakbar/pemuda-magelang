-- CreateEnum
CREATE TYPE "public"."HubStatus" AS ENUM ('active', 'inactive', 'soon');

-- CreateTable
CREATE TABLE "public"."HubCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HubCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Hub" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "status" "public"."HubStatus" NOT NULL DEFAULT 'active',
    "hubCategoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Hub_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Hub_slug_key" ON "public"."Hub"("slug");

-- AddForeignKey
ALTER TABLE "public"."Hub" ADD CONSTRAINT "Hub_hubCategoryId_fkey" FOREIGN KEY ("hubCategoryId") REFERENCES "public"."HubCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
