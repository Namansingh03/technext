"use client";

import React from "react";
import { TooltipProvider } from "../ui/tooltip";
import { SidebarProvider } from "../ui/sidebar";

interface ProvidersProps {
  children: React.ReactNode;
}

const Providers = ({ children }: ProvidersProps) => {
  return (
    <SidebarProvider>
      <TooltipProvider>{children}</TooltipProvider>
    </SidebarProvider>
  );
};

export default Providers;
