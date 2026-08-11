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
}: CompanyPageHeadProps) => {
  const router = useRouter();

  return (
    <section className="mb-12 relative">
      <div className="h-48 w-full rounded-lg  overflow-hidden relative">
        <Image
          alt="TechFlow Office Interior"
          width={1200}
          height={1200}
          className="w-full h-full object-cover"
          src={bannerImage ?? ""}
        />
        <div className="absolute inset-0 bg-linear-to-t from-background to-transparent"></div>
        <Button
          size="icon"
          variant="secondary"
          className="absolute top-4 right-4 z-20 rounded-full shadow-lg backdrop-blur-sm bg-white/90 hover:bg-white"
          onClick={() => {
            router.push(`/${slug}/companyProfile/update`);
          }}
        >
          <Edit2 className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex flex-col md:flex-row items-end gap-6 -mt-16 px-8 relative z-10">
        <div className="w-32 h-32 rounded-full bg-white p-1 shadow-xl">
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
            <h1 className="text-3xl font-bold tracking-tight text-on-surface">
              {name ?? "name"}
            </h1>
            <span className="text-md font-semibold text-blue-500">
              {isVerified ? <FiCheckCircle /> : "not verified yet"}
            </span>
          </div>
          <ul className="flex items-centre justify-start flex-row gap-x-3 text-gray-700 font-medium capitalize">
            <li>{industry ?? "industry"}</li>
            <span>-</span>
            <li>{sizeLabels[size] ?? "size"}</li>
            <span>-</span>
            <li>{location ?? "location"}</li>
          </ul>
        </div>
        <div className="flex gap-3 pb-2">
          <Button className="w-40 h-10 rounded-lg">
            <Link href={website ?? ""}>Visit Website</Link>
          </Button>
          <Button variant={"outline"} className="w-40 h-10 rounded-lg">
            <Link href={linkedin ?? ""}>View LinkedIn</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CompanyPageHead;
