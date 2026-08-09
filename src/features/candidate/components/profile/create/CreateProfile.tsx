/* eslint-disable react-hooks/incompatible-library */
"use client";

import { toast } from "sonner";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselApi,
} from "@/src/shared/ui/carousel";
import { Input } from "@/src/shared/ui/input";
import {
  AddProfileSchema,
  AddProfileSchemaType,
} from "@/src/features/candidate/schemas/ProfileSchema";
import { Button } from "@/src/shared/ui/button";
import { useForm } from "react-hook-form";
import { Textarea } from "@/src/shared/ui/textarea";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { formatDate } from "@/src/shared/utils/formatDate";
import SelectedSkills from "@/src/shared/components/SelectedSkills";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateAddProfile } from "@/src/features/candidate/actions/updateActions";
import { FaGithub, FaLinkedin, FaGlobe, FaUser } from "react-icons/fa";
import { Fullscreen, Loader2, MoveLeftIcon, MoveRightIcon } from "lucide-react";
import Image from "next/image";

const LINKS = [
  { label: "Github", icon: <FaGithub /> },
  { label: "Portfolio", icon: <FaGlobe /> },
  { label: "LinkedIn", icon: <FaLinkedin /> },
  { label: "Resume", icon: <FaUser /> },
];

const STEPS = [
  { label: "banner", index: 0 },
  { label: "skills", index: 1 },
  { label: "about", index: 2 },
  { label: "links", index: 3 },
];

