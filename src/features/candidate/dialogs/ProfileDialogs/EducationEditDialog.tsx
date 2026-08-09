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
import {
  educationSchema,
  EducationSchemaType,
} from "@/src/features/candidate/schemas/ProfileSchema";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Input } from "@/src/shared/ui/input";
import { Button } from "@/src/shared/ui/button";
import { formatDate } from "@/src/shared/utils/formatDate";
import { Checkbox } from "@/src/shared/ui/checkbox";
import { Calendar } from "@//src/shared/ui/calendar";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, Loader2Icon } from "lucide-react";
import { UpdateProfileEducation } from "@/src/features/candidate/actions/updateActions";

interface EducationEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  education?: EducationSchemaType;
  educationId?: string;
}

export default function EducationEditDialog({
  open,
  onOpenChange,
  education,
  educationId,
}: EducationEditDialogProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<EducationSchemaType>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      school: education?.school ?? "",
      degree: education?.degree ?? "",
      field: education?.field ?? "",
      startDate: education?.startDate ?? undefined,
      endDate: education?.endDate ?? null,
      isCurrent: education?.isCurrent ?? false,
    },
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const isCurrent = watch("isCurrent");
  const startDate = watch("startDate");
  const endDate = watch("endDate");

  const onSubmit = async (values: EducationSchemaType) => {
    startTransition(async () => {
      const res = await UpdateProfileEducation({
        education: values,
        educationId: educationId || undefined,
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
          <DialogTitle>Education</DialogTitle>

          <DialogDescription>
            {education ? "Update your education" : "Add your education"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <FieldSet>
            <FieldGroup>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field>
                  <FieldLabel>School</FieldLabel>
                  <FieldContent>
                    <Input
                      placeholder="Harvard University"
                      {...register("school")}
                    />
                    <FieldError>{errors.school?.message}</FieldError>
                  </FieldContent>
                </Field>

                <Field>
                  <FieldLabel>Currently studying</FieldLabel>

                  <FieldContent className="flex flex-row items-center gap-2">
                    <Checkbox
                      checked={isCurrent}
                      onCheckedChange={(checked) =>
                        setValue("isCurrent", !!checked, {
                          shouldValidate: true,
                        })
                      }
                    />

                    <p>I am currently studying here</p>
                  </FieldContent>
                </Field>

                <Field>
                  <FieldLabel>Degree</FieldLabel>
                  <FieldContent>
                    <Input
                      placeholder="Bachelor of Science"
                      {...register("degree")}
                    />
                    <FieldError>{errors.degree?.message}</FieldError>
                  </FieldContent>
                </Field>

                <Field>
                  <FieldLabel>Field of Study</FieldLabel>

                  <FieldContent>
                    <Input
                      placeholder="Computer Science"
                      {...register("field")}
                    />
                    <FieldError>{errors.field?.message}</FieldError>
                  </FieldContent>
                </Field>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {/* Start Date */}
                <Field>
                  <FieldLabel>Start Date</FieldLabel>

                  <FieldContent>
                    <Popover>
                      <PopoverTrigger>
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
                        <PopoverTrigger>
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
              ) : education ? (
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
