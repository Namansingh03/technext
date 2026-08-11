"use client";

import { Separator } from "@/src/shared";
import { FaRegIdBadge } from "react-icons/fa";
import CompanyPageHead from "./CompanyPageHead";
import CompanyInfoCard from "./CompanyInfoCard";
import TipTapView from "@/src/shared/ui/TipTapView";
import CompanyPageJobCard from "./CompanyPageJobCard";
import { CompanyProfileType } from "@/src/features/company/types/clientTypes/companyProfileTypes";

const CompanyPage = ({ data }: { data: CompanyProfileType }) => {
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
    jobs,
    slug,
    website,
  } = data;

  const output = Array.isArray(description)
    ? String(description[0] ?? "")
    : typeof description === "string"
      ? description
      : "";

  return (
    <div className="min-h-screen bg-neutral-100">
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
        />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 flex flex-col gap-8">
            <div className="bg-surface-container-lowest rounded-lg p-8 shadow-[0px_20px_40px_rgba(77,68,227,0.06)]">
              <h2 className="text-xl font-bold capitalize text-on-surface">
                {slug ?? "company slug"}
              </h2>
              <Separator className="my-2" />

              <TipTapView html={output} />
            </div>
            <div className="flex flex-col gap-6">
              <div className="flex justify-between items-center px-2">
                <h2 className="text-xl font-bold text-on-surface">
                  Open Roles at {slug ?? "company slug"}
                </h2>
                <span className="text-sm font-medium text-primary">
                  {/* {jobs.length} positions available */}
                </span>
              </div>
              <div className="flex flex-col gap-y-8">
                {jobs.map((job) => (
                  <CompanyPageJobCard
                    id={job.id}
                    key={job.id}
                    title={job.title}
                    companySlug={slug}
                    category={job.category}
                    isRemote={job.isRemote}
                    location={job.location}
                    salaryMax={job.salaryMax}
                    salaryMin={job.salaryMin}
                  />
                ))}
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
            <div className="bg-surface-container-lowest rounded-lg p-8 shadow-[0px_20px_40px_rgba(77,68,227,0.06)]">
              <h2 className="text-lg font-bold mb-6 text-on-surface">
                Company Stats
              </h2>
              <div className="grid grid-cols-1 gap-6">
                <div className="bg-surface-container-low p-4 rounded-xl flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-tertiary shadow-sm">
                    <span className="material-symbols-outlined">
                      <FaRegIdBadge />
                    </span>
                  </div>
                  <div>
                    <p className="text-2xl font-black text-on-surface leading-none">
                      employees
                    </p>
                    <p className="text-md font-medium text-on-surface-variant">
                      {members.length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-blue-800 p-8 rounded-lg text-white shadow-xl relative overflow-hidden group">
              <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-all duration-500"></div>
              <h3 className="text-xl font-bold mb-2">Want to work here?</h3>
              <p className="text-indigo-100 text-sm mb-6">
                Join our newsletter to get notified about new openings at
                TechFlow.
              </p>
              <button className="w-full py-3 bg-white text-primary font-bold rounded-xl hover:bg-on-primary-container transition-all">
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
