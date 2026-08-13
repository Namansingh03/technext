"use client";

import { Suspense } from "react";
import AboutCard from "./AboutCard";
import EducationCard from "./EducationCard";
import ProfileHeader from "./ProfileHeader";
import ProfileSidebar from "./ProfileSidebar";
import { UserProfileType } from "@/src/features/User/types/userTypes";
import ExperienceSkeleton from "@/src/features/User/Skeletons/ProfileSkeletons/ExperienceSkeleton";
import ProfileHeaderSkeleton from "@/src/features/User/Skeletons/ProfileSkeletons/ExperienceSkeleton";
import AboutSkeleton from "@/src/features/User/Skeletons/ProfileSkeletons/ExperienceSkeleton";
import ExperienceCard from "@/src/features/User/components/Profile/ExperienceCard";

export default function ProfilePage({ user }: { user: UserProfileType }) {
  return (
    <div className="relative h-screen w-full bg-neutral-300 dark:bg-neutral-950">
      <Suspense fallback={<ProfileHeaderSkeleton />}>
        <ProfileHeader
          AvatarImageUrl={user.image}
          bannerImageUrl={user.candidateProfile?.bannerImage}
          displayName={user.name}
          headline={user.headline}
          isAvailable={user.candidateProfile?.isOpenToWork}
          location={user.location?.label}
          locationId={user.location?.id}
          username={user.username}
        />
      </Suspense>

      {/* Main Content Wrapper */}
      <div className="absolute top-60 z-1 flex w-full justify-center gap-x-10 px-10">
        <ProfileSidebar
          skills={user.candidateProfile?.skills}
          bio={user.bio}
          githubUrl={user.candidateProfile?.githubUrl}
          linkedinUrl={user.candidateProfile?.linkedinUrl}
          portfolioUrl={user.candidateProfile?.portfolioUrl}
          resumeUrl={user.candidateProfile?.resumeUrl}
        />
        <div className="z-2 flex w-full max-w-2xl items-start gap-10">
          {/* Main Content */}
          <div className="flex flex-1 flex-col gap-5 rounded-2xl">
            <Suspense fallback={<AboutSkeleton />}>
              <AboutCard about={user.candidateProfile?.about} />
            </Suspense>
            <ExperienceCard experiences={user.candidateProfile?.experience} />
            <Suspense fallback={<ExperienceSkeleton />}></Suspense>
            <EducationCard education={user.candidateProfile?.education} />
            <Suspense fallback={<EducationCard />}></Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
