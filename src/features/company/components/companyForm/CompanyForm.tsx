"use client";

import React, { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  companySchema,
  CompanyFormType,
} from "@/src/features/company/schemas/companyFormSchema";
import { createCompany } from "@/src/features/company/actions/createActions";
import { formatDate } from "@/src/shared/utils/formatDate";
import { ImageCropDialog } from "@/src/shared/components/ImageCropDialog";
import { BrandingSection } from "./BrandingSection";
import { BasicInfoSection } from "./BasicInfoSection";
import { DescriptionSection } from "./DescriptionSection";
import { FormActions } from "./FormActions";
import { useCompanyImages } from "@/src/features/company/hooks/useCompanyImage";
import { createCompanyPrisma } from "../../types/CompanyPrismaTypes";
import { updateCompanyProfile } from "@/src/features/company/actions/updateActions";

interface CompanyFormProps {
  companyDetails?: createCompanyPrisma | null;
  type: "create" | "update";
}

const CompanyForm = ({ companyDetails, type = "create" }: CompanyFormProps) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const formattedDate = formatDate();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CompanyFormType>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      industry: companyDetails?.industry ?? "",
      linkedin: companyDetails?.linkedin ?? "",
      location: companyDetails?.location ?? "",
      name: companyDetails?.name ?? "",
      size: companyDetails?.size ?? "SMALL",
      slug: companyDetails?.slug ?? "",
      website: companyDetails?.website ?? "",
      companyEmail: companyDetails?.companyEmail ?? "",
      description: companyDetails?.description ?? {},
      logo: companyDetails?.logo ?? undefined,
      banner: companyDetails?.banner ?? undefined,
    },
    mode: "onSubmit",
  });

  const {
    logoImage,
    bannerImage,
    cropImage,
    cropOpen,
    setCropOpen,
    handleFileChange,
    handleBannerChange,
    handleCropSave,
  } = useCompanyImages(
    setValue,
    companyDetails?.logo ?? "",
    companyDetails?.banner ?? "",
  );

  const onSubmit = (data: CompanyFormType) => {
    startTransition(async () => {
      try {
        if (type === "update") {
          const res = await updateCompanyProfile({
            data,
          });

          if (!res.success) {
            toast.error(res.message, { description: formattedDate });

            if (res.redirectUrl) {
              router.push(res.redirectUrl);
            }

            return;
          }

          toast.success("Company profile updated successfully", {
            description: formattedDate,
          });

          router.push(`/company/${data.slug}/profile`);
          return;
        }

        const res = await createCompany(data);

        if (!res.success) {
          toast.error(res.message, { description: formattedDate });

          if (res.redirectUrl) {
            router.push(res.redirectUrl);
          }

          return;
        }

        toast.success(res.message, {
          description: formattedDate,
        });

        router.push(`/company/${data.slug}/profile`);
      } catch (error) {
        console.error(error);

        toast.error("Something went wrong.", {
          description: formattedDate,
        });
      }
    });
  };
  return (
    <div className="w-5xl max-w-6xl p-8 rounded-lg bg-white dark:bg-neutral-900  ">
      {/* Page title */}
      <div className="mb-8">
        <p className="text-[11px] dark:text-neutral-00 font-semibold uppercase tracking-widest text-neutral-400 mb-1">
          TechNext
        </p>
        <h1 className="text-3xl font-bold dark:text-neutral-300 text-neutral-900 tracking-tight">
          Create your company
        </h1>
        <p className="text-sm dark:text-bg-neutral-400 text-neutral-500 mt-1">
          Fill in your details to start attracting top talent.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <BrandingSection
          register={register}
          errors={errors}
          logoImage={logoImage}
          bannerImage={bannerImage}
          onLogoChange={handleFileChange}
          onBannerChange={handleBannerChange}
        />

        <BasicInfoSection
          register={register}
          errors={errors}
          setValue={setValue}
        />

        <DescriptionSection
          setValue={setValue}
          content={companyDetails?.description}
        />

        <FormActions
          isPending={isPending}
          onCancel={() => router.back()}
          type={type}
        />
      </form>

      <ImageCropDialog
        open={cropOpen}
        onOpenChange={setCropOpen}
        imageSrc={cropImage ?? ""}
        onCropComplete={handleCropSave}
        title="Crop your avatar"
        outputType="image/jpeg"
        quality={0.92}
      />
    </div>
  );
};

export default CompanyForm;
