"use client";
import Header from "@/components/Header";
import ThreePromises from "@/components/aivora/ThreePromises";
import ProofStrip from "@/components/aivora/ProofStrip";
import LamidOneGap from "@/components/aivora/LamidOneGap";
import EcosystemOverview from "@/components/aivora/EcosystemOverview";
import HowItWorks from "@/components/aivora/HowItWorks";
import WhyAivora from "@/components/aivora/WhyAivora";
import AivoraTestimonials from "@/components/aivora/AivoraTestimonials";
import ClosingCta from "@/components/aivora/ClosingCta";
import { useScrollBackground } from "@/hooks/useScrollBackground";
import "animate.css";

// Gradient pairs: fromXxx = vivid accent (gradient start), toXxx = base tone (gradient end)
// Both stops animate via @property so scrolling morphs the full gradient
const SECTION_COLORS = [
  {
    fromLight: "#BFE3FF",  toLight: "#F8FAFF",  // Hero            — sky blue → white
    fromDark:  "#0D6E8A",  toDark:  "#04111F",  // vivid teal → deep navy
  },
  {
    fromLight: "#B8CCFF",  toLight: "#F5F3FF",  // Three Promises  — cornflower → lavender-white
    fromDark:  "#1456A0",  toDark:  "#040A1E",  // sapphire blue → midnight
  },
  {
    fromLight: "#FDDCB0",  toLight: "#FEF9F0",  // Proof strip     — warm amber → cream
    fromDark:  "#0A8090",  toDark:  "#030C14",  // bright cyan-teal → near-black
  },
  {
    fromLight: "#B0C4FF",  toLight: "#E8EEFF",  // Signal Gap      — periwinkle → pale blue
    fromDark:  "#1A2880",  toDark:  "#020508",  // deep indigo → void
  },
  {
    fromLight: "#FFD8AA",  toLight: "#EEF2FF",  // Ecosystem       — peach-gold → cool blue
    fromDark:  "#1A3060",  toDark:  "#060A1A",  // deep sapphire → dark
  },
  {
    fromLight: "#A8D8FF",  toLight: "#F0F9FF",  // How It Works    — sky → near-white
    fromDark:  "#076070",  toDark:  "#04101A",  // ocean teal → deep
  },
  {
    fromLight: "#E8D8C0",  toLight: "#FFFFF0",  // Why LAMID ONE   — warm sand → ivory
    fromDark:  "#3D1070",  toDark:  "#0A041E",  // deep violet → near-black
  },
  {
    fromLight: "#B0DCFF",  toLight: "#F0F9FF",  // Testimonials    — sky blue → white
    fromDark:  "#0A6078",  toDark:  "#030E18",  // teal → deep navy
  },
  {
    fromLight: "#BFE3FF",  toLight: "#F8FAFF",  // Closing CTA     — mirrors hero
    fromDark:  "#0D6E8A",  toDark:  "#04111F",  // vivid teal → deep navy
  },
];

function Sec({ idx, children }) {
  const c = SECTION_COLORS[idx];
  return (
    <div
      data-scroll-section
      data-bg-from-light={c.fromLight}
      data-bg-to-light={c.toLight}
      data-bg-from-dark={c.fromDark}
      data-bg-to-dark={c.toDark}
    >
      {children}
    </div>
  );
}

export default function Home() {
  useScrollBackground();

  return (
    <main className="aivora-section">
      <Sec idx={0}><Header /></Sec>
      <Sec idx={1}><ThreePromises /></Sec>
      <Sec idx={2}><ProofStrip /></Sec>
      <Sec idx={3}><LamidOneGap /></Sec>
      <Sec idx={4}><EcosystemOverview /></Sec>
      <Sec idx={5}><HowItWorks /></Sec>
      <Sec idx={6}><WhyAivora /></Sec>
      <Sec idx={7}><AivoraTestimonials /></Sec>
      <Sec idx={8}><ClosingCta /></Sec>
    </main>
  );
}
