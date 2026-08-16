import { Prisma } from "@/prisma/generated/client";

type UserProfileType = Prisma.UserGetPayload<{
  select: {
    displayUsername: true;
    bio: true;
    email: true;
    image: true;
    name: true;
    headline: true;
    username: true;
    location: {
      select: {
        id: true;
        city: true;
        country: true;
        countryCode: true;
        label: true;
        lat: true;
        lng: true;
        state: true;
      };
    };
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

export type { UserProfileType };
