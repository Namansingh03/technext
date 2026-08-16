"use client";

import Image from "next/image";
import { useState } from "react";
import { Edit } from "lucide-react";
import { Avatar } from "@/src/shared/ui/avatar";
import ProfileHeaderBackground from "@/src/shared/components/ImageBackground";
import EditProfileHeaderDialog from "../../dialogs/ProfileDialogs/EditProfileHeaderDialog";
import { LocationType } from "../../types/ProfileTypes";

interface ProfileHeaderProps {
  displayName?: string | null;
  headline?: string | null;
  location?: LocationType | null;
  locationId?: string | null;
  username?: string | null;
  AvatarImageUrl?: string | null;
  bannerImageUrl?: string | null;
  isAvailable?: boolean;
}

export default function ProfileHeader({
  AvatarImageUrl,
  displayName,
  headline,
  isAvailable = true,
  location,
  username,
  bannerImageUrl,
}: ProfileHeaderProps) {
  const name = displayName ?? "Unnamed User";
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <ProfileHeaderBackground className="z-1">
      <header
        className="relative bg-cover bg-center bg-no-repeat px-6 py-16 sm:px-12 sm:py-20"
        style={
          bannerImageUrl
            ? { backgroundImage: `url(${bannerImageUrl})` }
            : undefined
        }
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-10">
          <div className="flex w-full items-center gap-8 rounded-lg bg-white/95 p-3 shadow-sm backdrop-blur-sm dark:bg-neutral-900/95">
            {/* Avatar */}
            <div className="relative shrink-0">
              <Avatar className="h-30 w-30 ring-2 ring-white dark:ring-neutral-800">
                {AvatarImageUrl ? (
                  <Image
                    src={AvatarImageUrl}
                    alt={"avatarImage"}
                    className="rounded-full object-cover"
                    width={1800}
                    height={1800}
                  />
                ) : (
                  <div className="flex h-30 w-30 items-center justify-center rounded-full bg-neutral-100 text-xl font-semibold text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
                    {displayName ? displayName[0] : "U"}
                  </div>
                )}
              </Avatar>
            </div>

            {/* Info */}
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-neutral-900 dark:text-neutral-50">
                {name}
              </h1>

              <p className="text-lg font-medium text-neutral-600 dark:text-neutral-300">
                {headline && (
                  <>
                    <span className="text-neutral-800 dark:text-neutral-200">
                      {headline}
                    </span>
                    <span>,</span>
                  </>
                )}

                {isAvailable && (
                  <span className="ml-2 text-sm text-green-700 dark:text-green-400">
                    🟢 Available for work
                  </span>
                )}
              </p>

              <div className="flex items-center text-sm">
                {location && (
                  <span className="text-neutral-600 dark:text-neutral-400">
                    {location.city}
                  </span>
                )}
                <span className="mx-1 text-neutral-400 dark:text-neutral-600">
                  ,
                </span>
                {username && (
                  <span className="text-neutral-800 dark:text-neutral-200">
                    @{username}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="absolute top-8 right-8 rounded-full bg-white/90 p-2 text-neutral-700 shadow-sm transition-colors hover:bg-white hover:text-blue-500 dark:bg-neutral-900/90 dark:text-neutral-300 dark:hover:bg-neutral-900 dark:hover:text-blue-400"
        >
          <Edit size={18} className="cursor-pointer" />
        </button>

        <EditProfileHeaderDialog
          displayName={displayName ?? ""}
          headline={headline ?? ""}
          isAvailable={isAvailable ?? true}
          avatarImageUrl={AvatarImageUrl ?? ""}
          bannerImageUrl={bannerImageUrl ?? ""}
          locationVal={location}
          handleOpenChange={() => setIsOpen(!isOpen)}
          open={isOpen}
          username={username}
        />
      </header>
    </ProfileHeaderBackground>
  );
}
