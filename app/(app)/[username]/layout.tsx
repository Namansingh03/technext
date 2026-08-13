"use server";

import React from "react";
import UserLayout from "./UserLayout";
import { getCachedUser } from "@/src/shared/utils/getCachedUser";

interface layoutProps {
  children: React.ReactNode;
}

export default async function Layout({ children }: layoutProps) {
  const res = await getCachedUser();

  if (!res.success || !res.data) {
    throw new Error(res.message);
  }

  const { name, image, username } = res.data;

  return (
    <UserLayout username={username} image={image} name={name}>
      {children}
    </UserLayout>
  );
}
