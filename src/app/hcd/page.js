import HcdHeader from "@/components/hcd/HcdHeader";
import HcdTrainer from "@/components/hcd/HcdTrainer";
import HcdEvent from "@/components/hcd/HcdEvent";
import BusinessPrototypes from "@/components/event/BusinessPrototypes ";
import Testimonial from "@/components/Testimonial";
import BusinessTraining from "@/components/hcd/BusinessTraining";
import HcdBp from "@/components/hcd/HcdBp";

const HCDPage = () => {
    return (
        <div>
            <HcdHeader/>
            <HcdTrainer/>
            <HcdEvent/>
            <BusinessPrototypes text='Biz Prototypes'/>
            <BusinessTraining/>
            <Testimonial/>
            {/* <HcdBp/> */}
        </div>
    )
};

export default HCDPage;