'use client';
import Header from '@/components/Header';
import ServicesSection from '@/components/service/Service';
import BusinessInnovationZone from '@/components/BusinessInnovationZone ';
import HumanCapitalDevelopment from '@/components/HumanCapitalDevelopment';
import SustainableDevelopmentSection from '@/components/SustainableDevelopmentSection ';
import Impact from '@/components/Impact';
import AboutUs from '@/components/AboutUs';
import VMO from '@/components/VMO';
import SDI from '@/components/SDI';

export default function Home() {
  return (
    <main>
      <Header/>
      <ServicesSection />
      <BusinessInnovationZone />
      <HumanCapitalDevelopment/>
      {/* <SustainableDevelopmentSection/>
      <Impact /> */}
      <SDI/>
      <AboutUs/>
      <VMO/>
    </main>
  );
}
