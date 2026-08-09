"use client";

import { Suspense } from "react";
import AboutCard from "./AboutCard";
import EducationCard from "./EducationCard";
import ProfileHeader from "./ProfileHeader";
import ProfileSidebar from "./ProfileSidebar";
import { UserProfileType } from "@/src/features/candidate/types/ProfileTypes";
import ExperienceSkeleton from "@/src/features/candidate/skeletons/ProfileSkeletons/ExperienceSkeleton";
import ProfileHeaderSkeleton from "@/src/features/candidate/skeletons/ProfileSkeletons/ProfileHeaderSkeleton";
import AboutSkeleton from "@/src/features/candidate/skeletons/ProfileSkeletons/AboutSkeleton";
import ExperienceCard from "@/src/features/candidate/components/profile/view/ExperienceCard";

export default function ProfilePage({ user }: { user: UserProfileType }) {
  return (
    <div className="w-full bg-blue-500 relative">
      <Suspense fallback={<ProfileHeaderSkeleton />}>
        <ProfileHeader
          AvatarImageUrl={user.image}
          bannerImageUrl={user.candidateProfile?.bannerImage}
          displayName={user.name}
          headline={user.headline}
          isAvailable={user.candidateProfile?.isOpenToWork}
          location={user.location}
          username={user.username}
        />
      </Suspense>

      {/* Main Content Wrapper */}
      <div className="w-full flex justify-center absolute top-60 px-10 gap-x-10 bg-neutral-10 z-1">
        <ProfileSidebar
          skills={user.candidateProfile?.skills}
          bio={user.bio}
          githubUrl={user.candidateProfile?.githubUrl}
          linkedinUrl={user.candidateProfile?.linkedinUrl}
          portfolioUrl={user.candidateProfile?.portfolioUrl}
          resumeUrl={user.candidateProfile?.resumeUrl}
        />
        <div className="w-full max-w-2xl flex gap-10 items-start z-2">
          {/* Main Content */}
          <div className="flex-1 flex flex-col gap-5 rounded-2xl">
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
