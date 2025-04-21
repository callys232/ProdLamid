import React from "react";
import Image from "next/image";
import EventHeader from "@/components/event/EventHeader";
import EventSummary from "@/components/event/EventSummary";
import HCDEvent from "@/components/event/HCDEvent";
import BusinessPrototypes from "@/components/event/BusinessPrototypes ";
import LastEvent from "@/components/event/LastEvent";

const Eventpage = () => {
  return (
    <div>
        <EventHeader/>
        <EventSummary/>
        <div className="w-full h-px bg-gray-700"></div>
        <HCDEvent/>
        <div className="w-full h-px bg-gray-700"></div>
        <BusinessPrototypes />
        <div className="w-full h-px bg-gray-700"></div>
        <LastEvent/>
    </div>
  );
};

export default Eventpage;
