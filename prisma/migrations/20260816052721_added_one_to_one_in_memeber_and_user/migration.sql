/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `CompanyMember` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CompanyMember_userId_key" ON "CompanyMember"("userId");
