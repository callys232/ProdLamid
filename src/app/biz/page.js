import BizHeader from "@/components/biz/BizHeader";
import BizBestSection from "@/components/biz/BizBestSection";
import BizAccessCards from "@/components/biz/BizAccessCards";
import BizToolbox from "@/components/biz/BizToolbox";
import BusinessServicesGrid from "@/components/biz/BusinessServicesGrid";
import BusinessPrototypes from "@/components/bizprototype/bizPrototypes";
import BizPhere from "@/components/biz/BizPhere";
import BusinessGrowthSection from "@/components/biz/businessGrowth";
import BusinessHistorySection from "@/components/biz/BusinessHistorySection";
import BizVisionCardsSection from "@/components/biz/BizVisionCardsSection";
import Testimonial from "@/components/Testimonial";
const BizPage = () => {
  return (
    <div>
      <BizHeader />
      <BizBestSection />
      <BizAccessCards />
      <BizToolbox />
      {/* <BusinessServicesGrid /> */}
      <BusinessPrototypes />
      <BizPhere />
      <BusinessGrowthSection />
      <BusinessHistorySection />
      <BizVisionCardsSection />
      <Testimonial />
    </div>
  );
};

export default BizPage;
