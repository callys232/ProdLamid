"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FilterSidebar, { FilterOption } from "./FilterSidebar";
import ConsultantCard from "./consultantCard";
import { mockConsultants } from "@/mocks/mockClient";
import type { Consultant } from "@/types/client";

/* -------------------- FILTER TYPE -------------------- */
type ConsultantFilters = {
  search: string;
  industry: string;
  rate: string;
  rating: string;
};

/* -------------------- DEFAULT FILTERS -------------------- */
const defaultFilters: ConsultantFilters = {
  search: "",
  industry: "All",
  rate: "All",
  rating: "All",
};

export default function ConsultantsSection({
  showSidebar,
}: {
  showSidebar: boolean;
}) {
  const [filters, setFilters] = useState<ConsultantFilters>(defaultFilters);

  /* -------------------- FILTER OPTIONS -------------------- */
  const industries = useMemo(
    () => ["All", ...new Set(mockConsultants.map((c) => c.industry))],
    []
  );

  const parseRate = (rate: string | number): number =>
    typeof rate === "number"
      ? rate
      : parseInt(rate.replace(/\D/g, ""), 10) || 0;

  /* -------------------- FILTERING LOGIC -------------------- */
  const filteredConsultants = useMemo(() => {
    const isDefault =
      JSON.stringify(filters) === JSON.stringify(defaultFilters);
    if (isDefault) return mockConsultants;

    const term = filters.search.toLowerCase();
    return mockConsultants.filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(term) ||
        c.industry.toLowerCase().includes(term) ||
        c.delivery.toLowerCase().includes(term);

      const matchesIndustry =
        filters.industry === "All" || c.industry === filters.industry;

      const rateValue = parseRate(c.rate);
      const matchesRate =
        filters.rate === "All" ||
        (filters.rate === "Under $700" && rateValue < 700) ||
        (filters.rate === "$700-$1800" &&
          rateValue >= 700 &&
          rateValue <= 1800) ||
        (filters.rate === "Over $2000" && rateValue > 2000);

      const matchesRating =
        filters.rating === "All" || c.rating >= Number(filters.rating);

      return matchesSearch && matchesIndustry && matchesRate && matchesRating;
    });
  }, [filters]);

  /* -------------------- FILTER CONFIG -------------------- */
  const filterConfig: FilterOption<ConsultantFilters>[] = [
    { label: "Industry", key: "industry", options: industries },
    {
      label: "Rate",
      key: "rate",
      options: ["All", "Under $700", "$700-$1800", "Over $2000"],
    },
    {
      label: "Rating",
      key: "rating",
      options: ["All", "5", "4", "3"],
      isRating: true,
    },
  ];

  /* -------------------- RENDER -------------------- */
  return (
    <>
      {showSidebar && (
        <aside className="lg:col-span-1">
          <FilterSidebar<ConsultantFilters>
            activeTab="consultants"
            filters={filters}
            setFilters={setFilters}
            filterConfigs={filterConfig}
            showClearButton={
              JSON.stringify(filters) !== JSON.stringify(defaultFilters)
            }
            handleClearFilters={() => setFilters(defaultFilters)}
          />
        </aside>
      )}

      <main className={showSidebar ? "lg:col-span-3" : "lg:col-span-4"}>
        <h2 className="text-2xl font-bold mb-6">Freelancers</h2>
        <AnimatePresence mode="wait">
          <motion.div
            key="consultants"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
          >
            {filteredConsultants.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredConsultants.map((c) => (
                  <motion.div key={c.id} layout>
                    <ConsultantCard consultant={c} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-400 mt-10">
                <p>No freelancers found matching your filters.</p>
                <button
                  onClick={() => setFilters(defaultFilters)}
                  className="mt-4 bg-red-600 px-4 py-2 rounded-md font-semibold"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </>
  );
}
