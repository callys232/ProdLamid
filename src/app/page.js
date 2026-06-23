"use client";
import Header from "@/components/Header";
import ProofStrip from "@/components/aivora/ProofStrip";
import EcosystemOverview from "@/components/aivora/EcosystemOverview";
import AivoraGap from "@/components/aivora/AivoraGap";
import HowItWorks from "@/components/aivora/HowItWorks";
import ServicesSection from "@/components/service/Service";
import BusinessInnovationZone from "@/components/BusinessInnovationZone ";
import HumanCapitalDevelopment from "@/components/HumanCapitalDevelopment";
import SDI from "@/components/SDI";
import WhyAivora from "@/components/aivora/WhyAivora";
import AivoraTestimonials from "@/components/aivora/AivoraTestimonials";
import AboutUs from "@/components/AboutUs";
import ManifestoExcerpt from "@/components/aivora/ManifestoExcerpt";
import CtaBanner from "@/components/aivora/CtaBanner";
import ResponsiveServiceGrid from "@/components/service/ResponsiveServiceGrid";
import "animate.css";

export default function Home() {
  return (
    <main className="bg-black">
      {/* Hero */}
      <Header />

      {/* Trust signals */}
      <ProofStrip />

      {/* Three portals overview */}
      <EcosystemOverview />

      {/* Why AIVORA exists — the problem */}
      <AivoraGap />

      {/* How it works — 5 steps */}
      <HowItWorks />

      {/* Services section */}
      {/* <div id="services">
        <ServicesSection />
      </div> */}

      {/* Brand portal deep dives */}
      <BusinessInnovationZone />
      <HumanCapitalDevelopment />
      <SDI />

      {/* Differentiators */}
      <WhyAivora />

      {/* Testimonials */}
      <AivoraTestimonials />

      {/* About */}
      <AboutUs />

      {/* Manifesto excerpt */}
      <ManifestoExcerpt />

      {/* Closing CTA */}
      <CtaBanner />

      <ResponsiveServiceGrid />
    </main>
  );
}
