/*
  Warnings:

  - You are about to drop the `InterviewQuestion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `InterviewQuiz` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `InterviewResult` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "InterviewQuestion" DROP CONSTRAINT "InterviewQuestion_quizId_fkey";

-- DropForeignKey
ALTER TABLE "InterviewQuiz" DROP CONSTRAINT "InterviewQuiz_userId_fkey";

-- DropForeignKey
ALTER TABLE "InterviewResult" DROP CONSTRAINT "InterviewResult_quizId_fkey";

-- DropForeignKey
ALTER TABLE "InterviewResult" DROP CONSTRAINT "InterviewResult_userId_fkey";

-- DropTable
DROP TABLE "InterviewQuestion";

-- DropTable
DROP TABLE "InterviewQuiz";

-- DropTable
DROP TABLE "InterviewResult";
