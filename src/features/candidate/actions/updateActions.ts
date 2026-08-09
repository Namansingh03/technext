"use server";

import prismaDb from "@/src/server/db/db";
import redis from "@/src/server/redis/redis";
import { createResponse } from "@/src/shared";
import { getUserOrThrow } from "@/src/shared";
import {
  ProfileHeaderInput,
  educationSchema,
  experienceSchema,
} from "@/src/features/candidate/schemas/ProfileSchema";
import { cleanData } from "@/src/shared/utils/cleanData";
import { uploadImage } from "@/src/server/cloudinary/uploadImage";
import { AddProfileSchemaType } from "@/src/features/candidate/schemas/AddProfileSchema";
import { Prisma } from "@/prisma/generated/browser";

type Input = {
  text: string;
  textType: "about" | "bio";
};

type ExperienceInput = {
  experience: unknown;
  experienceId?: string;
};

type EducationInput = {
  education: unknown;
  educationId?: string;
};

type UpdateProfileInput = {
  candidateProfile: {
    githubUrl?: string;
    linkedinUrl?: string;
    portfolioUrl?: string;
    resumeUrl?: string;
  };
};

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

export async function UpdateProfileHeader(data: ProfileHeaderInput) {
  try {
    const user = await getUserOrThrow();

    const existingProfile = await prismaDb.candidateProfile.findUnique({
      where: { userId: user.id },
    });

    if (!existingProfile) {
      return createResponse(false, "Profile not found");
    }

    let avatarImageUrl: string | undefined;
    let bannerImageUrl: string | undefined;

    if (data.avatar) {
      const res = await uploadImage({
        file: data.avatar,
        slug: "avatarImage",
      });

      if (!res.url) {
        return createResponse(false, "Avatar upload failed");
      }

      avatarImageUrl = res.url;
    }

    if (data.banner) {
      const res = await uploadImage({
        file: data.banner,
        slug: "bannerImage",
      });

      if (!res.url) {
        return createResponse(false, "Banner upload failed");
      }

      bannerImageUrl = res.url;
    }

    await prismaDb.$transaction([
      prismaDb.user.update({
        where: { id: user.id },
        data: {
          name: data.displayName,
          headline: data.headline,
          location: data.location,

          ...(avatarImageUrl && { image: avatarImageUrl }),
        },
      }),

      prismaDb.candidateProfile.update({
        where: { userId: user.id },
        data: {
          isOpenToWork: data.isAvailable,
          ...(bannerImageUrl && { bannerImage: bannerImageUrl }),
        },
      }),
    ]);
    await redis.del(`user:${user.id}:profile`);

    return createResponse(true, "Profile updated successfully");
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return createResponse(false, "Unauthorized", {
        redirectUrl: "/signin",
      });
    }

    console.error("updateProfileHeader error:", error);
    throw new Error("Failed to update");
  }
}

export async function UpdateProfileSkills(skills: string[]) {
  try {
    const user = await getUserOrThrow();

    const existingProfile = await prismaDb.candidateProfile.findUnique({
      where: { userId: user.id },
    });

    if (!existingProfile) {
      return createResponse(false, "Profile not found");
    }

    await prismaDb.candidateProfile.update({
      where: {
        userId: user.id,
      },
      data: {
        skills,
      },
    });

    await redis.del(`user:${user.id}:profile`);
    return createResponse(true, "Profile updated successfully");
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return createResponse(false, "Unauthorized", {
        redirectUrl: "/signin",
      });
    }

    console.error("updateProfileHeader error:", error);
    throw new Error("Failed to update");
  }
}

export async function UpdateProfileText({ text, textType }: Input) {
  try {
    const user = await getUserOrThrow();

    if (!user) {
      return createResponse(false, "Unauthorized", "/signin");
    }

    const value = text.trim() || null;

    if (textType === "bio") {
      await prismaDb.user.update({
        where: { id: user.id },
        data: { bio: value },
      });

      return createResponse(true, "Bio updated");
    }

    if (textType === "about") {
      const profile = await prismaDb.candidateProfile.findUnique({
        where: { userId: user.id },
      });

      if (!profile) {
        // create profile if missing (edge case)
        await prismaDb.candidateProfile.create({
          data: {
            userId: user.id,
            about: value,
          },
        });
        await redis.del(`user:${user.id}:profile`);

        return createResponse(true, "About added");
      }

      await prismaDb.candidateProfile.update({
        where: { userId: user.id },
        data: { about: value },
      });
      await redis.del(`user:${user.id}:profile`);

      return createResponse(true, "About updated");
    }

    return createResponse(false, "Invalid type");
  } catch (err) {
    console.error(err);
    return createResponse(false, "Something went wrong");
  }
}

