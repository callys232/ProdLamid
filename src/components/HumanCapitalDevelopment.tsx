"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import HeaderSection from "./Humancapital/header";
import HcdTrainer from "./hcd/hcdTrainer";
import HcdEvent from "./hcd/hcdEvent";
import EcosystemTag from "@/components/EcosystemTag";
import PortalServicesSlide from "./portal/PortalServicesSlide";

export default function HumanCapitalDevelopment() {
  const [eventsOpen, setEventsOpen] = useState(false);

  return (
    <div className="bg-black text-white w-full">
      <div className="max-w-6xl mx-auto px-2 sm:px-4 md:px-8 pt-0">
        <EcosystemTag className="!mt-0" />
      </div>

      {/* Clicking the header card navigates to the full HCD page */}
      <Link
        href="/hcd"
        className="block hover:opacity-90 transition-opacity duration-200 cursor-pointer"
      >
        <HeaderSection />
      </Link>

      {/* Training & Recruitment — homepage mode hides talent club + learn more */}
      <HcdTrainer homepage />

      {/* Upcoming Events trigger */}
      <div className="flex justify-center py-10">
        <motion.button
          type="button"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setEventsOpen(true)}
          className="group relative px-7 py-3 rounded-full text-sm font-semibold border border-orange-500/60 text-orange-400 hover:bg-orange-500/10 hover:border-orange-400 transition overflow-hidden"
        >
          <span className="relative z-10 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
            Upcoming Events
          </span>
        </motion.button>
      </div>

      <HcdEvent isOpen={eventsOpen} onClose={() => setEventsOpen(false)} />

      {/* Portal Services Slide */}
      <PortalServicesSlide />
    </div>
  );
}
