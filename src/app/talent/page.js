import Consultants from "@/components/talent/consultProject";
import Reviews from "../../components/review/review";
import SearchBar from "@/components/search/SearchBar";

export const metadata = {
  title: "Browse Consultants — AIVORA",
  description: "Find the right expert. Browse 500+ vetted, AI-matched consultants across strategy, finance, tech, legal, and more.",
};

const TalentPage = () => {
  return (
    <div>
      <div className="bg-black px-4 pt-24 pb-8">
        <div className="mx-auto max-w-5xl text-center">
          <p className="aivora-gradient-text text-[10px] tracking-[0.35em] uppercase font-bold mb-3">
            AIVORA Marketplace
          </p>
          <h1 className="mb-3 text-3xl sm:text-4xl font-bold text-white">
            Find the Right Expert.
          </h1>
          <p className="mb-6 text-white/50 text-sm sm:text-base max-w-lg mx-auto">
            Vetted, AI-matched consultants — ready to deliver results from day one.
          </p>
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
