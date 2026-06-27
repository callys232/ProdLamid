import Header from "@/components/portfolio/Header";
import AboutUs from "@/components/AboutUs";
import Values from "@/components/portfolio/Values";
import Section from "@/components/portfolio/Section";
import PledgeStrategySection from "@/components/portfolio/PledgeStrategySection ";
import ContactSection from "@/components/portfolio/ContactSection";
import Slider from "@/components/slider";
import StatsBar from "@/components/portfolio/StatsBar";
import TestimonialSection from "@/components/portfolio/TestimonialSection";

const PortfolioPage = () => {
  return (
    <div>
      <Header />
      <AboutUs showArrow={false} />
      <Values />
      <Slider />
      <StatsBar />
      <TestimonialSection />
      <Section />

      <PledgeStrategySection />
      <ContactSection />
    </div>
  );
};

export default PortfolioPage;
