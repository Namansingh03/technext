-- CreateEnum
CREATE TYPE "RecruiterOpeningStatus" AS ENUM ('DRAFT', 'ACTIVE', 'CLOSED', 'EXPIRED');

-- AlterTable
ALTER TABLE "Application" ADD COLUMN     "recruiterOpeningId" TEXT;

-- CreateTable
CREATE TABLE "RecruiterOpening" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "requirements" TEXT[],
    "responsibilities" TEXT[],
    "skills" TEXT[],
    "location" TEXT,
    "isRemote" BOOLEAN NOT NULL DEFAULT false,
    "type" "JobType" NOT NULL DEFAULT 'FULL_TIME',
    "level" "ExperienceLevel" NOT NULL DEFAULT 'MID',
    "salaryMin" INTEGER,
    "salaryMax" INTEGER,
    "salaryCurrency" TEXT NOT NULL DEFAULT 'USD',
    "status" "RecruiterOpeningStatus" NOT NULL DEFAULT 'DRAFT',
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RecruiterOpening_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RecruiterOpening_slug_key" ON "RecruiterOpening"("slug");

-- CreateIndex
CREATE INDEX "RecruiterOpening_companyId_idx" ON "RecruiterOpening"("companyId");

-- CreateIndex
CREATE INDEX "RecruiterOpening_status_idx" ON "RecruiterOpening"("status");

-- CreateIndex
CREATE INDEX "RecruiterOpening_createdAt_idx" ON "RecruiterOpening"("createdAt");

-- AddForeignKey
ALTER TABLE "RecruiterOpening" ADD CONSTRAINT "RecruiterOpening_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_recruiterOpeningId_fkey" FOREIGN KEY ("recruiterOpeningId") REFERENCES "RecruiterOpening"("id") ON DELETE SET NULL ON UPDATE CASCADE;
