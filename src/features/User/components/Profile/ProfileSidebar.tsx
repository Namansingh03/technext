"use client";

import SkillsCard from "./SkillsCard";
import ContactCard from "./ContactCard";
import { Suspense, useState } from "react";
import { Separator } from "@/src/shared/ui/separator";
import { CardWrapper } from "@/src/shared/components/CardWrapper";
import TextEditDialog from "../../dialogs/ProfileDialogs/TextEditDialogs";
import SkillsSkeleton from "@/src/features/User/Skeletons/ProfileSkeletons/SkillsSkeleton";

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
      <CardWrapper className="sticky flex h-fit min-w-3xs max-w-md flex-col gap-y-5">
        <div>
          <h1 className="mb-5 flex justify-between text-xs font-medium uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
            Personal information
            <span
              className="cursor-pointer text-xs font-medium text-blue-500 transition-colors hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
              onClick={() => setDialogOpen(true)}
            >
              Edit
            </span>
          </h1>

          <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
            {bio || (
              <span className="italic text-neutral-400 dark:text-neutral-500">
                Add a bio...
              </span>
            )}
          </p>
        </div>

        <Separator className="dark:bg-neutral-800" />

        <ContactCard
          githubUrl={githubUrl}
          linkedinUrl={linkedinUrl}
          portfolioUrl={portfolioUrl}
          resumeUrl={resumeUrl}
        />

        <Separator className="dark:bg-neutral-800" />

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
