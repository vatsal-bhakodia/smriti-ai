-- DropForeignKey
ALTER TABLE "public"."Note" DROP CONSTRAINT "Note_topicId_fkey";
ALTER TABLE "public"."Note" DROP CONSTRAINT "Note_userId_fkey";

-- DropIndex
DROP INDEX "public"."Note_topicId_key";

-- DropTable
DROP TABLE "public"."Note";

