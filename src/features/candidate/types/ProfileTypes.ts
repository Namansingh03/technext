import { Prisma } from "@/prisma/generated/client";

type Role = "USER" | "ADMIN" | "RECRUITER";
type UserProfileType = Prisma.UserGetPayload<{
  select: {
    displayUsername: true;
    bio: true;
    email: true;
    image: true;
    name: true;
    headline: true;
    username: true;
    location: true;
    candidateProfile: {
      select: {
        isOpenToWork: true;
        bannerImage: true;
        skills: true;
        about: true;
        portfolioUrl: true;
        resumeUrl: true;
        linkedinUrl: true;
        githubUrl: true;
        experience: {
          orderBy: {
            startDate: "desc";
          };
          take: 5;
        };
        education: {
          orderBy: {
            startDate: "desc";
          };
          take: 5;
        };
      };
    };
  };
}>;

type ProfileHeader = Prisma.UserGetPayload<{
  select: {
    bio: true;
    image: true;
    location: true;
    displayUsername: true;
    headline: true;
    candidateProfile: {
      select: {
        bannerImage: true;
        isOpenToWork: true;
      };
    };
  };
}>;

export type { UserProfileType, ProfileHeader, Role };
