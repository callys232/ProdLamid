"use client";
import Header from "@/components/Header";
import ServicesSection from "@/components/service/Service";
import ServiceCTA from "@/components/ServiceCTA";
import BusinessInnovationZone from "@/components/BusinessInnovationZone ";
import HumanCapitalDevelopment from "@/components/HumanCapitalDevelopment";
import AboutUs from "@/components/AboutUs";
// import VMO from "@/components/VMO";
import SDI from "@/components/SDI";
import "animate.css";

export default function Home() {
  return (
    <main className="bg-black space-y-6 md:space-y-10">
      <Header />
      <div id="services">
        <ServicesSection />
      </div>
      <ServiceCTA />
      <BusinessInnovationZone />
      <HumanCapitalDevelopment />
      <SDI />
      <AboutUs />
      {/* <VMO /> */}
    </main>
  );
}
