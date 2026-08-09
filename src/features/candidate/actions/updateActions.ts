"use server";

import { uploadImage } from "@/src/server/cloudinary/uploadImage";
import prismaDb from "@/src/server/db/db";
import { createResponse } from "@/src/shared";
import { getUserOrThrow } from "@/src/shared";
import { cleanData } from "@/src/shared/utils/cleanData";
import { AddProfileSchemaType } from "../schemas/ProfileSchema";

export async function updateAddProfile(data: AddProfileSchemaType) {
  try {
    const user = await getUserOrThrow();

    const githubUrl = data.links?.[0]?.url;
    const portfolioUrl = data.links?.[1]?.url;
    const linkedinUrl = data.links?.[2]?.url;
    const resumeUrl = data.links?.[3]?.url;

    const imageUrl = data.bannerImage
      ? (
          await uploadImage({
            file: data.bannerImage,
            slug: "avatars",
          })
        ).url
      : undefined;

    await prismaDb.$transaction(async (tx) => {
      if (imageUrl) {
        await tx.candidateProfile.update({
          where: {
            userId: user.id,
          },
          data: {
            bannerImage: imageUrl,
          },
        });
      }

      await tx.candidateProfile.upsert({
        where: {
          userId: user.id,
        },
        update: cleanData({
          skills: data.skills,
          about: data.about,
          githubUrl,
          portfolioUrl,
          linkedinUrl,
          resumeUrl,
        }),
        create: {
          userId: user.id,
          skills: data.skills ?? [],
          about: data.about ?? "",
          githubUrl,
          portfolioUrl,
          linkedinUrl,
          resumeUrl,
        },
      });
    });

    return createResponse(true, "Profile setup completed", user.username);
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return createResponse(false, "Unauthorized", undefined, {
        redirectUrl: "/signin",
      });
    }

    console.error(error);
    throw new Error("Failed to setup profile");
  }
}
