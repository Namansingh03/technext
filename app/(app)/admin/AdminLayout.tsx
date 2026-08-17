"use client";

import React from "react";
import { AdminSidebar } from "@/src/features/admin/components/AdminSidebar";
import { SidebarInset } from "@/src/shared/ui/sidebar";

interface CompanyLayoutShellProps {
  username: string | null;
  image?: string | null;
  name?: string | null;
  children: React.ReactNode;
  companySlug?: string;
}

const AdminLayout = ({
  username,
  image,
  name,
  children,
  companySlug,
}: CompanyLayoutShellProps) => {
  return (
    <div className="h-full flex flex-row w-full overflow-hidden">
      <AdminSidebar
        username={username}
        image={image}
        name={name}
        companySlug={companySlug}
      />
      <SidebarInset className="flex-1 h-full overflow-y-auto">
        {children}
      </SidebarInset>
    </div>
  );
};

export default AdminLayout;
