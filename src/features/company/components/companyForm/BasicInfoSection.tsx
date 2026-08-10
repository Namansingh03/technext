"use client";

import React, { useState } from "react";
import { UseFormRegister, FieldErrors, UseFormSetValue } from "react-hook-form";
import {
  CompanySizeEnum,
  createCompanyTypes,
} from "@/src/features/company/schemas/createCompanySchema";
import { Input } from "@/src/shared/ui/input";
import { Button } from "@/src/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/shared/ui/dropdown-menu";
import {
  Building2,
  Mail,
  Globe,
  Tag,
  Briefcase,
  MapPin,
  ChevronDown,
} from "lucide-react";
import { FaLinkedin } from "react-icons/fa";
import { SectionHeading } from "./SectionHeading";
import { sizeLabels } from "@/src/features/company/constants/prismaEnums";

interface FieldProps {
  label: string;
  icon?: React.ElementType;
  error?: string;
  children: React.ReactNode;
}

/** Local field wrapper — only used within the basic info grid. */
function Field({ label, icon: Icon, error, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 dark:text-neutral-500 pointer-events-none z-10" />
        )}
        <div className={Icon ? "[&_input]:pl-9" : ""}>{children}</div>
      </div>
      {error && (
        <p className="text-xs text-red-500 dark:text-red-400 mt-0.5">{error}</p>
      )}
    </div>
  );
}

interface BasicInfoSectionProps {
  register: UseFormRegister<createCompanyTypes>;
  errors: FieldErrors<createCompanyTypes>;
  setValue: UseFormSetValue<createCompanyTypes>;
}

export function BasicInfoSection({
  register,
  errors,
  setValue,
}: BasicInfoSectionProps) {
  const [selectedSize, setSelectedSize] = useState<string>("SMALL");

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm p-7">
      <SectionHeading
        step="2"
        title="Basic information"
        subtitle="Core details that appear on your public profile."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field
          label="Company name"
          icon={Building2}
          error={errors.name?.message}
        >
          <Input
            type="text"
            placeholder="talentgate Corp"
            {...register("name")}
          />
        </Field>

        <Field
          label="Company email"
          icon={Mail}
          error={errors.companyEmail?.message}
        >
          <Input
            type="email"
            placeholder="hello@talentgate.com"
            {...register("companyEmail")}
          />
        </Field>

        <Field label="Website URL" icon={Globe} error={errors.website?.message}>
          <Input
            placeholder="https://talentgate.com"
            {...register("website")}
          />
        </Field>

        <Field
          label="LinkedIn URL"
          icon={FaLinkedin}
          error={errors.linkedin?.message}
        >
          <Input
            placeholder="https://linkedin.com/company/talentgate"
            {...register("linkedin")}
          />
        </Field>

        <Field label="Slug" icon={Tag} error={errors.slug?.message}>
          <Input
            type="text"
            placeholder="talentgate-corp"
            {...register("slug")}
          />
        </Field>

        <Field
          label="Industry"
          icon={Briefcase}
          error={errors.industry?.message}
        >
          <Input
            type="text"
            placeholder="e.g. Fintech, Healthcare"
            {...register("industry")}
          />
        </Field>

        <Field label="Location" icon={MapPin} error={errors.location?.message}>
          <Input
            type="text"
            placeholder="San Francisco, CA"
            {...register("location")}
          />
        </Field>

        <Field label="Company size" error={errors.size?.message}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-between font-normal text-neutral-600 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700 h-10 hover:bg-neutral-50 dark:hover:bg-neutral-800"
              >
                {sizeLabels[selectedSize] ?? "Select size"}
                <ChevronDown className="w-4 h-4 text-neutral-400 dark:text-neutral-500 ml-2 shrink-0" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-55s">
              {CompanySizeEnum.options.map((val) => (
                <DropdownMenuItem
                  key={val}
                  onClick={() => {
                    setValue("size", val, {
                      shouldValidate: true,
                    });
                    setSelectedSize(val);
                  }}
                  className="text-sm"
                >
                  {sizeLabels[val] ?? val}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </Field>
      </div>
    </div>
  );
}

export default BasicInfoSection;
