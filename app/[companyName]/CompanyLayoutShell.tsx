"use client";

import React from "react";
import { AdminSidebar } from "@/src/features/admin/components/AdminSidebar";
import { SidebarInset } from "@/src/shared/ui/sidebar";

interface CompanyLayoutShellProps {
  slug: string;
  children: React.ReactNode;
  name: string;
  image?: string | null;
  role: string;
}

const CompanyLayoutShell = ({
  slug,
  children,
  image,
  name,
  role,
}: CompanyLayoutShellProps) => {
  return (
    <div className="flex flex-row w-full">
      {role === "ADMIN" ? (
        <AdminSidebar slug={slug} image={image} name={name} />
      ) : (
        ""
      )}
      <SidebarInset className="">
        <div className="h-full overflow-y-auto">{children}</div>
      </SidebarInset>
    </div>
  );
};

export default CompanyLayoutShell;
