"use client";
import Header from "@/components/Header";
import ProofStrip from "@/components/lamidOne/ProofStrip";
import LamidOneGap from "@/components/lamidOne/LamidOneGap";
import ThreePromises from "@/components/lamidOne/ThreePromises";
import ProductShowcase from "@/components/lamidOne/ProductShowcase";
import EcosystemHubs from "@/components/lamidOne/EcosystemHubs";
import HowItWorks from "@/components/lamidOne/HowItWorks";
import WhyLamidOne from "@/components/lamidOne/WhyLamidOne";
import LamidOneTestimonials from "@/components/lamidOne/LamidOneTestimonials";
import ClosingCta from "@/components/lamidOne/ClosingCta";
import { useScrollBackground } from "@/hooks/useScrollBackground";
import "animate.css";

// Gradient pairs: fromXxx = vivid accent (gradient start), toXxx = base tone (gradient end)
// Both stops animate via @property so scrolling morphs the full gradient
// One family, deep blue. Depth comes from value shifts, not hue swings —
// the ladder peaks at Four Engines (the brand moment) and resolves back to
// the hero tone at the closing CTA.
const SECTION_COLORS = [
  {
    fromLight: "#C7DBF5",  toLight: "#F7FAFE",  // Hero              — soft blue → near-white
    fromDark:  "#1E3A8A",  toDark:  "#030A16",  // deep sapphire → near-black navy
  },
  {
    fromLight: "#D3E2F7",  toLight: "#F9FBFE",  // Proof strip       — lighter, recedes
    fromDark:  "#1A3578",  toDark:  "#04101F",  // muted sapphire → navy
  },
  {
    fromLight: "#BFD4F0",  toLight: "#F5F8FD",  // Signal Gap        — deepens for tension
    fromDark:  "#1E40AF",  toDark:  "#020813",  // royal blue → void
  },
  {
    fromLight: "#C9DAF4",  toLight: "#F8FAFE",  // Three Promises    — brand peak
    fromDark:  "#1D4ED8",  toDark:  "#040C1C",  // brand blue → midnight
  },
  {
    fromLight: "#C4D7F2",  toLight: "#F6F9FD",  // Ecosystem Hubs    — re-deepens
    fromDark:  "#1E3A8A",  toDark:  "#050E1E",  // sapphire → dark navy
  },
  {
    fromLight: "#D0DFF6",  toLight: "#F9FBFE",  // How It Works      — lifts for clarity
    fromDark:  "#14306B",  toDark:  "#04101F",  // slate navy → deep
  },
  {
    fromLight: "#C7DAF4",  toLight: "#F7FAFE",  // Why LAMID ONE     — mid weight
    fromDark:  "#1B3F96",  toDark:  "#030A18",  // sapphire → near-black
  },
  {
    fromLight: "#D3E3F8",  toLight: "#F9FBFE",  // Testimonials      — light, airy
    fromDark:  "#17357F",  toDark:  "#040D1B",  // navy → deep
  },
  {
    fromLight: "#D6E4F8",  toLight: "#FAFCFE",  // Product Showcase  — calm, lets UI lead
    fromDark:  "#16357D",  toDark:  "#030914",  // deep navy → near-black
  },
  {
    fromLight: "#C7DBF5",  toLight: "#F7FAFE",  // Closing CTA       — mirrors hero
    fromDark:  "#1E3A8A",  toDark:  "#030A16",  // deep sapphire → near-black navy
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
    <main className="lamidone-section">
      <Sec idx={0}><Header /></Sec>
      <Sec idx={1}><ProofStrip /></Sec>
      <Sec idx={2}><LamidOneGap /></Sec>
      <Sec idx={3}><ThreePromises /></Sec>
      <Sec idx={4}><EcosystemHubs /></Sec>
      <Sec idx={5}><HowItWorks /></Sec>
      <Sec idx={6}><WhyLamidOne /></Sec>
      <Sec idx={7}><LamidOneTestimonials /></Sec>
      <Sec idx={8}><ProductShowcase /></Sec>
      <Sec idx={9}><ClosingCta /></Sec>
    </main>
  );
}
