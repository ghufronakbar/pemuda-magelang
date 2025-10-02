-- AlterTable
ALTER TABLE "public"."Article" ADD COLUMN     "communityId" TEXT;

-- AddForeignKey
ALTER TABLE "public"."Article" ADD CONSTRAINT "Article_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "public"."Community"("id") ON DELETE SET NULL ON UPDATE CASCADE;
