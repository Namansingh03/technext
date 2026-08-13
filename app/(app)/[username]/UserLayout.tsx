"use client";

import React from "react";
import { UserSidebar } from "@/src/features/User/components/UserSidebar";
import { SidebarInset } from "@/src/shared/ui/sidebar";

interface CompanyLayoutShellProps {
  username: string | null;
  image?: string | null;
  name?: string | null;
  children: React.ReactNode;
}

const UserLayout = ({
  username,
  image,
  name,
  children,
}: CompanyLayoutShellProps) => {
  return (
    <div className="flex flex-row w-full">
      <UserSidebar username={username} image={image} name={name} />
      <SidebarInset className="">
        <div className="h-full overflow-y-auto">{children}</div>
      </SidebarInset>
    </div>
  );
};

export default UserLayout;
