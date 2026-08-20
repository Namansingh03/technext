"use server";

import prismaDb from "@/src/server/db/db";
import redis from "@/src/server/redis/redis";
import { createResponse } from "@/src/shared/utils/createResponse";
import { getCachedUser } from "@/src/shared/utils/getCachedUser";
import { getUserOrThrow } from "@/src/shared/utils/getUserOrThrow";

export async function deleteTimelineEntry(
  id: string | undefined,
  type: "Education" | "WorkExperience",
) {
  try {
    const user = await getUserOrThrow();

    if (!id) {
      return createResponse(false, "Id is required");
    }

    if (type === "Education") {
      await prismaDb.education.delete({
        where: { id },
      });
    } else if (type === "WorkExperience") {
      await prismaDb.workExperience.delete({
        where: { id },
      });
    }
    await redis.del(`user:${user.id}:profile`);

    return createResponse(true, `${type} deleted`);
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return createResponse(false, "Unauthorized", {
        redirectUrl: "/signin",
      });
    }

    console.error("deleteProfileEntry error:", error);
    throw new Error("Failed to delete entry");
  }
}

export async function deleteResume(resumeId: string) {
  try {
    const res = await getCachedUser();

    if (!res.success) {
      return createResponse(false, res.message);
    }

    const resume = await prismaDb.resume.findUnique({
      where: {
        id: resumeId,
      },
    });

    if (!resume) {
      return createResponse(false, "resume not found");
    }

    if (resume.userId !== res.data?.id) {
      return createResponse(false, "unauthorized");
    }

    await prismaDb.resume.delete({
      where: {
        id: resumeId,
      },
    });

    return createResponse(true, "resume deleted successfully");
  } catch (error) {
    console.log("something went wrong while deleting resume", error);
    return createResponse(false, "something went wrong while deleting resume");
  }
}
