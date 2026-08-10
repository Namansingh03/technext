"use client";

import { useState } from "react";
import { UseFormSetValue } from "react-hook-form";
import { createCompanyTypes } from "@/src/features/company/schemas/createCompanySchema";

interface UseCompanyImagesReturn {
  logoImage: string | null;
  bannerImage: string | null;
  cropImage: string | null;
  cropOpen: boolean;
  setCropOpen: (open: boolean) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBannerChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCropSave: (url: string, blob: Blob) => void;
}

export function useCompanyImages(
  setValue: UseFormSetValue<createCompanyTypes>,
  initialLogo: string = "",
  initialBanner: string = "",
): UseCompanyImagesReturn {
  const [logoImage, setLogoImage] = useState<string>(initialLogo);
  const [bannerImage, setBannerImage] = useState<string>(initialBanner);
  const [cropImage, setCropImage] = useState<string | null>(null);
  const [cropOpen, setCropOpen] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const preview = URL.createObjectURL(file);
    setCropImage(preview);
    setCropOpen(true);
    e.target.value = "";
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setValue("banner", file, {
      shouldValidate: true,
    });
    setBannerImage(URL.createObjectURL(file));
  };

  const handleCropSave = (url: string, blob: Blob) => {
    const file = new File([blob], "logo.jpg", { type: blob.type });
    setValue("logo", file, { shouldValidate: true });
    setLogoImage(url);
    setCropImage(url);
  };

  return {
    logoImage,
    bannerImage,
    cropImage,
    cropOpen,
    setCropOpen,
    handleFileChange,
    handleBannerChange,
    handleCropSave,
  };
}
