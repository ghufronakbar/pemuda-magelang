-- DropForeignKey
ALTER TABLE "public"."AboutItem" DROP CONSTRAINT "AboutItem_appDataId_fkey";

-- DropForeignKey
ALTER TABLE "public"."AppSocialMedia" DROP CONSTRAINT "AppSocialMedia_appDataId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Article" DROP CONSTRAINT "Article_communityId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Article" DROP CONSTRAINT "Article_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ArticleUserLike" DROP CONSTRAINT "ArticleUserLike_articleId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ArticleUserLike" DROP CONSTRAINT "ArticleUserLike_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Award" DROP CONSTRAINT "Award_talentId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Comment" DROP CONSTRAINT "Comment_articleId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Comment" DROP CONSTRAINT "Comment_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Community" DROP CONSTRAINT "Community_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Education" DROP CONSTRAINT "Education_talentId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Hub" DROP CONSTRAINT "Hub_hubCategoryId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Partner" DROP CONSTRAINT "Partner_appDataId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Product" DROP CONSTRAINT "Product_talentId_fkey";

-- DropForeignKey
ALTER TABLE "public"."SocialMedia" DROP CONSTRAINT "SocialMedia_talentId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Talent" DROP CONSTRAINT "Talent_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."TrackView" DROP CONSTRAINT "TrackView_articleId_fkey";

-- DropForeignKey
ALTER TABLE "public"."WorkExperience" DROP CONSTRAINT "WorkExperience_talentId_fkey";

-- AddForeignKey
ALTER TABLE "public"."Talent" ADD CONSTRAINT "Talent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."WorkExperience" ADD CONSTRAINT "WorkExperience_talentId_fkey" FOREIGN KEY ("talentId") REFERENCES "public"."Talent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Education" ADD CONSTRAINT "Education_talentId_fkey" FOREIGN KEY ("talentId") REFERENCES "public"."Talent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Award" ADD CONSTRAINT "Award_talentId_fkey" FOREIGN KEY ("talentId") REFERENCES "public"."Talent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SocialMedia" ADD CONSTRAINT "SocialMedia_talentId_fkey" FOREIGN KEY ("talentId") REFERENCES "public"."Talent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Article" ADD CONSTRAINT "Article_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Article" ADD CONSTRAINT "Article_communityId_fkey" FOREIGN KEY ("communityId") REFERENCES "public"."Community"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TrackView" ADD CONSTRAINT "TrackView_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "public"."Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ArticleUserLike" ADD CONSTRAINT "ArticleUserLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ArticleUserLike" ADD CONSTRAINT "ArticleUserLike_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "public"."Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Comment" ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Comment" ADD CONSTRAINT "Comment_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "public"."Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Product" ADD CONSTRAINT "Product_talentId_fkey" FOREIGN KEY ("talentId") REFERENCES "public"."Talent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Hub" ADD CONSTRAINT "Hub_hubCategoryId_fkey" FOREIGN KEY ("hubCategoryId") REFERENCES "public"."HubCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AboutItem" ADD CONSTRAINT "AboutItem_appDataId_fkey" FOREIGN KEY ("appDataId") REFERENCES "public"."AppData"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Partner" ADD CONSTRAINT "Partner_appDataId_fkey" FOREIGN KEY ("appDataId") REFERENCES "public"."AppData"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AppSocialMedia" ADD CONSTRAINT "AppSocialMedia_appDataId_fkey" FOREIGN KEY ("appDataId") REFERENCES "public"."AppData"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Community" ADD CONSTRAINT "Community_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
