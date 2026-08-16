"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/src/shared/ui/button";
import EditSkillsDialog from "../../dialogs/ProfileDialogs/EditSkillsDialog";

interface SkillsCardProps {
  skills?: string[];
}

export default function SkillsCard({ skills }: SkillsCardProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <div>
      {/* Header */}
      <p className="mb-4 text-xs font-medium uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
        Skills
      </p>

      {/* Skills List */}
      <div className="mb-3 flex flex-wrap items-center max-h-60 overflow-scroll gap-2">
        {skills?.length ? (
          skills.map((skill, index) => (
            <span
              key={`${skill}-${index}`}
              className="rounded-md border border-neutral-200 bg-neutral-50 px-2 py-1 text-xs text-neutral-600 transition-colors dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
            >
              {skill}
            </span>
          ))
        ) : (
          <p className="text-sm text-neutral-400 dark:text-neutral-500">
            No skills added yet.
          </p>
        )}
        <div className="flex items-center justify-center rounded-md border border-neutral-200 dark:border-neutral-700">
          <Button
            className="h-5 w-5 cursor-pointer"
            variant={"secondary"}
            onClick={() => setIsOpen(!isOpen)}
          >
            <Plus
              size={14}
              className="text-neutral-700 dark:text-neutral-300"
            />
          </Button>
        </div>
      </div>
      <EditSkillsDialog
        open={isOpen}
        onOpenChange={() => setIsOpen(!isOpen)}
        skills={skills}
      />
    </div>
  );
}
