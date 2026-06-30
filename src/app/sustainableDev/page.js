import SDHeader from "@/components/sustainableDev/SDHeader";
import AivoraTestimonials from "@/components/aivora/AivoraTestimonials";
import SDImpactDashboard from "@/components/sustainableDev/SDImpactDashboard";
import SDImapactandSocial from "@/components/sustainableDev/SDImapactandSocial";
import SDQA from "@/components/sustainableDev/SDQA";
import SDBusinessPrototype from "@/components/sustainableDev/SDBusinessPrototype";
import SDTestimonialandRest from "@/components/sustainableDev/SDTestimonialandRest";

export const metadata = {
  title: "Sustainable Development | Lamid Consulting",
  description: "Community transformation, gender equality, health and education partnerships, and impact-driven consulting for NGOs and development agencies.",
};

const sustainableDevPage = () => {
  return (
    <div>
      <SDHeader />
      {/* <SDImpactDashboard /> */}
      {/* <SDImapactandSocial />
      <SDQA /> */}
      {/* <SDBusinessPrototype />
      <SDTestimonialandRest /> */}
      <AivoraTestimonials />
    </div>
  );
};

export default sustainableDevPage;
