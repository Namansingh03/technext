"use client";

import { Suspense } from "react";
import AboutCard from "./AboutCard";
import EducationCard from "./EducationCard";
import ProfileHeader from "./ProfileHeader";
import ProfileSidebar from "./ProfileSidebar";
import { UserProfileType } from "@/src/features/User/types/userTypes";
import ProfileHeaderSkeleton from "@/src/features/User/Skeletons/ProfileSkeletons/ExperienceSkeleton";
import ExperienceCard from "@/src/features/User/components/Profile/ExperienceCard";
import AboutSkeleton from "../../Skeletons/ProfileSkeletons/AboutSkeleton";

export default function ProfilePage({ user }: { user: UserProfileType }) {
  return (
    <div className="relative min-h-full bg-neutral-300 dark:bg-neutral-950">
      <Suspense fallback={<ProfileHeaderSkeleton />}>
        <ProfileHeader
          AvatarImageUrl={user.image}
          bannerImageUrl={user.candidateProfile?.bannerImage}
          displayName={user.name}
          headline={user.headline}
          isAvailable={user.candidateProfile?.isOpenToWork}
          location={user.location}
          locationId={user.location?.id}
          username={user.username}
        />
      </Suspense>

      {/* Main Content */}
      <div className="relative z-10 -mt-10 flex w-full justify-center gap-x-10 px-10">
        <ProfileSidebar
          skills={user.candidateProfile?.skills}
          bio={user.bio}
          githubUrl={user.candidateProfile?.githubUrl}
          linkedinUrl={user.candidateProfile?.linkedinUrl}
          portfolioUrl={user.candidateProfile?.portfolioUrl}
          resumeUrl={user.candidateProfile?.resumeUrl}
        />

        <div className="flex w-full max-w-2xl items-start gap-10">
          <div className="flex flex-1 flex-col gap-5 rounded-2xl">
            <Suspense fallback={<AboutSkeleton />}>
              <AboutCard about={user.candidateProfile?.about} />
            </Suspense>

            <ExperienceCard experiences={user.candidateProfile?.experience} />

            <EducationCard education={user.candidateProfile?.education} />
          </div>
        </div>
      </div>
    </div>
  );
}
