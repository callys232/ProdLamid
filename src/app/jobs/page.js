import ConsultingHero from "@/components/consultingHero";
import Job from "@/components/jobsConsult/jobConsult";
import SearchBar from "@/components/search/SearchBar";

export const metadata = {
  title: "Browse Projects — Lamid",
  description: "Find consulting projects across 20 specialist categories.",
};

const JobPage = () => {
  return (
    <div>
      <ConsultingHero />
      <div className="bg-black px-4 py-6">
        <div className="mx-auto max-w-5xl">
          <SearchBar
            placeholder="Search projects by title, category, or skill…"
            searchType="projects"
            className="max-w-2xl mx-auto"
          />
        </div>
      </div>
      <Job />
    </div>
  );
};
export default JobPage;
