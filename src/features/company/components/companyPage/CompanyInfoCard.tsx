"use client";

import React from "react";
import { sizeLabels } from "./CompanyPageHead";
import clsx from "clsx";
import { Calendar, Globe, MapPin, Shapes, Share2, Users } from "lucide-react";

interface CompanyInfoCardProps {
  website: string | null;
  industry: string | null;
  linkedin: string | null;
  companySize: string;
  location: string | null;
  joined: Date;
}

interface InfoRow {
  icon: React.ReactNode;
  label: string;
  content: React.ReactNode;
}

const CompanyInfoCard = ({
  companySize,
  industry,
  joined,
  linkedin,
  location,
  website,
}: CompanyInfoCardProps) => {
  const rows: InfoRow[] = [
    {
      icon: <Globe className="w-4 h-4" />,
      label: "Website",
      content: website ? (
        <a
          className="text-sm text-neutral-600 dark:text-neutral-300 hover:text-primary dark:hover:text-primary-300 hover:underline underline-offset-2 transition-colors duration-200"
          href={website}
          target="_blank"
          rel="noopener noreferrer"
        >
          {website}
        </a>
      ) : (
        <span className="text-sm text-neutral-400 dark:text-neutral-500 italic">
          company website url
        </span>
      ),
    },
    {
      icon: <Share2 className="w-4 h-4" />,
      label: "LinkedIn",
      content: linkedin ? (
        <a
          className="text-sm text-neutral-600 dark:text-neutral-300 hover:text-primary dark:hover:text-primary-300 hover:underline underline-offset-2 transition-colors duration-200"
          href={linkedin}
          target="_blank"
          rel="noopener noreferrer"
        >
          {linkedin}
        </a>
      ) : (
        <span className="text-sm text-neutral-400 dark:text-neutral-500 italic">
          company linkedin url
        </span>
      ),
    },
    {
      icon: <Shapes className="w-4 h-4" />,
      label: "Industry",
      content: (
        <p className="text-sm text-neutral-600 dark:text-neutral-300">
          {industry ?? "industry"}
        </p>
      ),
    },
    {
      icon: <Users className="w-4 h-4" />,
      label: "Company Size",
      content: (
        <div className="text-sm flex flex-row items-center gap-x-2 font-medium text-on-surface dark:text-neutral-100">
          <span className="text-sm text-neutral-600 dark:text-neutral-300 lowercase">
            {companySize ?? "company size"}
          </span>
          <span className="text-neutral-400 dark:text-neutral-600">·</span>
          <span className="text-xs text-neutral-500 dark:text-neutral-400">
            {sizeLabels[companySize]}
          </span>
        </div>
      ),
    },
    {
      icon: <MapPin className="w-4 h-4" />,
      label: "Location",
      content: (
        <p className="text-sm text-neutral-600 dark:text-neutral-300">
          {location ?? "city, country"}
        </p>
      ),
    },
    {
      icon: <Calendar className="w-4 h-4" />,
      label: "Joined",
      content: (
        <p className="text-sm text-neutral-600 dark:text-neutral-300">
          {joined.toDateString()}
        </p>
      ),
    },
  ];

  return (
    <div
      className={clsx(
        "bg-surface-container-lowest dark:bg-neutral-900",
        "border border-transparent dark:border-neutral-800",
        "rounded-lg p-8",
        "shadow-[0px_20px_40px_rgba(77,68,227,0.06)] dark:shadow-[0px_20px_40px_rgba(0,0,0,0.35)]",
        "transition-colors duration-300 ease-out",
      )}
    >
      <h2 className="text-lg font-bold mb-6 text-on-surface dark:text-white">
        Company Information
      </h2>
      <div className="space-y-6">
        {rows.map((row, i) => (
          <div
            key={row.label}
            className={clsx(
              "flex gap-4 rounded-md -mx-2 px-2 py-1.5",
              "transition-colors duration-200 ease-out",
              "hover:bg-neutral-50 dark:hover:bg-neutral-800/60",
              "motion-safe:animate-[fadeIn_0.4s_ease-out_backwards]",
            )}
            style={{ animationDelay: `${i * 40}ms` }}
          >
            <span className="material-symbols-outlined text-slate-400 dark:text-slate-500 mt-0.5 shrink-0 transition-colors duration-200">
              {row.icon}
            </span>
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-widest mb-1 text-neutral-500 dark:text-neutral-400">
                {row.label}
              </p>
              {row.content}
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default CompanyInfoCard;
