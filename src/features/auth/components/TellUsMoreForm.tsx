"use client";

import z from "zod";
import Image from "next/image";
import React from "react";
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
import { useForm } from "react-hook-form";
import { Textarea } from "@/src/shared/ui/textarea";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { formatDate } from "@/src/shared/utils/formatDate";
import { createUser } from "@/src/features/auth/actions/createAction";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, MoveLeft, MoveRight, User2 } from "lucide-react";
import { ImageCropDialog } from "@/src/shared/components/ImageCropDialog";

const rolesVals = ["admin", "candidate"] as const;

const TellUsAboutYourself = ({ username }: { username: string }) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
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
    watch,
    setValue,
    formState: { errors },
  } = useForm<TellUsMoreSchemaType>({
    resolver: zodResolver(TellUsMoreSchema),
    defaultValues: {
      image: undefined,
      role: "candidate",
      headline: "",
      location: "",
      bio: "",
    },
    mode: "onSubmit",
  });

  React.useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  // eslint-disable-next-line react-hooks/incompatible-library
  const intent = watch("role");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const preview = URL.createObjectURL(file);
    setCropImage(preview);
    setCropOpen(true);
  };

  const handleCropSave = (url: string, blob: Blob) => {
    const file = new File([blob], "logo.jpg", { type: blob.type });
    setValue("image", file, { shouldValidate: true });
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
      if (intent === "admin") {
        toast.success(res.message, { description: "now create a company" });
        router.push("/createCompany");
      } else {
        toast.success(res.message, { description: formattedDate });
        router.push(`/user/${username}/profile/create`);
      }
    });
  };

  const StepIndicator = () => (
    <div className="flex items-center justify-center gap-2 py-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`rounded-full transition-all duration-300 ${
            i + 1 === current ? "w-6 h-2 bg-zinc-900" : "w-2 h-2 bg-zinc-300"
          }`}
        />
      ))}
    </div>
  );

  return (
    <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg border border-zinc-100 overflow-hidden">
      {/* Header */}
      <div className="px-8 pt-8 pb-5 border-b border-zinc-100">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-lg font-semibold tracking-tight text-zinc-900 font-serif">
            TalentGate
          </h1>
          {/* Step counter text */}
          <span className="text-xs text-zinc-400">
            Step {current} of {count}
          </span>
        </div>
        <p className="text-sm text-zinc-500 mb-5">
          Tell us about yourself to personalize your experience.
        </p>

        <StepIndicator />

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-y-3"
        >
          <Carousel setApi={setApi} opts={{ watchDrag: false }}>
            <CarouselContent>
              {/* STEP 0: ROLE */}
              <CarouselItem>
                <div className="flex flex-col gap-y-1 mb-3">
                  <label className="text-sm font-medium text-zinc-700">
                    I am
                  </label>
                  <p className="text-xs text-zinc-400">
                    Tell us what you are here for.
                  </p>
                </div>
                <div className="w-full grid grid-cols-2 gap-2">
                  {rolesVals.map((role, index) => (
                    <Button
                      key={index}
                      type="button"
                      variant={intent === role ? "default" : "secondary"}
                      onClick={() => setValue("role", role)}
                    >
                      {role}
                    </Button>
                  ))}
                </div>
                <div className="w-full flex items-end justify-end mt-10">
                  <Button type="button" onClick={() => next()}>
                    next <MoveRight className="ml-1" />
                  </Button>
                </div>
              </CarouselItem>

              <CarouselItem>
                <div className="flex flex-col gap-y-1 mb-3">
                  <label className="text-sm font-medium text-zinc-700">
                    Avatar image
                  </label>
                  <p className="text-xs text-zinc-400">
                    Make you identity go unnoticed.
                  </p>
                </div>
                <div className="w-full flex flex-col items-center justify-center gap-y-3">
                  {avatarImagePrev ? (
                    <Image
                      alt="avatar"
                      src={avatarImagePrev}
                      width={150}
                      height={150}
                      className="rounded-full w-50 h-50 object-cover my-3"
                    />
                  ) : (
                    <div className="w-40 h-40 rounded-full border-4 border-gray-800 my-3 flex items-center p-5 justify-center">
                      <User2 className="w-full h-full text-gray-800" />
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
                <div className="w-full flex items-end justify-between mt-10">
                  <Button type="button" onClick={prev}>
                    <MoveLeft className="mr-1" /> prev
                  </Button>
                  <Button type="button" onClick={() => next(["image"])}>
                    next <MoveRight className="ml-1" />
                  </Button>
                </div>
              </CarouselItem>

              {/* STEP 1: HEADLINE */}
              <CarouselItem className="flex flex-col gap-y-4">
                <div className="flex flex-col gap-y-1">
                  <label className="text-sm font-medium text-zinc-700">
                    What are your specializations?
                  </label>
                  <p className="text-xs text-zinc-400">
                    What defines you best.
                  </p>
                </div>
                <Input
                  className="p-5"
                  placeholder="Web developer, admin, CEO"
                  {...register("headline")}
                />
                {errors.headline && (
                  <p className="text-red-500 text-xs">
                    {errors.headline.message}
                  </p>
                )}
                <div className="flex flex-row justify-between w-full">
                  <Button type="button" onClick={prev}>
                    <MoveLeft className="mr-1" /> prev
                  </Button>
                  <Button type="button" onClick={() => next(["headline"])}>
                    next <MoveRight className="ml-1" />
                  </Button>
                </div>
              </CarouselItem>

              {/* STEP 2: LOCATION */}
              <CarouselItem className="flex flex-col gap-y-4">
                <div className="flex flex-col gap-y-1">
                  <label className="text-sm font-medium text-zinc-700">
                    Location
                  </label>
                  <p className="text-xs text-zinc-400">Your office location.</p>
                </div>
                <Input placeholder="city, country" {...register("location")} />
                {errors.location && (
                  <p className="text-red-500 text-xs">
                    {errors.location.message}
                  </p>
                )}
                <div className="flex flex-row justify-between w-full mt-4">
                  <Button type="button" onClick={prev}>
                    <MoveLeft className="mr-1" /> prev
                  </Button>
                  {/* ✅ Fix 7: validates "location" before proceeding */}
                  <Button type="button" onClick={() => next(["location"])}>
                    next <MoveRight className="ml-1" />
                  </Button>
                </div>
              </CarouselItem>

              {/* STEP 3: BIO */}
              <CarouselItem className="flex flex-col gap-y-4">
                <div className="flex flex-col gap-y-1">
                  <label className="text-sm font-medium text-zinc-700">
                    Your short bio
                  </label>
                  <p className="text-xs text-zinc-400">
                    A one-liner that captures who you are professionally.
                  </p>
                </div>
                <Textarea
                  rows={3}
                  placeholder="Full-stack engineer who loves building products people care about."
                  className="bg-zinc-50 border-zinc-200 focus:bg-white resize-none transition-colors text-sm"
                  {...register("bio")}
                />
                {errors.bio && (
                  <p className="text-red-500 text-xs">{errors.bio.message}</p>
                )}
                <div className="flex justify-between pt-2">
                  <Button type="button" onClick={prev}>
                    <MoveLeft className="mr-1" /> prev
                  </Button>
                  {/* ✅ Fix 8: only slide 4 has the submit button */}
                  <Button
                    type="submit"
                    disabled={isPending}
                    className="px-6 bg-zinc-900 hover:bg-zinc-700"
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
