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
import ResumeCard from "./ResumeCard";

interface ProfilePageProps {
  user: UserProfileType;
  username: string;
}

export default function ProfilePage({ username, user }: ProfilePageProps) {
  const isOwner = user.username === username;

  return (
    <div className=" bg-neutral-300 dark:bg-neutral-950">
      <Suspense fallback={<ProfileHeaderSkeleton />}>
        <ProfileHeader
          isOwner={isOwner}
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
          isOwner={isOwner}
          skills={user.candidateProfile?.skills}
          bio={user.bio}
          githubUrl={user.candidateProfile?.githubUrl}
          linkedinUrl={user.candidateProfile?.linkedinUrl}
          portfolioUrl={user.candidateProfile?.portfolioUrl}
        />

        <div className="flex w-full max-w-2xl items-start gap-10">
          <div className="flex flex-1 flex-col gap-5 rounded-2xl">
            <Suspense fallback={<AboutSkeleton />}>
              <AboutCard
                isOwner={isOwner}
                about={user.candidateProfile?.about}
              />
            </Suspense>

            <ResumeCard isOwner={isOwner} resumes={user.resumes ?? []} />

            <ExperienceCard
              isOwner={isOwner}
              experiences={user.candidateProfile?.experience}
            />

            <EducationCard
              isOwner={isOwner}
              education={user.candidateProfile?.education}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
