"use server";

import { createResponse } from "@/src/shared";
import prismaDb from "@/src/server/db/db";

export async function getCompanyDetails(slug: string) {
  try {
    if (!slug) {
      return createResponse(false, "slug not found", undefined);
    }

    const res = await prismaDb.company.findUnique({
      where: {
        slug,
      },
      select: {
        banner: true,
        createdAt: true,
        description: true,
        industry: true,
        isVerified: true,
        linkedin: true,
        location: true,
        logo: true,
        members: true,
        name: true,
        size: true,
        website: true,
        slug: true,
        jobs: {
          select: {
            id: true,
            title: true,
            location: true,
            isRemote: true,
            salaryMax: true,
            salaryMin: true,
            category: true,
          },
        },
      },
    });

    if (!res) {
      return createResponse(false, "company not found", undefined);
    }

    return createResponse(true, "company details found", res);
  } catch (error) {
    console.log(error);

    return createResponse(
      false,
      "something went wrong while fetching company details",
      undefined,
    );
  }
}
