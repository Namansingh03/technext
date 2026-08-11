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

const CompanyInfoCard = ({
  companySize,
  industry,
  joined,
  linkedin,
  location,
  website,
}: CompanyInfoCardProps) => {
  return (
    <div className="bg-surface-container-lowest rounded-lg p-8 shadow-[0px_20px_40px_rgba(77,68,227,0.06)]">
      <h2 className="text-lg font-bold mb-6 text-on-surface">
        Company Information
      </h2>
      <div className={clsx("space-y-6")}>
        <div className="flex gap-4">
          <span className="material-symbols-outlined text-slate-400">
            <Globe className="w-4 h-4" />
          </span>
          <div>
            <p className="text-xs font-bold  uppercase tracking-widest mb-1">
              Website
            </p>
            {website ? (
              <a
                className="text-sm text-neutral-600 hover:underline"
                href={website}
              >
                {website}
              </a>
            ) : (
              "company website url"
            )}
          </div>
        </div>
        <div className="flex gap-4">
          <span className="material-symbols-outlined text-slate-400">
            <Share2 className="w-4 h-4" />
          </span>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-1">
              LinkedIn
            </p>
            {linkedin ? (
              <a
                className="text-sm text-neutral-600 hover:underline"
                href={linkedin}
              >
                {linkedin}
              </a>
            ) : (
              "company linkedin url"
            )}
          </div>
        </div>
        <div className="flex gap-4">
          <span className="material-symbols-outlined text-slate-400">
            <Shapes className="w-4 h-4" />
          </span>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-1">
              Industry
            </p>
            <p className="text-sm text-neutral-600 ">
              {industry ?? "industry"}
            </p>
          </div>
        </div>
        <div className="flex gap-4">
          <span className="material-symbols-outlined text-slate-400">
            <Users className="w-4 h-4" />
          </span>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-1">
              Company Size
            </p>
            <div className="text-sm flex flex-row items-center justify-center gap-x-3 font-medium text-on-surface">
              <span className="text-sm text-neutral-600 lowercase">
                {companySize ?? "company size"}
              </span>
              <span>,</span>
              <span className="text-xs text-neutral-600">
                {sizeLabels[companySize]}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-4">
          <span className="material-symbols-outlined text-slate-400">
            <MapPin className="w-4 h-4" />
          </span>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-1">
              Location
            </p>
            <p className="text-sm text-neutral-600">
              {location ?? "city, country"}
            </p>
          </div>
        </div>
        <div className="flex gap-4">
          <span className="material-symbols-outlined text-slate-400">
            <Calendar className="w-4 h-4" />
          </span>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-1">
              Joined
            </p>
            <p className="text-sm text-neutral-600">{joined.toDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyInfoCard;
