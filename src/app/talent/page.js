import Consultants from "@/components/talent/consultProject";
import Reviews from "../../components/review/review";
import SearchBar from "@/components/search/SearchBar";

export const metadata = {
  title: "Find Consultants — Lamid",
  description: "Browse 5,000+ vetted consultants across 20 specialist categories.",
};

const TalentPage = () => {
  return (
    <div>
      <div className="bg-black px-4 pt-24 pb-8">
        <div className="mx-auto max-w-5xl text-center">
          <h1 className="mb-3 text-4xl font-bold text-white">Find a Consultant</h1>
          <p className="mb-6 text-gray-400">5,000+ vetted experts across 20 specialist categories</p>
          <SearchBar
            placeholder="Search by name, title, or skill…"
            searchType="consultants"
            className="max-w-2xl mx-auto"
          />
        </div>
      </div>
      <Consultants />
      <Reviews />
    </div>
  );
};

export default TalentPage;
