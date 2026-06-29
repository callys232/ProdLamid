"use client";
import Header from "@/components/Header";
import ProofStrip from "@/components/aivora/ProofStrip";
import AivoraGap from "@/components/aivora/AivoraGap";
import EcosystemOverview from "@/components/aivora/EcosystemOverview";
import HowItWorks from "@/components/aivora/HowItWorks";
import WhyAivora from "@/components/aivora/WhyAivora";
import AivoraTestimonials from "@/components/aivora/AivoraTestimonials";
import "animate.css";

export default function Home() {
  return (
    <main className="aivora-section">
      <Header />
      <ProofStrip />
      <AivoraGap />
      <EcosystemOverview />
      <HowItWorks />
      <WhyAivora />
      <AivoraTestimonials />
    </main>
  );
}
