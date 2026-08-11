"use server";

import React from "react";
import CompanyLayoutShell from "./CompanyLayoutShell";
import { auth } from "@/src/configs/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

interface layoutProps {
  children: React.ReactNode;
  params: {
    companySlug: string;
  };
}

export default async function Layout({ children, params }: layoutProps) {
  const { companySlug } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/signin");
  }

  const { name, role, image } = session.user;

  return (
    <CompanyLayoutShell
      slug={companySlug}
      image={image}
      name={name}
      role={role}
    >
      {children}
    </CompanyLayoutShell>
  );
}
