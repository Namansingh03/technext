import React from "react";
import CTASection from "@/src/features/home/components/CtaSection";
import FeaturesSection from "@/src/features/home/components/Features";
import Footer from "@/src/features/home/components/Footer";
import HeroSection from "@/src/features/home/components/HeroSection";
import HomeNavbar from "@/src/features/home/components/HomeNavbar";
import { auth } from "@/src/configs/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session?.user) {
    redirect("/redirect");
  }

  return (
    <main className="flex min-w-full h-full overflow-y-auto flex-col items-center">
      <HomeNavbar />
      <HeroSection />
      <FeaturesSection />
      <CTASection />
      <Footer />
    </main>
  );
}
