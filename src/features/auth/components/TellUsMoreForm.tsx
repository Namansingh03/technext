/* eslint-disable react-hooks/incompatible-library */
"use client";

import z from "zod";
import Image from "next/image";
import React, { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselApi,
} from "@/src/shared/ui/carousel";
import { Input } from "@/src/shared/ui/input";
import {
  TellUsMoreSchema,
  TellUsMoreSchemaType,
} from "@/src/features/auth/schemas/TellUsMoreSchema";
import { Button } from "@/src/shared/ui/button";
import { Controller, useForm } from "react-hook-form";
import { Textarea } from "@/src/shared/ui/textarea";
import { useRouter } from "next/navigation";
import { formatDate } from "@/src/shared/utils/formatDate";
import { createUser } from "@/src/features/auth/actions/createAction";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, MoveLeft, MoveRight, User2 } from "lucide-react";
import { ImageCropDialog } from "@/src/shared/components/ImageCropDialog";
import StepIndicator from "@/src/shared/components/StepIndicator";
import { LocationAutocomplete } from "../../location/components/autoCompleteLocations";
import { StringArrayInput } from "@/src/shared/components/StringArrayInput";
import AddResume from "@/src/shared/components/AddResume";

const TellUsAboutYourself = ({ username }: { username: string }) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const count = api?.scrollSnapList().length ?? 0;
  const [cropOpen, setCropOpen] = useState(false);
  const [cropImage, setCropImage] = useState<string | null>(null);
  const [avatarImagePrev, setAvatarImagePrev] = useState<string | undefined>();

  const [isPending, startTransition] = useTransition();

  const formattedDate = formatDate();
  const router = useRouter();

  const {
    register,
    trigger,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
    control,
  } = useForm<TellUsMoreSchemaType>({
    resolver: zodResolver(TellUsMoreSchema),
    defaultValues: {
      image: undefined,
      headline: "",
      location: {},
      skills: [],
      bio: "",
      resume: [],
    },
    mode: "onSubmit",
  });

  const skills = watch("skills");
  const selectedResumes = watch("resume");

  React.useEffect(() => {
    if (!api) return;

    const handleSelect = () => {
      setCurrent(api.selectedScrollSnap() + 1);
    };

    api.on("select", handleSelect);

    return () => {
      api.off("select", handleSelect);
    };
  }, [api]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const preview = URL.createObjectURL(file);

    setCropImage(preview);
    setCropOpen(true);
  };

  const handleCropSave = (url: string, blob: Blob) => {
    const file = new File([blob], "avatar.jpg", {
      type: blob.type,
    });

    setValue("image", file, {
      shouldValidate: true,
    });

    setAvatarImagePrev(url);
  };

  const next = async (fields?: (keyof TellUsMoreSchemaType)[]) => {
    if (fields) {
      const isValid = await trigger(fields);

      if (!isValid) return;
    }

    api?.scrollNext();
  };

  const prev = () => {
    api?.scrollPrev();
  };

  const onSubmit = (data: z.infer<typeof TellUsMoreSchema>) => {
    startTransition(async () => {
      const res = await createUser(data);
      if (!res.success) {
        toast.error(res.message, {
          description: formattedDate,
        });
        if (res.redirectUrl) {
          router.push(res.redirectUrl);
        }
        return;
      }
      toast.success(res.message, {
        description: formattedDate,
      });
      router.push(`/${username}`);
    });
  };

  return (
    <div className="w-full max-w-xl dark:bg-neutral-900 dark:border-neutral-800 bg-white rounded-2xl shadow-lg border border-zinc-100 overflow-hidden">
      <div className="px-8 pt-8 pb-5 dark:bg-neutral-900 dark:border-neutral-800 border-b border-zinc-100">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-lg dark:text-neutral-100 font-semibold tracking-tight text-zinc-900 font-serif">
            TechNext
          </h1>

          <span className="text-xs dark:text-neutral-500 text-zinc-400">
            Step {current} of {count}
          </span>
        </div>
        <p className="text-sm text-zinc-500 dark:text-neutral-400 mb-5">
          Tell us about yourself to personalize your experience.
        </p>
        <StepIndicator count={count} current={current} />
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-y-3"
        >
          <Carousel setApi={setApi} opts={{ watchDrag: false }}>
            <CarouselContent>
              {/* Avatar */}
              <CarouselItem>
                <div className="flex flex-col gap-y-1 mb-3">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Avatar image
                  </label>

                  <p className="text-xs text-zinc-400 dark:text-zinc-500">
                    Choose an image for your profile.
                  </p>
                </div>

                <div className="w-full flex flex-col items-center justify-center gap-y-3">
                  {avatarImagePrev ? (
                    <Image
                      alt="Avatar preview"
                      src={avatarImagePrev}
                      width={150}
                      height={150}
                      className="rounded-full w-50 h-50 object-cover my-3"
                    />
                  ) : (
                    <div className="w-40 h-40 rounded-full border-4 border-gray-800 dark:border-gray-300 my-3 flex items-center p-5 justify-center">
                      <User2 className="w-full h-full text-gray-800 dark:text-gray-300" />
                    </div>
                  )}

                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>

                {errors.image && (
                  <p className="text-red-400">{errors.image.message}</p>
                )}

                <div className="w-full flex items-end justify-end mt-10">
                  <Button type="button" onClick={() => next(["image"])}>
                    Next
                    <MoveRight className="ml-1" />
                  </Button>
                </div>
              </CarouselItem>

              {/* Specializations */}
              <CarouselItem className="flex flex-col gap-y-4">
                <div className="flex flex-col gap-y-1">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Headline
                  </label>

                  <p className="text-xs text-zinc-400 dark:text-zinc-500">
                    add a headline to your profile
                  </p>
                </div>

                <Input
                  className="p-5"
                  placeholder="Web developer, admin, UI/UX designer"
                  {...register("headline")}
                />

                {errors.headline && (
                  <p className="text-red-500 dark:text-red-400 text-xs">
                    {errors.headline.message}
                  </p>
                )}

                <div className="flex flex-row justify-between w-full">
                  <Button type="button" onClick={prev}>
                    <MoveLeft className="mr-1" />
                    Prev
                  </Button>

                  <Button type="button" onClick={() => next(["headline"])}>
                    Next
                    <MoveRight className="ml-1" />
                  </Button>
                </div>
              </CarouselItem>

              {/* Location */}
              <CarouselItem className="flex flex-col gap-y-4">
                <div className="flex flex-col gap-y-1">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Location
                  </label>

                  <p className="text-xs text-zinc-400 dark:text-zinc-500">
                    Your current location.
                  </p>
                </div>

                <Controller
                  control={control}
                  name="location"
                  render={({ field, fieldState }) => (
                    <LocationAutocomplete
                      value={field.value}
                      onSelect={field.onChange}
                      hasError={!!fieldState.error}
                    />
                  )}
                />

                {errors.location && (
                  <p className="text-red-500 dark:text-red-400 text-xs">
                    {errors.location.message}
                  </p>
                )}

                <div className="flex flex-row justify-between w-full mt-4">
                  <Button type="button" onClick={prev}>
                    <MoveLeft className="mr-1" />
                    Prev
                  </Button>

                  <Button type="button" onClick={() => next(["location"])}>
                    Next
                    <MoveRight className="ml-1" />
                  </Button>
                </div>
              </CarouselItem>

              {/* Bio */}
              <CarouselItem className="flex flex-col gap-y-4">
                <div className="flex flex-col gap-y-1">
                  <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                    Your short bio
                  </label>

                  <p className="text-xs text-zinc-400 dark:text-zinc-500">
                    A short description about yourself.
                  </p>
                </div>

                <Textarea
                  rows={3}
                  placeholder="Full-stack engineer who loves building products people care about."
                  className="bg-zinc-50 dark:bg-neutral-800 border-zinc-200 dark:border-neutral-700 focus:bg-white dark:focus:bg-neutral-800 resize-none transition-colors text-sm"
                  {...register("bio")}
                />

                {errors.bio && (
                  <p className="text-red-500 dark:text-red-400 text-xs">
                    {errors.bio.message}
                  </p>
                )}

                <div className="flex justify-between pt-2">
                  <Button type="button" onClick={prev}>
                    <MoveLeft className="mr-1" />
                    Prev
                  </Button>

                  <Button type="button" onClick={() => next(["bio"])}>
                    Next
                    <MoveRight className="ml-1" />
                  </Button>
                </div>
              </CarouselItem>

              <CarouselItem className="flex flex-col gap-y-4">
                <div className="flex flex-col gap-y-1">
                  <label className="text-sm dark:text-neutral-300 font-medium text-zinc-700">
                    Skills
                  </label>
                  <p className="text-xs text-zinc-400 flex flex-col">
                    <span className="text-neutral-600 dark:text-neutral-300">
                      add skills to your profile.
                    </span>
                    <span className="text-muted-foreground dark:text-neutral-500">
                      at least 5 skills are required{" "}
                    </span>
                  </p>
                </div>
                <div className="flex flex-row gap-x-3">
                  <StringArrayInput
                    placeholder="add a skill"
                    variant="badge"
                    buttonText="add"
                    value={skills ?? []}
                    onChange={(value) => {
                      setValue("skills", value, {
                        shouldValidate: true,
                        shouldDirty: true,
                        shouldTouch: true,
                      });
                    }}
                  />
                </div>
                {errors.skills && (
                  <p className="text-red-400">{errors.skills.message}</p>
                )}
                <div className="flex justify-between pt-2">
                  <Button type="button" onClick={prev}>
                    <MoveLeft className="mr-1" />
                    Prev
                  </Button>

                  <Button type="button" onClick={() => next(["skills"])}>
                    Next
                    <MoveRight className="ml-1" />
                  </Button>
                </div>
              </CarouselItem>
              <CarouselItem className="flex flex-col gap-y-4">
                <div className="flex flex-col gap-y-1">
                  <label className="text-sm dark:text-neutral-300 font-medium text-zinc-700">
                    Resume
                  </label>
                  <p className="text-xs text-zinc-400 flex flex-col">
                    add Resumes to your profile.
                  </p>
                </div>

                <AddResume
                  resumes={selectedResumes ?? []}
                  errors={errors.resume?.message}
                  onChange={(value) => {
                    setValue("resume", value, {
                      shouldValidate: true,
                      shouldDirty: true,
                    });
                  }}
                />

                {errors.resume && (
                  <p className="text-red-400">{errors.resume.message}</p>
                )}
                <div className="flex justify-between pt-2">
                  <Button type="button" onClick={prev}>
                    <MoveLeft className="mr-1" />
                    Prev
                  </Button>

                  <Button
                    type="submit"
                    disabled={isPending}
                    className="px-6 bg-zinc-900 hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
                  >
                    {isPending ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      "Finish setup"
                    )}
                  </Button>
                </div>
              </CarouselItem>
            </CarouselContent>
          </Carousel>
        </form>
      </div>

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

export default TellUsAboutYourself;
