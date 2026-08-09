"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/src/shared/ui/button";
import EditSkillsDialog from "@/src/features/candidate/dialogs/ProfileDialogs/EditSkillsDialog";

interface SkillsCardProps {
  skills?: string[];
}

export default function SkillsCard({ skills }: SkillsCardProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <div className="bg-neutral-50">
      {/* Header */}
      <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-4">
        Skills
      </p>

      {/* Skills List */}
      <div className="flex flex-wrap gap-2 mb-3">
        {skills?.length ? (
          skills.map((skill, index) => (
            <span
              key={`${skill}-${index}`}
              className="text-xs px-2 py-1 rounded-md bg-gray-50 border border-gray-100 text-gray-600"
            >
              {skill}
            </span>
          ))
        ) : (
          <p className="text-sm text-gray-400">No skills added yet.</p>
        )}
        <div className="flex items-center justify-center border border-gray-200 rounded-md ">
          <Button
            className="w-5 h-5 cursor-pointer"
            variant={"secondary"}
            onClick={() => setIsOpen(!isOpen)}
          >
            <Plus size={14} className="text-neutral-700" />
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
