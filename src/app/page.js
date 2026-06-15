"use client";
import Header from "@/components/Header";
import ServicesSection from "@/components/service/Service";
// import ServiceCTA from "@/components/ServiceCTA";
import BusinessInnovationZone from "@/components/BusinessInnovationZone ";
import HumanCapitalDevelopment from "@/components/HumanCapitalDevelopment";
import AboutUs from "@/components/AboutUs";
import ResponsiveServiceGrid from "@/components/service/ResponsiveServiceGrid";
// import VMO from "@/components/VMO";
import SDI from "@/components/SDI";
import "animate.css";

export default function Home() {
  return (
    <main className="bg-black">
      <Header />
      <div id="services">
        <ServicesSection />
      </div>
      {/* <ServiceCTA /> */}
      <BusinessInnovationZone />
      <HumanCapitalDevelopment />
      <SDI />
      <AboutUs />
      <ResponsiveServiceGrid />
      {/* <VMO /> */}
    </main>
  );
}
