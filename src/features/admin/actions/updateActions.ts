"use server";

import { Prisma } from "@/prisma/generated/browser";
import { headers } from "next/headers";
import { auth } from "@/src/configs/auth";
import prismaDb from "@/src/server/db/db";

import { createResponse } from "@/src/shared";
import { uploadImage } from "@/src/server/cloudinary/uploadImage";
import { createCompanyTypes } from "@/src/features/company/schemas/createCompanySchema";

interface UpdateCompanyProfileProps {
  data: createCompanyTypes;
  companySlug?: string;
}

export async function updateCompanyProfile({
  data,
  companySlug,
}: UpdateCompanyProfileProps) {
  try {
    if (!companySlug) {
      return createResponse(false, "Company slug not found");
    }

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return createResponse(false, "Session not found", {
        redirectUrl: "/signin",
      });
    }

    const isAuthorized = await prismaDb.user.findFirst({
      where: {
        id: session.user.id,
        role: "ADMIN",
      },
    });

    if (!isAuthorized) {
      return createResponse(false, "Not authorized", {
        redirectUrl: "/",
      });
    }

    const company = await prismaDb.company.findUnique({
      where: {
        slug: companySlug,
      },
      select: {
        id: true,
        logo: true,
        banner: true,
      },
    });

    if (!company) {
      return createResponse(false, "Company not found");
    }

    const { logo, banner, ...companyData } = data;

    let logoImageUrl: string | null | undefined =
      typeof logo === "string" ? logo : undefined;

    let bannerImageUrl: string | null | undefined =
      typeof banner === "string" ? banner : undefined;

    if (logo instanceof File) {
      const uploaded = await uploadImage({
        file: logo,
        slug: "companyLogoImage",
      });

      if (!uploaded.url) {
        return createResponse(false, "Failed to upload logo");
      }

      logoImageUrl = uploaded.url;
    }

    if (banner instanceof File) {
      const uploaded = await uploadImage({
        file: banner,
        slug: "companyBannerImage",
      });

      if (!uploaded.url) {
        return createResponse(false, "Failed to upload banner");
      }

      bannerImageUrl = uploaded.url;
    }

    if (logo === null) {
      logoImageUrl = null;
    }

    if (banner === null) {
      bannerImageUrl = null;
    }

    const updateData: Prisma.CompanyUpdateInput = {
      ...companyData,
    };

    if (logoImageUrl !== undefined) {
      updateData.logo = logoImageUrl;
    }

    if (bannerImageUrl !== undefined) {
      updateData.banner = bannerImageUrl;
    }

    await prismaDb.company.update({
      where: {
        slug: companySlug,
      },
      data: updateData,
    });

    return createResponse(true, "Company profile updated successfully");
  } catch (error) {
    console.error("Company update error:", error);

    return createResponse(
      false,
      error instanceof Error
        ? error.message
        : "Something went wrong while updating the company",
    );
  }
}
