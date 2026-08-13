"use client";

import { toast } from "sonner";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/shared/ui/dialog";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import {
  ExperienceSchemaType,
  experienceSchema,
} from "@/src/features/User/schemas/addProfileSchema";
import { Button } from "@/src/shared/ui/button";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/src/shared/ui/field";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/shared/ui/popover";
import { cn } from "@/src/shared/utils/utils";
import { useRouter } from "next/navigation";
import { Input } from "@/src/shared/ui/input";
import { formatDate } from "@/src/shared/utils/formatDate";
import { Checkbox } from "@/src/shared/ui/checkbox";
import { Textarea } from "@/src/shared/ui/textarea";
import { Calendar } from "@//src/shared/ui/calendar";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, Loader2Icon } from "lucide-react";
import { UpdateProfileExperience } from "@/src/features/User/actions/updateActions";

interface ExperienceEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  experience?: ExperienceSchemaType;
  experienceId?: string;
}

export default function ExperienceEditDialog({
  open,
  onOpenChange,
  experience,
  experienceId,
}: ExperienceEditDialogProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ExperienceSchemaType>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      company: experience?.company ?? "",
      title: experience?.title ?? "",
      location: experience?.location ?? "",
      description: experience?.description ?? "",
      isCurrent: experience?.isCurrent ?? false,
      startDate: experience?.startDate ?? undefined,
      endDate: experience?.endDate ?? null,
    },
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const isCurrent = watch("isCurrent");
  const startDate = watch("startDate");
  const endDate = watch("endDate");

  const onSubmit = async (values: ExperienceSchemaType) => {
    startTransition(async () => {
      const res = await UpdateProfileExperience({
        experience: values,
        experienceId: experienceId || undefined,
      });

      if (!res.success && res.redirectUrl) {
        toast.error(res.message, { description: formatDate() });
        router.push(res.redirectUrl);
        return;
      }

      if (!res.success) {
        toast.error(res.message, { description: formatDate() });
        return;
      }

      toast.success(res.message, { description: formatDate() });
      router.refresh();
      onOpenChange(false);
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Experience</DialogTitle>

          <DialogDescription>
            {experience
              ? "Update your work experience"
              : "Add your work experience"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <FieldSet>
            <FieldGroup>
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Job Title */}
                <Field>
                  <FieldLabel>Title</FieldLabel>

                  <FieldContent>
                    <Input
                      placeholder="Frontend Developer"
                      {...register("title")}
                    />

                    <FieldError>{errors.title?.message}</FieldError>
                  </FieldContent>
                </Field>

                {/* Current */}
                <Field>
                  <FieldLabel>Currently working</FieldLabel>

                  <FieldContent className="flex flex-row items-center gap-2">
                    <Checkbox
                      checked={isCurrent}
                      onCheckedChange={(checked) =>
                        setValue("isCurrent", !!checked, {
                          shouldValidate: true,
                        })
                      }
                    />

                    <p className="text-sm">I currently work here</p>
                  </FieldContent>
                </Field>

                {/* Company */}
                <Field>
                  <FieldLabel>Company</FieldLabel>

                  <FieldContent>
                    <Input placeholder="Google" {...register("company")} />

                    <FieldError>{errors.company?.message}</FieldError>
                  </FieldContent>
                </Field>

                {/* Location */}
                <Field>
                  <FieldLabel>Location</FieldLabel>

                  <FieldContent>
                    <Input
                      placeholder="Bangalore, India"
                      {...register("location")}
                    />

                    <FieldError>{errors.location?.message}</FieldError>
                  </FieldContent>
                </Field>
              </div>

              {/* Description */}
              <Field>
                <FieldLabel>Description</FieldLabel>

                <FieldContent>
                  <Textarea
                    rows={5}
                    placeholder="Describe your responsibilities, achievements, technologies used..."
                    {...register("description")}
                  />

                  <FieldError>{errors.description?.message}</FieldError>
                </FieldContent>
              </Field>

              {/* Dates */}
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Start Date */}
                <Field>
                  <FieldLabel>Start Date</FieldLabel>

                  <FieldContent>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !startDate && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />

                          {startDate ? (
                            format(startDate, "MMM yyyy")
                          ) : (
                            <span>Pick start date</span>
                          )}
                        </Button>
                      </PopoverTrigger>

                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={startDate}
                          onSelect={(date) =>
                            setValue("startDate", date!, {
                              shouldValidate: true,
                            })
                          }
                          captionLayout="dropdown"
                        />
                      </PopoverContent>
                    </Popover>

                    <FieldError>{errors.startDate?.message}</FieldError>
                  </FieldContent>
                </Field>

                {/* End Date */}
                {!isCurrent && (
                  <Field>
                    <FieldLabel>End Date</FieldLabel>

                    <FieldContent>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !endDate && "text-muted-foreground",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />

                            {endDate ? (
                              format(endDate, "MMM yyyy")
                            ) : (
                              <span>Pick end date</span>
                            )}
                          </Button>
                        </PopoverTrigger>

                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={endDate ?? undefined}
                            onSelect={(date) =>
                              setValue("endDate", date ?? null, {
                                shouldValidate: true,
                              })
                            }
                            captionLayout="dropdown"
                          />
                        </PopoverContent>
                      </Popover>

                      <FieldError>{errors.endDate?.message}</FieldError>
                    </FieldContent>
                  </Field>
                )}
              </div>
            </FieldGroup>
          </FieldSet>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <Loader2Icon className="animate-spin" />
              ) : experience ? (
                "Update"
              ) : (
                "Save"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
