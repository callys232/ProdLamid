import SDHeader from "@/components/sustainableDev/SDHeader";
import Testimonial from "@/components/Testimonial";
import Impact from "@/components/Impact";

import SDImapactandSocial from "@/components/sustainableDev/SDImapactandSocial";
import SDQA from "@/components/sustainableDev/SDQA";
import SDBusinessPrototype from "@/components/sustainableDev/SDBusinessPrototype";
import SDTestimonialandRest from "@/components/sustainableDev/SDTestimonialandRest";

const sustainableDevPage = () => {
    return (
        <div>
           <SDHeader/>
            <Impact/>
            <Testimonial/>
            
           {/* <SDImapactandSocial/>
           <div className="w-full h-px bg-gray-700"></div>
           <SDQA/>
           <SDBusinessPrototype/>
           <SDTestimonialandRest/> */}
        </div>
    )
};

export default sustainableDevPage;