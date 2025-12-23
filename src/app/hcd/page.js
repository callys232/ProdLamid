import HcdHeader from "@/components/hcd/hcdHeader";
import HcdTrainer from "@/components/hcd/hcdTrainer";
import HcdEvent from "@/components/hcd/hcdEvent";
import BusinessPrototypes from "@/components/bizprototype/bizPrototypes";
import Testimonial from "@/components/Testimonial";
// import BusinessTraining from "@/components/hcd/hcdTrainer";
import HcdBp from "@/components/Humancapital/skillsTag";
import BusinessTraining from "@/components/hcd/businessTraining";

const HCDPage = () => {
  return (
    <div>
      <HcdHeader />
      <HcdTrainer />
      <HcdEvent />
      <BusinessPrototypes text="Biz Prototypes" />
      <BusinessTraining />
      <Testimonial />
      {/* <HcdBp/> */}
    </div>
  );
};

export default HCDPage;
