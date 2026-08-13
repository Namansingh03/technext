"use client";

import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/shared/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { Button } from "@/src/shared/ui/button";
import { EllipsisVertical } from "lucide-react";
import { useState, useTransition } from "react";
import { formatDate } from "@/src/shared/utils/formatDate";
import { CardWrapper } from "@/src/shared/components/CardWrapper";
import { Separator } from "@/src/shared/ui/separator";
import { Education } from "@/prisma/generated/client";
import { EducationSchemaType } from "@/src/features/User/schemas/addProfileSchema";
import { deleteTimelineEntry } from "@/src/features/User/actions/deleteActions";
import EducationEditDialog from "../../dialogs/ProfileDialogs/EducationEditDialog";

interface EducationCardProps {
  education?: Education[];
}

function formatDateFn(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export default function EducationCard({ education }: EducationCardProps) {
  const [open, setOpen] = useState(false);
  const [selectedEducation, setSelectedEducation] =
    useState<EducationSchemaType>();
  const [eduId, setEduId] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const handleAdd = () => {
    setSelectedEducation(undefined);
    setEduId("");
    setOpen(true);
  };

  const handleUpdate = (edu: Education) => {
    setSelectedEducation({
      school: edu.school,
      degree: edu.degree,
      field: edu.field,
      startDate: edu.startDate,
      endDate: edu.endDate,
      isCurrent: edu.isCurrent,
    });

    setEduId(edu.id);
    setOpen(true);
  };

  const handleDelete = async (educationId: string) => {
    console.log("Delete:", educationId);
    startTransition(async () => {
      const res = await deleteTimelineEntry(educationId, "Education");

      if (!res.success) {
        toast.error(res.message, { description: formatDate() });
        return;
      }

      toast.success(res.message, { description: formatDate() });
      router.refresh();
    });
  };

  const sortedEducation = [...(education || [])].sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
  );

  return (
    <>
      <CardWrapper>
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
            Education
          </p>

          <button
            onClick={handleAdd}
            className="text-xs font-medium text-blue-500 transition-colors hover:underline hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
          >
            + Add
          </button>
        </div>

        <Separator className="my-4 dark:bg-neutral-800" />

        {!education?.length ? (
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            No education added yet.
          </p>
        ) : (
          <div className="space-y-5">
            {sortedEducation.map((edu, index) => {
              const isLast = index === sortedEducation.length - 1;

              return (
                <div
                  key={edu.id}
                  className={`relative pl-4 ${
                    !isLast
                      ? "border-l border-blue-200 pb-5 dark:border-blue-900"
                      : ""
                  }`}
                >
                  <div className="absolute top-1.5 -left-1 h-2 w-2 rounded-full bg-blue-500 dark:bg-blue-400" />

                  <div className="flex justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                        {edu.degree} in {edu.field}
                      </p>

                      <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        {edu.school}
                      </p>

                      <p className="mt-1 text-xs text-neutral-400 dark:text-neutral-500">
                        {formatDateFn(edu.startDate)} —{" "}
                        {edu.isCurrent
                          ? "Present"
                          : edu.endDate
                            ? formatDateFn(edu.endDate)
                            : "—"}
                      </p>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="h-fit rounded-md p-1 transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800">
                          <EllipsisVertical
                            size={16}
                            className="cursor-pointer text-blue-500 dark:text-blue-400"
                          />
                        </button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Button
                            className="w-full"
                            variant={"secondary"}
                            onClick={() => handleUpdate(edu)}
                          >
                            update
                          </Button>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                          className="text-red-500"
                          onClick={() => handleDelete(edu.id)}
                        >
                          <Button
                            variant={"destructive"}
                            onClick={() => handleDelete(edu.id)}
                            disabled={isPending}
                            className="w-full"
                          >
                            delete
                          </Button>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardWrapper>

      <EducationEditDialog
        key={eduId || "new"}
        open={open}
        onOpenChange={setOpen}
        education={selectedEducation}
        educationId={eduId}
      />
    </>
  );
}
