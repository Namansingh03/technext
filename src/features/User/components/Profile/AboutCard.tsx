"use client";

import { useState } from "react";
import { CardWrapper } from "@/src/shared/components/CardWrapper";
import TextEditDialog from "../../dialogs/ProfileDialogs/TextEditDialogs";

interface AboutCardProps {
  about?: string | null;
}

export default function AboutCard({ about }: AboutCardProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <CardWrapper>
      <div className="flex  dark:text-neutral-300 min-w-xl items-center justify-between mb-3">
        <p className="text-xs font-medium uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
          About
        </p>

        <button
          onClick={() => setDialogOpen(true)}
          className="text-xs font-medium text-blue-500 transition-colors hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
        >
          Edit
        </button>
      </div>

      <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
        {about || (
          <span className="italic text-neutral-400 dark:text-neutral-500">
            Add an about section...
          </span>
        )}
      </p>

      <TextEditDialog
        label="about"
        initialText={about ?? ""}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        maxLength={500}
      />
    </CardWrapper>
  );
}
