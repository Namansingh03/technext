"use client";

import React, { useState } from "react";
import { SKILLS } from "@/src/shared/constants/values";

interface SelectedSkillsProps {
  skills?: string[];
  onChange?: (skills: string[]) => void;
}

export default function SelectedSkills({
  skills = [],
  onChange,
}: SelectedSkillsProps) {
  const [value, setValue] = useState<string[]>(skills);

  const toggleSkill = (skill: string) => {
    const updated = value.includes(skill)
      ? value.filter((s) => s !== skill)
      : [...value, skill];

    setValue(updated);
    onChange?.(updated);
  };

  return (
    <div className="flex flex-wrap gap-2 max-h-50 overflow-y-auto pr-1">
      {SKILLS.map((skill) => {
        const isSelected = value.includes(skill);

        return (
          <button
            key={skill}
            type="button"
            onClick={() => toggleSkill(skill)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-150 ${
              isSelected
                ? "bg-zinc-900 text-white border-zinc-900 shadow-sm"
                : "bg-zinc-50 text-zinc-600 border-zinc-200 hover:border-zinc-400 hover:bg-white"
            }`}
          >
            {isSelected && <span className="mr-1">✓</span>}
            {skill}
          </button>
        );
      })}
    </div>
  );
}
