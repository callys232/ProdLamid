import ConsultingHero from "@/components/consultingHero";
import Job from "@/components/jobsConsult/jobConsult";
export const metadata = {
  title: "Browse Projects — Lamid",
  description: "Find consulting projects across 20 specialist categories.",
};

const JobPage = () => {
  return (
    <div>
      <ConsultingHero />
      <Job />
    </div>
  );
};
export default JobPage;
