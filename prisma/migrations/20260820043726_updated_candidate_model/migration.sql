/*
  Warnings:

  - You are about to drop the column `resumeUrl` on the `CandidateProfile` table. All the data in the column will be lost.
  - Added the required column `fileName` to the `Resume` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CandidateProfile" DROP COLUMN "resumeUrl";

-- AlterTable
ALTER TABLE "Resume" ADD COLUMN     "fileName" TEXT NOT NULL;
