import Header from "@/components/portfolio/Header";
import AboutUs from "@/components/AboutUs";
import Values from "@/components/portfolio/Values";
import Section from "@/components/portfolio/Section";
import PledgeStrategySection from "@/components/portfolio/PledgeStrategySection ";
import ContactSection from "@/components/portfolio/ContactSection";

const PortfolioPage = () => {
    return (
        <div>
            <Header/>
            <AboutUs/>
            <Values/>
            <Section/>
            <PledgeStrategySection/>
            <ContactSection/>
        </div>
    );
};

export default PortfolioPage;