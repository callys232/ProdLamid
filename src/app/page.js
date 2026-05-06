"use client";
import Header from "@/components/Header";
import ServicesSection from "@/components/service/Service";
import BusinessInnovationZone from "@/components/BusinessInnovationZone ";
import HumanCapitalDevelopment from "@/components/HumanCapitalDevelopment";
import AboutUs from "@/components/AboutUs";
import VMO from "@/components/VMO";
import SDI from "@/components/SDI";
import "animate.css";

export default function Home() {
  return (
    <main className="bg-black space-y-12 md:space-y-20">
      <Header />
      <ServicesSection />
      <BusinessInnovationZone />
      <HumanCapitalDevelopment />
      <SDI />
      <AboutUs />
      <VMO />
    </main>
  );
}
