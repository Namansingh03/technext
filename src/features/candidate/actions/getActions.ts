"use server";

import prismaDb from "@/src/server/db/db";
import redis from "@/src/server/redis/redis";
import { createResponse } from "@/src/shared";
import { getUserOrThrow } from "@/src/shared/utils/getUserOrThrow";

export async function getUserProfile() {
  const user = await getUserOrThrow();

  const cacheKey = `user:${user.id}:profile`;

  const cached = await redis.get(cacheKey);

  if (cached) {
    return createResponse(true, "user profile fetched", JSON.parse(cached));
  }

  const existingUser = await prismaDb.user.findUnique({
    where: { id: user.id },
    select: {
      displayUsername: true,
      bio: true,
      email: true,
      image: true,
      name: true,
      headline: true,
      username: true,
      location: true,
      candidateProfile: {
        select: {
          isOpenToWork: true,
          about: true,
          bannerImage: true,
          skills: true,
          portfolioUrl: true,
          resumeUrl: true,
          linkedinUrl: true,
          githubUrl: true,
          experience: {
            orderBy: { startDate: "desc" },
            take: 5,
          },
          education: {
            orderBy: { startDate: "desc" },
            take: 5,
          },
        },
      },
    },
  });

  if (!existingUser) {
    return createResponse(false, "User not found", undefined, {
      redirectUrl: "/signup",
    });
  }

  await redis.set(cacheKey, JSON.stringify(existingUser), "EX", 1800);

  return createResponse(true, "User profile fetched!", existingUser);
}
