"use client";

import React from "react";
import { cn } from "@/src/shared/utils/utils";

export const CardWrapper = ({
  className,
  children,
}: React.ComponentProps<"input">) => {
  return (
    <div
      className={cn(
        "shadow-md bg-neutral-50 border border-gray-100 rounded-2xl p-8",
        className,
      )}
    >
      {children}
    </div>
  );
};
