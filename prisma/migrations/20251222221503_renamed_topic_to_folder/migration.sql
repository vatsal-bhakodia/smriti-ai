-- Rename table Topic to Folder
ALTER TABLE "public"."Topic" RENAME TO "Folder";

-- Rename column topicId to folderId in Resource table
ALTER TABLE "public"."Resource" RENAME COLUMN "topicId" TO "folderId";

-- Rename foreign key constraints
ALTER TABLE "public"."Folder" RENAME CONSTRAINT "Topic_userId_fkey" TO "Folder_userId_fkey";
ALTER TABLE "public"."Resource" RENAME CONSTRAINT "Resource_topicId_fkey" TO "Resource_folderId_fkey";

