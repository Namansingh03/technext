"use server";

import prismaDb from "@/src/server/db/db";
import { createResponse } from "@/src/shared";
import CompanyForm from "@/src/features/company/components/companyForm/CompanyForm";

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

  return (
    <div>
      <div className="w-full flex flex-col items-center justify-center p-5 bg-linear-to-br from-[#0f172a] via-[#1e1a78] to-[#0f172a]">
        <CompanyForm type="update" companyDetails={res} />
      </div>
    </div>
  );
};

export default Page;
