-- CreateEnum
CREATE TYPE "EmploymentType" AS ENUM ('FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP');

-- CreateEnum
CREATE TYPE "WorkMode" AS ENUM ('REMOTE', 'HYBRID', 'ONSITE');

-- CreateEnum
CREATE TYPE "ExperienceLevel" AS ENUM ('ENTRY', 'MID', 'SENIOR', 'LEAD');

-- CreateEnum
CREATE TYPE "JobPostStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'CLOSED', 'ARCHIVED');

-- DropIndex
DROP INDEX "CompanyMember_userId_idx";

-- CreateTable
CREATE TABLE "JobPosts" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "responsibilities" TEXT[],
    "requirements" TEXT[],
    "employmentType" "EmploymentType" NOT NULL,
    "workMode" "WorkMode" NOT NULL,
    "location" TEXT,
    "minSalary" INTEGER,
    "maxSalary" INTEGER,
    "currency" TEXT DEFAULT 'USD',
    "experienceLevel" "ExperienceLevel" NOT NULL,
    "skills" TEXT[],
    "status" "JobPostStatus" NOT NULL DEFAULT 'DRAFT',
    "applicationDeadline" TIMESTAMP(3),
    "postedById" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobPosts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "JobPosts_slug_key" ON "JobPosts"("slug");

-- CreateIndex
CREATE INDEX "JobPosts_status_idx" ON "JobPosts"("status");

-- CreateIndex
CREATE INDEX "JobPosts_postedById_idx" ON "JobPosts"("postedById");

-- AddForeignKey
ALTER TABLE "JobPosts" ADD CONSTRAINT "JobPosts_postedById_fkey" FOREIGN KEY ("postedById") REFERENCES "CompanyMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "JobPosts" ADD CONSTRAINT "JobPosts_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
