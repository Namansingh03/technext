"use server";

import { getCachedUser } from "@/src/shared/utils/getCachedUser";
import { redirect } from "next/navigation";

export default async function RedirectPage() {
  const res = await getCachedUser();

  if (!res.success || !res.data) {
    throw new Error(res.message);
  }

  const { username, image } = res.data;

  if (!username) {
    redirect("/setUsername");
  }

  if (!image) {
    redirect("/tell-us-more");
  }

  redirect(`/${username}/`);
}
