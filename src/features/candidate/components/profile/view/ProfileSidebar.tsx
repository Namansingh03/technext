"use client";

import SkillsCard from "./SkillsCard";
import ContactCard from "./ContactCard";
import { Suspense, useState } from "react";
import { Separator } from "@/src/shared/ui/separator";
import { CardWrapper } from "@/src/shared/components/CardWrapper";
import TextEditDialog from "@/src/features/candidate/dialogs/ProfileDialogs/TextEditDialogs";
import SkillsSkeleton from "@/src/features/candidate/skeletons/ProfileSkeletons/SkillsSkeleton";

interface ProfileSidebarProps {
  bio?: string | null;
  skills?: string[];
  resumeUrl?: string | null;
  portfolioUrl?: string | null;
  linkedinUrl?: string | null;
  githubUrl?: string | null;
}

export default function ProfileSidebar({
  bio,
  githubUrl,
  linkedinUrl,
  portfolioUrl,
  resumeUrl,
  skills,
}: ProfileSidebarProps) {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <Suspense fallback={<SkillsSkeleton />}>
      <CardWrapper className="h-fit sticky flex flex-col gap-y-5 max-w-md min-w-3xs">
        <div>
          <h1 className="text-neutral-400 mb-5 flex justify-between">
            Personal information
            <span
              className="text-blue-500 text-xs cursor-pointer"
              onClick={() => setDialogOpen(true)}
            >
              Edit
            </span>
          </h1>

          <p className="text-sm">
            {bio || <span className="text-gray-400 italic">Add a bio...</span>}
          </p>
        </div>

        <Separator />

        <ContactCard
          githubUrl={githubUrl}
          linkedinUrl={linkedinUrl}
          portfolioUrl={portfolioUrl}
          resumeUrl={resumeUrl}
        />

        <Separator />

        <SkillsCard skills={skills} />
      </CardWrapper>

      <TextEditDialog
        label="bio"
        initialText={bio ?? ""}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        maxLength={200}
      />
    </Suspense>
  );
}
