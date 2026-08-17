"use server";

import React from "react";
import AdminLayout from "./AdminLayout";
import { getCachedUser } from "@/src/shared/utils/getCachedUser";

interface layoutProps {
  children: React.ReactNode;
}

export default async function Layout({ children }: layoutProps) {
  const res = await getCachedUser();

  if (!res.success || !res.data) {
    throw new Error(res.message);
  }

  const { name, image, username, companySlug } = res.data;

  return (
    <AdminLayout
      username={username}
      image={image}
      name={name}
      companySlug={companySlug}
    >
      {children}
    </AdminLayout>
  );
}
