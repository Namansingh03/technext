import { Prisma } from "@/prisma/generated/client";

type CompanyProfileType = Prisma.CompanyGetPayload<{
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

export type { CompanyProfileType };
