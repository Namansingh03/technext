"use client";

import React from "react";
import CompanyForm from "@/src/features/company/components/companyForm/CompanyForm";

export default function page() {
  return (
    <div>
      <div className="w-full flex flex-col items-center justify-center p-5 bg-linear-to-br from-[#0f172a] via-[#1e1a78] to-[#0f172a]">
        <CompanyForm type="create" />
      </div>
    </div>
  );
}