export async function UpdateProfileExperience({
  experience,
  experienceId,
}: ExperienceInput) {
  try {
    const parsed = experienceSchema.safeParse(experience);

    if (!parsed.success) {
      return createResponse(false, parsed.error.message);
    }

    const user = await getUserOrThrow();
    if (!user) {
      return createResponse(false, "Unauthorized", "/signin");
    }

    const profile = await prismaDb.candidateProfile.findUnique({
      where: { userId: user.id },
    });

    if (!profile) {
      return createResponse(false, "Profile not found");
    }

    const exp = parsed.data;

    const formatted = {
      company: exp.company,
      title: exp.title,
      location: exp.location?.trim() || null,
      description: exp.description?.trim() || null,
      startDate: exp.startDate,
      endDate: exp.isCurrent ? null : (exp.endDate ?? null),
      isCurrent: exp.isCurrent,
      profileId: profile.id,
    } satisfies Prisma.WorkExperienceUncheckedCreateInput;

    if (experienceId) {
      const result = await prismaDb.workExperience.updateMany({
        where: {
          id: experienceId,
          profileId: profile.id,
        },
        data: formatted,
      });

      if (result.count === 0) {
        return createResponse(false, "Experience not found");
      }

      return createResponse(true, "Experience updated");
    }

    await prismaDb.workExperience.create({
      data: {
        ...formatted,
        profileId: profile.id,
      },
    });
    await redis.del(`user:${user.id}:profile`);

    return createResponse(true, "Experience added");
  } catch (err) {
    console.error(err);
    return createResponse(false, "Something went wrong");
  }
}

export async function UpdateProfileEducation({
  education,
  educationId,
}: EducationInput) {
  try {
    const parsed = educationSchema.safeParse(education);

    if (!parsed.success) {
      return createResponse(false, parsed.error.message);
    }

    const user = await getUserOrThrow();
    if (!user) {
      return createResponse(false, "Unauthorized", "/signin");
    }

    const profile = await prismaDb.candidateProfile.findUnique({
      where: { userId: user.id },
    });

    if (!profile) {
      return createResponse(false, "Profile not found");
    }

    const edu = parsed.data;

    const formatted = {
      school: edu.school,
      degree: edu.degree,
      field: edu.field,
      startDate: edu.startDate,
      endDate: edu.isCurrent ? null : (edu.endDate ?? null),
      isCurrent: edu.isCurrent,
      profileId: profile.id,
    } satisfies Prisma.EducationUncheckedCreateInput;

    if (educationId) {
      const result = await prismaDb.education.updateMany({
        where: {
          id: educationId,
          profileId: profile.id,
        },
        data: formatted,
      });

      if (result.count === 0) {
        return createResponse(false, "Education not found");
      }
      await redis.del(`user:${user.id}:profile`);

      return createResponse(true, "Education updated");
    }

    await prismaDb.education.create({
      data: {
        ...formatted,
        profileId: profile.id,
      },
    });
    await redis.del(`user:${user.id}:profile`);

    return createResponse(true, "Education added");
  } catch (err) {
    console.error(err);
    return createResponse(false, "Something went wrong");
  }
}

export async function UpdateProfileContacts(data: UpdateProfileInput) {
  try {
    const user = await getUserOrThrow();

    if (!user) {
      return createResponse(false, "Unauthorized", "/signin");
    }

    const profile = await prismaDb.candidateProfile.findUnique({
      where: { userId: user.id },
    });

    if (!profile) {
      return createResponse(false, "Profile not found");
    }

    const links = data.candidateProfile;

    await prismaDb.candidateProfile.update({
      where: { userId: user.id },
      data: {
        githubUrl: links.githubUrl?.trim() || null,
        linkedinUrl: links.linkedinUrl?.trim() || null,
        portfolioUrl: links.portfolioUrl?.trim() || null,
        resumeUrl: links.resumeUrl?.trim() || null,
      },
    });
    await redis.del(`user:${user.id}:profile`);

    return createResponse(true, "Links updated successfully");
  } catch (error) {
    console.error(error);
    return createResponse(false, "Something went wrong");
  }
}
