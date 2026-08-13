"use client";

import Image from "next/image";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/shared/ui/dialog";
import {
  profileHeaderSchema,
  ProfileHeaderInput,
} from "@/src/features/User/schemas/addProfileSchema";
import { useForm, Controller } from "react-hook-form";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Input } from "@/src/shared/ui/input";
import { Button } from "@/src/shared/ui/button";
import { formatDate } from "@/src/shared/utils/formatDate";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImageCropDialog } from "@/src/shared/components/ImageCropDialog";
import { UpdateProfileHeader } from "@/src/features/User/actions/updateActions";
import React, { useEffect, useState, useTransition } from "react";
import { LocationAutocomplete } from "@/src/features/location/components/autoCompleteLocations";
import { LocationType } from "../../types/ProfileTypes";

interface Props {
  avatarImageUrl?: string;
  bannerImageUrl?: string;
  displayName: string;
  headline: string;
  locationVal?: LocationType | null;
  isAvailable: boolean;
  open: boolean;
  handleOpenChange: (open: boolean) => void;
  username?: string | null;
}

export default function EditProfileHeaderDialog({
  avatarImageUrl,
  bannerImageUrl,
  displayName,
  headline,
  locationVal,
  isAvailable,
  open,
  username,
  handleOpenChange,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [avatarPreview, setAvatarPreview] = useState<string | undefined>(
    avatarImageUrl,
  );

  const [bannerPreview, setBannerPreview] = useState<string | undefined>(
    bannerImageUrl,
  );

  const [cropOpen, setCropOpen] = useState(false);
  const [cropImage, setCropImage] = useState<string | null>(null);

  useEffect(() => {
    if (!username) router.push("/signin");
  }, [username, router]);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<ProfileHeaderInput>({
    resolver: zodResolver(profileHeaderSchema),
    defaultValues: {
      displayName,
      headline,
      location: {
        city: locationVal?.city,
        country: locationVal?.country,
        countryCode: locationVal?.countryCode,
        label: locationVal?.label,
        latitude: locationVal?.lat ?? 0,
        longitude: locationVal?.lng ?? 0,
        placeId: locationVal?.id,
        state: locationVal?.state,
      },
      isAvailable,
      avatar: undefined,
      banner: undefined,
    },
    mode: "onSubmit",
  });

  // submit form
  const onSubmit = (data: ProfileHeaderInput) => {
    startTransition(async () => {
      const res = await UpdateProfileHeader(data);

      if (!res.success) {
        toast.error(res.message, { description: formatDate() });
        if (res.redirectUrl) {
          router.push(res.redirectUrl);
        }
        console.log(res.message);
        return;
      }

      console.log(res.message);
      toast.success(res.message, { description: formatDate() });
      router.refresh();
    });
  };

  // file input
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "avatar" | "banner",
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const preview = URL.createObjectURL(file);

    if (type === "avatar") {
      setCropImage(preview);
      setCropOpen(true);
    } else {
      setValue("banner", file);
      setBannerPreview(preview);
    }
  };

  const handleCropSave = (url: string, blob: Blob) => {
    const file = new File([blob], "logo.jpg", { type: blob.type });
    setValue("avatar", file, { shouldValidate: true });
    setAvatarPreview(url);
  };

  return (
    <>
      {/* Main Edit Dialog */}
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent className="min-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>Update your profile header</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Banner */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Banner</label>

              <div className="h-32 rounded-md overflow-hidden bg-gray-100 relative">
                {bannerPreview && (
                  <Image
                    src={bannerPreview}
                    alt="banner"
                    fill
                    className="object-cover"
                  />
                )}
              </div>

              <Input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, "banner")}
              />

              {errors.banner && (
                <p className="text-xs text-red-500">
                  {errors.banner.message as string}
                </p>
              )}
            </div>

            {/* Avatar + Fields */}
            <div className="flex gap-6">
              {/* Avatar */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Avatar</label>

                <div className="w-28 h-28 rounded-full overflow-hidden bg-gray-100 relative">
                  {avatarPreview && (
                    <Image
                      src={avatarPreview}
                      alt="avatar"
                      fill
                      className="object-cover"
                    />
                  )}
                </div>

                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, "avatar")}
                />

                {errors.avatar && (
                  <p className="text-xs text-red-500">
                    {errors.avatar.message as string}
                  </p>
                )}
              </div>

              {/* Inputs */}
              <div className="flex-1 space-y-3">
                <Input placeholder="Name" {...register("displayName")} />

                {errors.displayName && (
                  <p className="text-xs text-red-500">
                    {errors.displayName.message}
                  </p>
                )}

                <Input placeholder="Headline" {...register("headline")} />

                {errors.headline && (
                  <p className="text-xs text-red-500">
                    {errors.headline.message}
                  </p>
                )}

                <Controller
                  control={control}
                  name="location"
                  render={({ field, fieldState }) => (
                    <LocationAutocomplete
                      defaultValue={locationVal?.label ?? ""}
                      value={field.value}
                      onSelect={field.onChange}
                      hasError={!!fieldState.error}
                    />
                  )}
                />

                {errors.location && (
                  <p className="text-xs text-red-500">
                    {errors.location.message}
                  </p>
                )}

                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" {...register("isAvailable")} />
                  Open to work
                </label>
              </div>
            </div>

            {/* Footer */}
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                disabled={isPending}
                onClick={() => handleOpenChange(false)}
              >
                Cancel
              </Button>

              <Button type="submit" disabled={isPending}>
                {isPending ? <Loader2Icon className="animate-spin" /> : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ImageCropDialog
        open={cropOpen}
        onOpenChange={setCropOpen}
        imageSrc={cropImage ?? ""}
        onCropComplete={handleCropSave}
        title="Crop your avatar"
        outputType="image/jpeg"
        quality={0.92}
      />
    </>
  );
}
