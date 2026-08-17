"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/src/shared/ui/button";
import Image from "next/image";
import { FiCheckCircle } from "react-icons/fi";
import { Edit2 } from "lucide-react";
import { useRouter } from "next/navigation";

export const sizeLabels: Record<string, string> = {
  STARTUP: "10-20 employees",
  SMALL: "21-50 employees",
  MEDIUM: "51-500 employees",
  LARGE: "500-1000 employees",
  ENTERPRISE: "1K+ employees",
};

interface CompanyPageHeadProps {
  logoImage: string | null;
  bannerImage: string | null;
  isVerified: boolean;
  name: string | null;
  industry: string | null;
  size: string;
  location: string | null;
  website: string | null;
  linkedin: string | null;
  slug: string;
  role?: string;
}

const CompanyPageHead = ({
  logoImage,
  bannerImage,
  industry,
  isVerified,
  linkedin,
  location,
  name,
  size,
  website,
  slug,
  role,
}: CompanyPageHeadProps) => {
  const router = useRouter();

  return (
    <section className="mb-12 relative">
      <div className="h-48 w-full rounded-lg overflow-hidden relative bg-neutral-200 dark:bg-neutral-800">
        <Image
          alt="TechFlow Office Interior"
          width={1200}
          height={1200}
          className="w-full h-full object-cover transition-transform duration-500 ease-out hover:scale-[1.03]"
          src={bannerImage ?? ""}
        />
        <div className="absolute inset-0 bg-linear-to-t from-background dark:from-neutral-950 to-transparent"></div>
        {role === "ADMIN" ? (
          <Button
            size="icon"
            variant="secondary"
            className={[
              "absolute top-4 right-4 z-20 rounded-full shadow-lg backdrop-blur-sm",
              "bg-white/90 hover:bg-white",
              "dark:bg-neutral-900/80 dark:hover:bg-neutral-800 dark:text-neutral-100 dark:border dark:border-neutral-700/60",
              "transition-all duration-200 ease-out hover:scale-105 active:scale-95",
            ].join(" ")}
            onClick={() => {
              router.push(`/company/${slug}/update`);
            }}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
        ) : (
          ""
        )}
      </div>
      <div className="flex flex-col md:flex-row items-end gap-6 -mt-16 px-8 relative z-10">
        <div className="w-32 h-32 rounded-full bg-white dark:bg-neutral-900 p-1 shadow-xl ring-1 ring-black/5 dark:ring-white/10 transition-colors duration-300">
          <div className="w-full h-full rounded-full bg-primary-gradient flex items-center justify-center text-white overflow-hidden">
            <Image
              alt="TechFlow Logo"
              className="w-full h-full object-cover"
              width={100}
              height={100}
              src={logoImage ?? ""}
            />
          </div>
        </div>
        <div className="flex-1 pb-2">
          <div className="flex items-baseline gap-2 mb-1">
            <h1 className="text-3xl font-bold tracking-tight text-on-surface dark:text-white">
              {name ?? "name"}
            </h1>
            <span className="text-md font-semibold text-blue-500 dark:text-blue-400 flex items-center gap-1">
              {isVerified ? (
                <FiCheckCircle />
              ) : (
                <span className="text-sm font-medium text-neutral-400 dark:text-neutral-500 italic">
                  not verified yet
                </span>
              )}
            </span>
          </div>
          <ul className="flex items-center justify-start flex-row gap-x-3 text-gray-700 dark:text-neutral-300 font-medium capitalize">
            <li>{industry ?? "industry"}</li>
            <span className="text-gray-400 dark:text-neutral-600">-</span>
            <li>{sizeLabels[size] ?? "size"}</li>
            <span className="text-gray-400 dark:text-neutral-600">-</span>
            <li>{location ?? "location"}</li>
          </ul>
        </div>
        <div className="flex gap-3 pb-2">
          <Button
            className="w-40 h-10 rounded-lg transition-all duration-200 ease-out hover:shadow-md active:scale-[0.98]"
            asChild
          >
            <Link href={website ?? ""}>Visit Website</Link>
          </Button>
          <Button
            variant={"outline"}
            className={[
              "w-40 h-10 rounded-lg",
              "dark:border-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-800",
              "transition-all duration-200 ease-out hover:shadow-md active:scale-[0.98]",
            ].join(" ")}
            asChild
          >
            <Link href={linkedin ?? ""}>View LinkedIn</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CompanyPageHead;
