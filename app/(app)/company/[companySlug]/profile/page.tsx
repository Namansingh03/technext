import React from "react";
import { getCompanyDetails } from "@/src/features/company/actions/getActions";
import CompanyPage from "@/src/features/company/components/companyPage/CompanyPage";
import { getCachedUser } from "@/src/shared/utils/getCachedUser";

async function CompanyProfile({
  params,
}: {
  params: Promise<{ companySlug: string }>;
}) {
  const { companySlug } = await params;
  const userRes = await getCachedUser();

  if (!userRes.success || !userRes.data) {
    throw new Error(userRes.message);
  }

  const res = await getCompanyDetails(companySlug);

  if (!res.success || !res.data) {
    throw new Error(res.message);
  }

  const { memberRole } = userRes.data;

  return <CompanyPage data={res.data!} role={memberRole} />;
}

export default CompanyProfile;
