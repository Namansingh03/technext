"use client";

import TellUsAboutYourself from "@/src/features/auth/components/TellUsMoreForm";
import { authClient } from "@/src/configs/auth-client";

export default function Page() {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10 bg-linear-to-br from-[#0f172a] via-[#1e1a78] to-[#0f172a]">
        <div className="w-full max-w-sm md:max-w-4xl flex justify-center ">
          loading...
        </div>
      </div>
    );
  }

  if (!session || !session.user.username) {
    throw new Error("session not found");
  }

  return (
    <div className="flex min-h-svh min-w-full flex-col items-center justify-center bg-muted p-6 md:p-10 bg-linear-to-br from-[#0f172a] via-[#1e1a78] to-[#0f172a]">
      <div className="w-full max-w-sm md:max-w-4xl flex justify-center ">
        <TellUsAboutYourself username={session.user.username} />
      </div>
    </div>
  );
}
