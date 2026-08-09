"use client";

import { useState } from "react";
import { CardWrapper } from "@/src/shared/components/CardWrapper";
import TextEditDialog from "@/src/features/candidate/dialogs/ProfileDialogs/TextEditDialogs";

interface AboutCardProps {
  about?: string | null;
}

export default function AboutCard({ about }: AboutCardProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <CardWrapper>
      <div className="flex justify-between items-center mb-3 min-w-xl">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">
          About
        </p>

        <button
          onClick={() => setDialogOpen(true)}
          className="text-xs text-blue-500 hover:text-blue-600"
        >
          Edit
        </button>
      </div>

      <p className="text-sm text-gray-600">
        {about || (
          <span className="text-gray-400 italic">Add an about section...</span>
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
