"use client";

import { useState } from "react";
import HcdHeader from "@/components/hcd/hcdHeader";
import HcdTrainer from "@/components/hcd/hcdTrainer";
import HcdEvent from "@/components/hcd/hcdEvent";
import BusinessPrototypes from "@/components/bizprototype/bizPrototypes";
import Testimonial from "@/components/Testimonial";
import BusinessTraining from "@/components/hcd/businessTraining";
import PortalServicesSlide from "@/components/portal/PortalServicesSlide";

const HCDPage = () => {
  const [eventsOpen, setEventsOpen] = useState(false);

  return (
    <div>
      <HcdHeader />
      <HcdTrainer />

      {/* Upcoming Events — now a popup triggered by this button */}
      <div className="flex justify-center py-10 bg-black">
        <button
          type="button"
          onClick={() => setEventsOpen(true)}
          className="px-7 py-3 rounded-full text-sm font-semibold bg-orange-500 text-black hover:bg-orange-400 transition shadow-[0_0_20px_-4px_rgba(249,115,22,0.6)]"
        >
          View Upcoming HCD Events
        </button>
      </div>

      <HcdEvent isOpen={eventsOpen} onClose={() => setEventsOpen(false)} />

      <BusinessPrototypes text="Biz Prototypes" />
      <BusinessTraining />
      <Testimonial />

      {/* Portal services — sits after HCD content */}
      <PortalServicesSlide />
    </div>
  );
};

export default HCDPage;
