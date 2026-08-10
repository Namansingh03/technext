import { Prisma } from "@/prisma/generated/client";

type CompanyType = Prisma.CompanyGetPayload<{
  select: {
    banner: true;
    createdAt: true;
    description: true;
    industry: true;
    isVerified: true;
    linkedin: true;
    location: true;
    logo: true;
    members: true;
    name: true;
    size: true;
    website: true;
    slug: true;
    jobs: {
      select: {
        title: true;
        category: true;
        isRemote: true;
        location: true;
        salaryMax: true;
        salaryMin: true;
        id: true;
      };
    };
  };
}>;

type CompanyFormType = Prisma.CompanyGetPayload<{
  select: {
    banner: true;
    companyEmail: true;
    description: true;
    industry: true;
    linkedin: true;
    location: true;
    logo: true;
    name: true;
    size: true;
    slug: true;
    website: true;
  };
}>;

export type { CompanyType, CompanyFormType };
