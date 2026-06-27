"use client";
import Header from "@/components/Header";
import ProofStrip from "@/components/aivora/ProofStrip";
import AivoraGap from "@/components/aivora/AivoraGap";
import EcosystemOverview from "@/components/aivora/EcosystemOverview";
import HowItWorks from "@/components/aivora/HowItWorks";
import WhyAivora from "@/components/aivora/WhyAivora";
import AivoraTestimonials from "@/components/aivora/AivoraTestimonials";
import ManifestoExcerpt from "@/components/aivora/ManifestoExcerpt";
import CtaBanner from "@/components/aivora/CtaBanner";
import "animate.css";

export default function Home() {
  return (
    <main className="aivora-section">
      {/* Hero */}
      <Header />

      {/* Trust signals */}
      <ProofStrip />

      {/* Why AIVORA exists — the problem */}
      <AivoraGap />

      {/* One platform, three portals — the solution */}
      <EcosystemOverview />

      {/* How it works — 5 steps */}
      <HowItWorks />

      {/* Differentiators */}
      <WhyAivora />

      {/* Testimonials */}
      <AivoraTestimonials />

      {/* Manifesto excerpt */}
      <ManifestoExcerpt />

      {/* Closing CTA */}
      <CtaBanner />
    </main>
  );
}
