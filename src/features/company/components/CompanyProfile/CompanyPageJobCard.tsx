"use client";

import { Badge } from "@/src/shared/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/src/shared/ui/tooltip";
import { Building2, Send, Wifi } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

interface CompanyPageJobCardProps {
  id: string;
  title: string;
  category: string;
  isRemote: boolean;
  location: string;
  salaryMax: number | null;
  salaryMin: number | null;
  companySlug: string;
}

const CompanyPageJobCard = ({
  id,
  title,
  category,
  isRemote,
  location,
  salaryMax,
  salaryMin,
  companySlug,
}: CompanyPageJobCardProps) => {
  const rangedSalary = "$" + salaryMin + " - " + "$" + salaryMax;
  const router = useRouter();

  return (
    <div className="flex flex-row items-center justify-between p-5 border-l-4 border-indigo-900 rounded-lg bg-white shadow-md">
      <div className="flex flex-col gap-y-2 items-start ">
        <div className="flex flex-row gap-x-5">
          <Badge variant={"default"} className="text-xs font-medium">
            {category.toLowerCase() ?? "category"}
          </Badge>
          {isRemote && (
            <Badge className="flex flex-row gap-x-1 bg-green-700">
              <Wifi className="" />
              <p>Remote</p>
            </Badge>
          )}
        </div>
        <h1 className="text-xl font-semibold capitalize font-serif text-neutral-900">
          {title}
        </h1>
        <p className="flex flex-row items-center gap-x-2 text-sm text-neutral-700">
          <span>located at :</span>
          <Building2 className="w-4 h-4" />
          <span>{location}</span>
        </p>
      </div>
      <div className="flex flex-col items-end">
        <Tooltip>
          <TooltipTrigger
            className="cursor-pointer mb-3"
            onClick={() => router.push(`/${companySlug}/jobs/${id}/view`)}
          >
            <Send className="text-neutral-700 w-4 h-4" />
          </TooltipTrigger>
          <TooltipContent>view job</TooltipContent>
        </Tooltip>
        <h1 className="text-xl font-semibold font-sans text-neutral-950">
          {rangedSalary}
        </h1>
        <p className="text-xs text-neutral-500">per annum</p>
      </div>
    </div>
  );
};

export default CompanyPageJobCard;
