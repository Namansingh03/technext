"use server";

import prismaDb from "@/src/server/db/db";
import { uploadImage } from "@/src/server/cloudinary/uploadImage";
import { createResponse } from "@/src/shared/utils/createResponse";
import { createCompanyTypes } from "@/src/features/company/schemas/createCompanySchema";
import { getUserOrThrow } from "@/src/shared/utils/getUserOrThrow";
import { Roles } from "@/prisma/generated/enums";

export async function createCompany(data: createCompanyTypes) {
  try {
    const user = await getUserOrThrow();

    if (user.role !== Roles.ADMIN) {
      return createResponse(
        false,
        "un authorized only Admin can create a company entry",
      );
    }

    const { banner, logo, description, ...companyData } = data;
    let bannerImageUrl: string | undefined;
    let logoImageUrl: string | undefined;

    const existingSlug = await prismaDb.company.findUnique({
      where: {
        slug: data.slug,
      },
    });

    if (existingSlug) {
      return createResponse(false, "Company already exist with same slug");
    }

    if (banner && banner instanceof File) {
      const res = await uploadImage({
        file: banner,
        slug: "companyBannerImage",
      });

      if (!res.url) {
        return createResponse(false, "Banner image upload failed");
      }

      bannerImageUrl = res.url;
    }

    if (logo && logo instanceof File) {
      const res = await uploadImage({
        file: logo,
        slug: "companyLogoImage",
      });

      if (!res.url) {
        return createResponse(false, "Logo image upload failed");
      }

      logoImageUrl = res.url;
    }

    await prismaDb.company.create({
      data: {
        ...companyData,

        banner: bannerImageUrl,
        logo: logoImageUrl,
        description,

        members: {
          create: {
            user: {
              connect: {
                id: user.id,
              },
            },
          },
        },
      },

      include: {
        members: true,
      },
    });

    return createResponse(true, "Company created");
  } catch (error) {
    console.error(error);
    return createResponse(false, "Failed to create company");
  }
}
