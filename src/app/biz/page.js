import BizHeader from "@/components/biz/BizHeader";
import BizBestSection from "@/components/biz/BizBestSection";
import BizToolbox from '@/components/biz/BizToolbox';
import BusinessServicesGrid from '@/components/biz/BusinessServicesGrid';
import BusinessPrototypes from "@/components/event/BusinessPrototypes ";
import BizPhere from '@/components/biz/BizPhere';
import BusinessGrowthSection from '@/components/biz/BusinessGrowthSection';
import BusinessHistorySection from "@/components/biz/BusinessHistorySection";
import BizVisionCardsSection from "@/components/biz/BizVisionCardsSection";
import Testimonial from "@/components/Testimonial";
const BizPage = () => {
  return (
    <div>
      <BizHeader />
      <BizBestSection />
      <BizToolbox/>
      <BusinessServicesGrid />
      <BusinessPrototypes text='Biz Prototypes'/>
      <BizPhere />
      <BusinessGrowthSection />
      <BusinessHistorySection/>
      <BizVisionCardsSection />
      <Testimonial />
    </div>
  );
};

export default BizPage;
