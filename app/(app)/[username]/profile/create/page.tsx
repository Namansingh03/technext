import React from "react";
import AddProfilePage from "@/src/features/candidate/components/profile/create/CreateProfile";

export default function Page() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-muted p-6 md:p-10 bg-linear-to-br from-[#0f172a] via-[#1e1a78] to-[#0f172a]">
      <AddProfilePage />
    </div>
  );
}
