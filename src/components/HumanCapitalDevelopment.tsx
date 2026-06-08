"use client";
import Link from "next/link";
import HeaderSection from "./Humancapital/header";
import HcdTrainer from "./hcd/hcdTrainer";
import EventsSection from "./Humancapital/hcdEvents";

export default function HumanCapitalDevelopment() {
  return (
    <div className="bg-black text-white w-full">
      {/* Clicking the header card navigates to the full HCD page */}
      <Link href="/hcd" className="block hover:opacity-90 transition-opacity duration-200 cursor-pointer">
        <HeaderSection />
      </Link>

      {/* Training & Recruitment — homepage mode hides talent club + learn more */}
      <HcdTrainer homepage />

      {/* Events */}
      <EventsSection />
    </div>
  );
}
