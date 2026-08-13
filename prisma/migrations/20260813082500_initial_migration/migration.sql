/*
  Warnings:

  - You are about to drop the column `role` on the `user` table. All the data in the column will be lost.
  - You are about to drop the `Application` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Company` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CompanyMember` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Job` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Notification` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RecruiterOpening` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RecruiterUpgradeRequest` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SavedJob` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Application" DROP CONSTRAINT "Application_candidateId_fkey";

-- DropForeignKey
ALTER TABLE "Application" DROP CONSTRAINT "Application_jobId_fkey";

-- DropForeignKey
ALTER TABLE "Application" DROP CONSTRAINT "Application_recruiterOpeningId_fkey";

-- DropForeignKey
ALTER TABLE "CompanyMember" DROP CONSTRAINT "CompanyMember_companyId_fkey";

-- DropForeignKey
ALTER TABLE "CompanyMember" DROP CONSTRAINT "CompanyMember_userId_fkey";

-- DropForeignKey
ALTER TABLE "Job" DROP CONSTRAINT "Job_companyId_fkey";

-- DropForeignKey
ALTER TABLE "Job" DROP CONSTRAINT "Job_companyMemberId_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_userId_fkey";

-- DropForeignKey
ALTER TABLE "RecruiterOpening" DROP CONSTRAINT "RecruiterOpening_companyId_fkey";

-- DropForeignKey
ALTER TABLE "RecruiterUpgradeRequest" DROP CONSTRAINT "RecruiterUpgradeRequest_companyId_fkey";

-- DropForeignKey
ALTER TABLE "RecruiterUpgradeRequest" DROP CONSTRAINT "RecruiterUpgradeRequest_reviewedById_fkey";

-- DropForeignKey
ALTER TABLE "RecruiterUpgradeRequest" DROP CONSTRAINT "RecruiterUpgradeRequest_userId_fkey";

-- DropForeignKey
ALTER TABLE "SavedJob" DROP CONSTRAINT "SavedJob_jobId_fkey";

-- DropForeignKey
ALTER TABLE "SavedJob" DROP CONSTRAINT "SavedJob_userId_fkey";

-- AlterTable
ALTER TABLE "user" DROP COLUMN "role";

-- DropTable
DROP TABLE "Application";

-- DropTable
DROP TABLE "Company";

-- DropTable
DROP TABLE "CompanyMember";

-- DropTable
DROP TABLE "Job";

-- DropTable
DROP TABLE "Notification";

-- DropTable
DROP TABLE "RecruiterOpening";

-- DropTable
DROP TABLE "RecruiterUpgradeRequest";

-- DropTable
DROP TABLE "SavedJob";

-- DropEnum
DROP TYPE "ApplicationStatus";

-- DropEnum
DROP TYPE "CompanySize";

-- DropEnum
DROP TYPE "ExperienceLevel";

-- DropEnum
DROP TYPE "JobCategory";

-- DropEnum
DROP TYPE "JobStatus";

-- DropEnum
DROP TYPE "JobType";

-- DropEnum
DROP TYPE "NotificationType";

-- DropEnum
DROP TYPE "RecruiterOpeningStatus";

-- DropEnum
DROP TYPE "RequestStatus";

-- DropEnum
DROP TYPE "Roles";
