-- AlterTable
ALTER TABLE "public"."AppData" ADD COLUMN     "pageFaq" TEXT NOT NULL DEFAULT '<p>Ini halaman faq</p>',
ADD COLUMN     "pagePrivacy" TEXT NOT NULL DEFAULT '<p>Ini halaman privacy</p>',
ADD COLUMN     "pageTerms" TEXT NOT NULL DEFAULT '<p>Ini halaman terms</p>';

-- CreateTable
CREATE TABLE "public"."AppSocialMedia" (
    "id" TEXT NOT NULL,
    "platform" "public"."SocialMediaPlatformEnum" NOT NULL,
    "url" TEXT NOT NULL,
    "appDataId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AppSocialMedia_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."AppSocialMedia" ADD CONSTRAINT "AppSocialMedia_appDataId_fkey" FOREIGN KEY ("appDataId") REFERENCES "public"."AppData"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
