import React from "react";
import CTASection from "@/src/features/home/components/CtaSection";
import FeaturesSection from "@/src/features/home/components/Features";
import Footer from "@/src/features/home/components/Footer";
import HeroSection from "@/src/features/home/components/HeroSection";
import HomeNavbar from "@/src/features/home/components/HomeNavbar";

export default async function Page() {
  return (
    <>
      <HomeNavbar />
      <HeroSection />
      <FeaturesSection />
      <CTASection />
      <Footer />
    </>
  );
}
