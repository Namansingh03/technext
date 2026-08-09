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
import { EllipsisVertical } from "lucide-react";
import { useState, useTransition } from "react";
import { Button } from "@/src/shared/ui/button";
import { formatDate } from "@/src/shared/utils/formatDate";
import { CardWrapper } from "@/src/shared/components/CardWrapper";
import { Separator } from "@/src/shared/ui/separator";
import { WorkExperience } from "@/prisma/generated/client";
import { ExperienceSchemaType } from "@/src/features/candidate/schemas/ProfileSchema";
import { deleteTimelineEntry } from "@/src/features/candidate/actions/deleteActions";
import ExperienceEditDialog from "@/src/features/candidate/dialogs/ProfileDialogs/ExperienceEditDialog";

interface ExperienceCardProps {
  experiences?: WorkExperience[];
}

function formatMonthYear(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export default function ExperienceCard({ experiences }: ExperienceCardProps) {
  const [open, setOpen] = useState(false);

  const [selectedExperience, setSelectedExperience] =
    useState<ExperienceSchemaType>();

  const [experienceId, setExperienceId] = useState("");

  const [isPending, startTransition] = useTransition();

  const router = useRouter();

  const handleAdd = () => {
    setSelectedExperience(undefined);
    setExperienceId("");
    setOpen(true);
  };

  const handleUpdate = (exp: WorkExperience) => {
    setSelectedExperience({
      company: exp.company,
      title: exp.title,
      location: exp.location ?? "",
      description: exp.description ?? "",
      startDate: exp.startDate,
      endDate: exp.endDate,
      isCurrent: exp.isCurrent,
    });

    setExperienceId(exp.id);

    setOpen(true);
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      try {
        const res = await deleteTimelineEntry(id, "WorkExperience");

        if (!res.success) {
          toast.error(res.message, {
            description: formatDate(),
          });
          return;
        }

        toast.success("Experience deleted successfully", {
          description: formatDate(),
        });

        router.refresh();
      } catch {
        toast.error("Something went wrong", {
          description: formatDate(),
        });
      }
    });
  };

  const sortedExperiences = [...(experiences || [])].sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
  );

  return (
    <>
      <CardWrapper>
        {/* Header */}
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium uppercase text-gray-400">
            Work Experience
          </p>

          <button
            onClick={handleAdd}
            className="text-xs font-medium text-blue-500 hover:underline"
          >
            + Add
          </button>
        </div>

        <Separator className="my-4" />

        {/* Empty State */}
        {!experiences?.length ? (
          <p className="text-sm text-muted-foreground">
            No experience added yet.
          </p>
        ) : (
          <div className="space-y-5">
            {sortedExperiences.map((exp, index) => {
              const isLast = index === sortedExperiences.length - 1;

              return (
                <div
                  key={exp.id}
                  className={`relative pl-4 ${
                    !isLast ? "border-l border-blue-300 pb-5" : ""
                  }`}
                >
                  {/* Dot */}
                  <div className="absolute top-1.5 -left-1 h-2 w-2 rounded-full bg-blue-500" />

                  <div className="flex justify-between gap-4">
                    {/* Left */}
                    <div>
                      <p className="text-sm font-medium">{exp.title}</p>

                      <p className="text-sm text-muted-foreground">
                        {exp.company}
                        {exp.location && ` · ${exp.location}`}
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        {formatMonthYear(exp.startDate)} —{" "}
                        {exp.isCurrent
                          ? "Present"
                          : exp.endDate
                            ? formatMonthYear(exp.endDate)
                            : "—"}
                      </p>

                      {exp.description && (
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
                          {exp.description}
                        </p>
                      )}
                    </div>

                    {/* Menu */}
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <button>
                          <EllipsisVertical
                            size={16}
                            className="cursor-pointer text-blue-500"
                          />
                        </button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Button
                            className="w-full"
                            variant="secondary"
                            onClick={() => handleUpdate(exp)}
                          >
                            Update
                          </Button>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem>
                          <Button
                            className="w-full"
                            variant="destructive"
                            disabled={isPending}
                            onClick={() => handleDelete(exp.id)}
                          >
                            Delete
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

      {/* Dialog */}
      <ExperienceEditDialog
        key={experienceId || "new"}
        open={open}
        onOpenChange={setOpen}
        experience={selectedExperience}
        experienceId={experienceId}
      />
    </>
  );
}
