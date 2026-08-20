import { Prisma } from "@/prisma/generated/client";

type ProfileResume = Prisma.ResumeGetPayload<{
  select: {
    createdAt: true;
    fileName: true;
    default: true;
    fileUrl: true;
    id: true;
    label: true;
    updatedAt: true;
    userId: true;
  };
}>;

export type { ProfileResume };
