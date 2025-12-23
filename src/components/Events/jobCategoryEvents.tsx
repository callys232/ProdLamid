"use client";

import { useState, useEffect } from "react";
import type { EventItem } from "@/types/eventTypes";
import { mockEvents } from "@/mocks/mockEvents";
import EventListCard from "./eventListCard";
import CategoryModal from "./categoryModal";

interface JobCategory {
  title: string;
  key: string; // used to match event.category
}

const jobCategories: JobCategory[] = [
  { title: "Job Scoping", key: "Job Scoping" },
  { title: "About to Disappear Jobs", key: "Disappearing Jobs" },
  { title: "Re-skilling for 21st Century Jobs", key: "Reskilling" },
];

const JobCategoryEvents = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<JobCategory | null>(
    null
  );

  useEffect(() => {
    async function fetchEvents() {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
        const res = await fetch(`${baseUrl}/api/events`, { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch events");
        const data = await res.json();
        setEvents(Array.isArray(data) ? data : mockEvents);
      } catch (error) {
        console.error("Error fetching events, using mock data:", error);
        setEvents(mockEvents);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  const filteredEvents = activeCategory
    ? events.filter((ev) => ev.category === activeCategory.key)
    : [];

  return (
    <div className="bg-black text-white py-8">
      <h2 className="text-xl font-bold mb-6 text-center">Job Categories</h2>

      {/* Category tiles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {jobCategories.map((job, idx) => (
          <div
            key={idx}
            className="group relative flex flex-col bg-black border border-transparent rounded-xl shadow-md 
                       transition-all duration-300 hover:shadow-lg hover:border-orange-500 cursor-pointer"
            onClick={() => setActiveCategory(job)}
          >
            <div className="bg-gray-700 aspect-video rounded-t-xl group-hover:bg-gray-600 transition"></div>
            <div className="p-4 flex flex-col flex-1">
              <h3 className="text-md font-semibold text-white mb-2 group-hover:text-orange-500 transition-colors">
                {job.title}
              </h3>
              <span className="text-orange-500 text-sm font-medium">
                View this →
              </span>
            </div>
            <div
              className="absolute bottom-0 left-1/2 -translate-x-1/2 h-1 w-1/3 bg-[#c21219] 
                            group-hover:w-1/2 transition-all rounded-t-md"
            />
          </div>
        ))}
      </div>

      {/* Category modal */}
      {activeCategory && (
        <CategoryModal
          title={activeCategory.title}
          isOpen={!!activeCategory}
          onClose={() => setActiveCategory(null)}
        >
          {loading ? (
            <p className="text-center text-gray-400">Loading events...</p>
          ) : filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredEvents.map((event, idx) => (
                <EventListCard
                  key={event.id}
                  event={event}
                  onClick={() => {}} // disable nested modal inside category modal
                  index={idx}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-400">
              No events available for this category.
            </p>
          )}
        </CategoryModal>
      )}
    </div>
  );
};

export default JobCategoryEvents;
