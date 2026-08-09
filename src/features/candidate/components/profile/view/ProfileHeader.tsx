"use client";

import Image from "next/image";
import { useState } from "react";
import { Edit } from "lucide-react";
import { Avatar } from "@/src/shared/ui/avatar";
import EditProfileHeaderDialog from "@/src/features/candidate/dialogs/ProfileDialogs/EditProfileHeaderDialog";
import ImageBackground from "@/src/shared/components/ImageBackground";

interface ProfileHeaderProps {
  displayName?: string | null;
  headline?: string | null;
  location?: string | null;
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
    <ImageBackground className="z-1">
      <header
        className="relative py-20 px-12 bg-cover bg-center bg-no-repeat"
        style={
          bannerImageUrl
            ? { backgroundImage: `url(${bannerImageUrl})` }
            : undefined
        }
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-10">
          <div className="flex items-center gap-8 bg-white w-full p-3 opacity-95 rounded-lg">
            {/* Avatar */}
            <div className="relative">
              <Avatar className="w-30 h-30">
                {AvatarImageUrl ? (
                  <Image
                    src={AvatarImageUrl}
                    alt={"avatarImage"}
                    className="rounded-full object-cover"
                    width={1800}
                    height={1800}
                  />
                ) : (
                  <div className="w-35 h-35 text-xl font-semibold rounded-full">
                    U
                  </div>
                )}
              </Avatar>
            </div>

            {/* Info */}
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-gray-900">{name}</h1>

              <p className="text-lg text-gray-600 font-medium">
                {headline && (
                  <>
                    <span className="text-neutral-800">{headline}</span>
                    <span>,</span>
                  </>
                )}

                {isAvailable && (
                  <span className="ml-2 text-sm text-green-700">
                    🟢 Available for work
                  </span>
                )}
              </p>

              <div className="flex items-center text-sm ">
                {location && <span className="text-gray-600">{location}</span>}
                <span className="mx-1">,</span>
                {username && <span className="text-gray-800">@{username}</span>}
              </div>
            </div>
          </div>
        </div>

        <Edit
          className="absolute top-10 right-10 text-blue-100 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        />
        <EditProfileHeaderDialog
          displayName={displayName ?? ""}
          headline={headline ?? ""}
          isAvailable={isAvailable ?? true}
          avatarImageUrl={AvatarImageUrl ?? ""}
          bannerImageUrl={bannerImageUrl ?? ""}
          location={location ?? ""}
          handleOpenChange={() => setIsOpen(!isOpen)}
          open={isOpen}
          username={username}
        />
      </header>
    </ImageBackground>
  );
}
