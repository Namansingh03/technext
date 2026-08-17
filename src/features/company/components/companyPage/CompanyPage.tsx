"use client";

import { CompanyType } from "@/src/features/company/types/CompanyPrismaTypes";
import TipTapView from "@/src/shared/ui/TipTapView";
import CompanyPageHead from "./CompanyPageHead";
import CompanyInfoCard from "./CompanyInfoCard";
import { FaRegIdBadge } from "react-icons/fa";
import { Separator } from "@/src/shared";

interface CompanyPageProps {
  data: CompanyType;
  role?: string;
}

const CompanyPage = ({ data, role }: CompanyPageProps) => {
  const {
    banner,
    createdAt,
    description,
    industry,
    isVerified,
    linkedin,
    location,
    logo,
    members,
    name,
    size,
    slug,
    website,
  } = data;

  const output = Array.isArray(description)
    ? String(description[0] ?? "")
    : typeof description === "string"
      ? description
      : "";

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-neutral-950 transition-colors duration-300">
      <div className="max-w-8xl mx-auto p-10">
        <CompanyPageHead
          slug={slug}
          bannerImage={banner}
          industry={industry}
          isVerified={isVerified}
          linkedin={linkedin}
          location={location}
          logoImage={logo}
          name={name}
          size={size}
          website={website}
          role={role}
        />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 flex flex-col gap-8">
            <div className="bg-surface-container-lowest dark:bg-neutral-900 border border-transparent dark:border-neutral-800 rounded-lg p-8 shadow-[0px_20px_40px_rgba(77,68,227,0.06)] dark:shadow-[0px_20px_40px_rgba(0,0,0,0.35)] transition-colors duration-300">
              <h2 className="text-xl font-bold capitalize text-on-surface dark:text-white">
                {slug ?? "company slug"}
              </h2>
              <Separator className="my-2 dark:bg-neutral-800" />

              <TipTapView html={output} />
            </div>
            <div className="flex flex-col gap-6">
              <div className="flex justify-between items-center px-2">
                <h2 className="text-xl font-bold text-on-surface dark:text-white">
                  Open Roles at {slug ?? "company slug"}
                </h2>
                <span className="text-sm font-medium text-primary dark:text-primary-300">
                  {/* {jobs.length} positions available */}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-8">
            {/* company info */}
            <CompanyInfoCard
              companySize={size}
              industry={industry}
              joined={createdAt}
              linkedin={linkedin}
              location={location}
              website={website}
            />
            <div className="bg-surface-container-lowest dark:bg-neutral-900 border border-transparent dark:border-neutral-800 rounded-lg p-8 shadow-[0px_20px_40px_rgba(77,68,227,0.06)] dark:shadow-[0px_20px_40px_rgba(0,0,0,0.35)] transition-colors duration-300">
              <h2 className="text-lg font-bold mb-6 text-on-surface dark:text-white">
                Company Stats
              </h2>
              <div className="grid grid-cols-1 gap-6">
                <div className="bg-surface-container-low dark:bg-neutral-800/60 p-4 rounded-xl flex items-center gap-4 transition-colors duration-200 hover:bg-neutral-100 dark:hover:bg-neutral-800">
                  <div className="w-12 h-12 bg-white dark:bg-neutral-900 dark:ring-1 dark:ring-neutral-700 rounded-lg flex items-center justify-center text-tertiary dark:text-tertiary-300 shadow-sm transition-colors duration-200">
                    <span className="material-symbols-outlined">
                      <FaRegIdBadge />
                    </span>
                  </div>
                  <div>
                    <p className="text-2xl font-black text-on-surface dark:text-white leading-none">
                      employees
                    </p>
                    <p className="text-md font-medium text-on-surface-variant dark:text-neutral-400">
                      {members.length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-blue-800 dark:bg-blue-900/80 dark:ring-1 dark:ring-blue-700/40 p-8 rounded-lg text-white shadow-xl dark:shadow-[0px_20px_40px_rgba(0,0,0,0.45)] relative overflow-hidden group transition-colors duration-300">
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500 ease-out"></div>
              <h3 className="text-xl font-bold mb-2">Want to work here?</h3>
              <p className="text-indigo-100 dark:text-indigo-200/90 text-sm mb-6">
                Join our newsletter to get notified about new openings at
                TechFlow.
              </p>
              <button className="w-full py-3 bg-white text-primary font-bold rounded-xl hover:bg-on-primary-container active:scale-[0.98] transition-all duration-200 ease-out">
                Follow Company
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyPage;
