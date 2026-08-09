"use server";

import { auth } from "@/src/configs/auth";
import { headers } from "next/headers";

export async function getUserOrThrow() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("user not found");
  }

  return session.user;
}
