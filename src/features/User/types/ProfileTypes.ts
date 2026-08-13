import { Prisma } from "@/prisma/generated/client";

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

type LocationType = Prisma.LocationGetPayload<{
  select: {
    city: true;
    country: true;
    countryCode: true;
    label: true;
    id: true;
    lat: true;
    lng: true;
    state: true;
  };
}>;

export type { ProfileHeader, LocationType };
