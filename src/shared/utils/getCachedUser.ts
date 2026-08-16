"use server";

import { auth } from "@/src/configs/auth";
import prismaDb from "@/src/server/db/db";
import redis from "@/src/server/redis/redis";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createResponse } from "./createResponse";

export async function getCachedUser() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      redirect("/");
    }

    const key = `user:${session.user.id}`;

    const cached = await redis.get(key);

    if (cached) {
      createResponse(true, "cached user", JSON.parse(cached));
    }

    const user = await prismaDb.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        id: true,
        email: true,
        image: true,
        username: true,
        name: true,
        companyMembers: {
          select: {
            memberRole: true,
            company: {
              select: {
                slug: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return createResponse(false, "user not found");
    }

    const data = {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      username: user.username,
      memberRole: user.companyMembers?.memberRole ?? undefined,
      companySlug: user.companyMembers?.company.slug ?? undefined,
    };

    await redis.set(key, JSON.stringify(data), "EX", 1 * 60 * 60);

    return createResponse(true, "db user", data);
  } catch (error) {
    console.log("user cache error", error);
    return createResponse(false, "user not found");
  }
}
