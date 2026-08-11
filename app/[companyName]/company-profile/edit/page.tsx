"use server";

import CompanyForm from "@/src/features/company/components/companyForm/CompanyForm";
import prismaDb from "@/src/server/db/db";
import { createResponse } from "@/src/shared";

const Page = async ({
  params,
}: {
  params: Promise<{ companySlug: string }>;
}) => {
  const { companySlug } = await params;

  const res = await prismaDb.company.findFirst({
    where: {
      slug: companySlug,
    },
    select: {
      banner: true,
      companyEmail: true,
      description: true,
      industry: true,
      linkedin: true,
      location: true,
      name: true,
      size: true,
      slug: true,
      website: true,
      logo: true,
    },
  });

  if (!res) {
    return createResponse(false, "company details not found");
  }

  return <CompanyForm companyDetails={res} type="update" />;
};

export default Page;