const AddProfilePage = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [currentStep, setCurrentStep] = useState(0);
  const [isPending, startTransition] = useTransition();
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [bannerPreview, setBannerPreview] = useState<string>();
  const formattedDate = formatDate();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    trigger,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AddProfileSchemaType>({
    resolver: zodResolver(AddProfileSchema),
    defaultValues: {
      bannerImage: undefined,
      skills: selectedSkills,
      about: "",
      links: [
        { label: "GitHub", url: "" },
        { label: "Portfolio", url: "" },
        { label: "LinkedIn", url: "" },
        { label: "Resume", url: "" },
      ],
    },
    mode: "onSubmit",
  });

  const skills = watch("skills");

  const next = async (fields: (keyof AddProfileSchemaType)[]) => {
    const valid = await trigger(fields);

    if (valid) {
      api?.scrollNext();
      setCurrentStep((s) => Math.min(s + 1, STEPS.length - 1));
    }
  };

  const prev = () => {
    api?.scrollPrev();
    setCurrentStep((s) => Math.max(s - 1, 0));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const preview = URL.createObjectURL(file);
    setBannerPreview(preview);
  };

  const onSubmit = (data: AddProfileSchemaType) => {
    startTransition(async () => {
      const res = await updateAddProfile(data);

      if (!res.success) {
        if (res.redirectUrl) {
          router.push(res.redirectUrl);
          return;
        }

        toast.error(res.message, { description: formattedDate });
        return;
      }

      toast.success("Profile created ", { description: formattedDate });
    });
  };

  return (
    <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg border border-zinc-100 overflow-hidden">
      {/* Header */}
      <div className="px-8 pt-8 pb-5 border-b border-zinc-100">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-lg font-semibold tracking-tight text-zinc-900 font-serif">
            TalentGate
          </h1>
          <span className="text-xs text-zinc-400 font-medium">
            Step {currentStep + 1} of {STEPS.length}
          </span>
        </div>
        <p className="text-sm text-zinc-500 mb-5">create you profile.</p>

        {/* Step progress dots */}
        <div className="flex items-center gap-2">
          {STEPS.map((step, i) => (
            <div key={step.index} className="flex items-center gap-2">
              <div
                className={`h-2 w-2 rounded-full transition-all duration-300 ${
                  i < currentStep
                    ? "bg-zinc-800 scale-100"
                    : i === currentStep
                      ? "bg-zinc-800 scale-125"
                      : "bg-zinc-200"
                }`}
              />
              {i < STEPS.length - 1 && (
                <div
                  className={`h-px w-8 transition-all duration-500 ${
                    i < currentStep ? "bg-zinc-800" : "bg-zinc-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form body */}
      <form onSubmit={handleSubmit(onSubmit)} className="px-8 py-6">
        <Carousel setApi={setApi} opts={{ watchDrag: false }}>
          <CarouselContent>
            <CarouselItem>
              <div className="flex flex-col gap-y-1 mb-3">
                <label className="text-sm font-medium">Avatar</label>

                <p className="text-xs text-gray-400">
                  Upload your profile picture.
                </p>
              </div>

              <div className="flex flex-col items-center gap-y-4">
                {bannerPreview ? (
                  <Image
                    src={bannerPreview}
                    alt="avatar"
                    width={100}
                    height={160}
                    className="w-full rounded-full object-cover h-40"
                  />
                ) : (
                  <div className="w-40 h-40 rounded-full border-4 border-gray-300 flex items-center justify-center">
                    <Fullscreen className="w-24 h-24 text-gray-600" />
                  </div>
                )}

                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                />

                {errors.bannerImage && (
                  <p className="text-red-500 text-xs">
                    {errors.bannerImage.message}
                  </p>
                )}
              </div>

              <div className="flex justify-end mt-8">
                <Button type="button" onClick={() => next(["bannerImage"])}>
                  Next
                  <MoveRightIcon className="ml-1" />
                </Button>
              </div>
            </CarouselItem>
            {/* STEP 1: skills */}
            <CarouselItem className="flex flex-col gap-y-4">
              <div className="flex flex-col gap-y-1">
                <label className="text-sm font-medium text-zinc-700">
                  Skills
                </label>
                <p className="text-xs text-zinc-400">
                  add skills to your profile.
                </p>
              </div>
              <div className="flex flex-row gap-x-3">
                <SelectedSkills
                  skills={skills || []}
                  onChange={(vals) => {
                    setSelectedSkills(vals);
                    setValue("skills", vals, { shouldValidate: true });
                  }}
                />
              </div>
              {errors.skills && (
                <p className="text-red-400">{errors.skills.message}</p>
              )}
              <div className="flex flex-row justify-between w-full">
                <Button type="button" onClick={prev}>
                  {" "}
                  {/* ✅ Bug 3 fix */}
                  <MoveLeftIcon />
                  prev
                </Button>
                <Button type="button" onClick={() => next(["skills"])}>
                  {" "}
                  {/* ✅ Bug 3 fix */}
                  next
                  <MoveRightIcon />
                </Button>
              </div>
            </CarouselItem>

            {/* STEP 2: about */}
            <CarouselItem>
              <div className="flex flex-col gap-y-1">
                <label className="text-sm font-medium text-zinc-700">
                  About
                </label>
                <p className="text-xs text-zinc-400">about yourself.</p>
              </div>
              <Textarea
                className="shadow-md w-full overflow-scroll border border-gray-500 rounded-2xl p-2"
                placeholder="max 500 characters"
                {...register("about")}
              />
              {errors.about && (
                <p className="text-red-400">{errors.about.message}</p>
              )}
              <div className="flex flex-row justify-between w-full mt-4">
                <Button type="button" onClick={prev}>
                  {" "}
                  {/* ✅ Bug 3 fix */}
                  <MoveLeftIcon />
                  prev
                </Button>
                <Button type="button" onClick={() => next(["about"])}>
                  {" "}
                  {/* ✅ Bug 3 fix */}
                  next
                  <MoveRightIcon />
                </Button>
              </div>
            </CarouselItem>

            {/* STEP 3: links */}
            <CarouselItem className="flex flex-col gap-y-4">
              <div className="flex flex-col gap-y-1">
                <label className="text-sm font-medium text-zinc-700">
                  links
                </label>
                <p className="text-xs text-zinc-400">
                  A one-liner that captures who you are professionally.
                </p>
              </div>
              <div className="flex flex-col gap-y-5 ">
                <div className="flex flex-col gap-y-5">
                  {LINKS.map((link, index) => (
                    <div className="flex flex-col gap-y-2" key={index}>
                      <label className="flex items-center gap-2 text-sm text-gray-700">
                        {link.icon}
                        {link.label}
                      </label>

                      <Input
                        placeholder={`Enter ${link.label} URL`}
                        {...register(`links.${index}.url`)}
                      />
                      {errors.links?.[index]?.url && (
                        <p className="text-red-400 text-xs">
                          {errors.links[index]?.url?.message}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-between pt-2">
                <Button type="button" variant="ghost" onClick={prev}>
                  {/* ✅ Bug 3 fix */}← Back
                </Button>
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
  );
};

export default AddProfilePage;
