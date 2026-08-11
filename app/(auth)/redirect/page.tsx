"use server";

import { headers } from "next/headers";
import { auth } from "@/src/configs/auth";
import prismaDb from "@/src/server/db/db";
import { redirect } from "next/navigation";
import { Roles } from "@/prisma/generated/enums";

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user.username) {
    redirect("/setUsername");
  }

  const { role, id, image } = session.user;

  if (!image) {
    redirect("/tell-us-more");
  }

  const user = await prismaDb.user.findUnique({
    where: {
      id,
    },
    select: {
      candidateProfile: {
        select: {
          id: true,
        },
      },
      membership: {
        select: {
          company: {
            select: {
              slug: true,
            },
          },
        },
      },
    },
  });

  const hasCandidateProfile = !!user?.candidateProfile;

  if (role !== Roles.ADMIN && !hasCandidateProfile) {
    redirect("/addProfile");
  }

  if (role !== Roles.CANDIDATE && user?.membership) {
    redirect(`/${user.membership.company.slug}/${role.toLowerCase()}`);
  }
}
