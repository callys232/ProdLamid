"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import type { EventItem } from "@/types/eventTypes";
import { getEvents } from "@/lib/api/eventApi";
import EventListCard from "./eventListCard";
import EventModal from "./eventsModal";
import JobCategoryEvents from "./jobCategoryEvents";
import CategoryLegend from "./CategoryLegend";

const EventList = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

  useEffect(() => {
    async function fetchEvents() {
      try {
        setLoading(true);
        setError(null);
        const data = await getEvents();
        // Map Event to EventItem if needed
        setEvents(data.map((e: any) => ({
          id: e._id ? parseInt(e._id.toString().slice(-8), 16) : Date.now(),
          title: e.title || e.eventTitle || "",
          description: e.description || "",
          image: e.image || e.images?.[0]?.path || "",
          date: e.date || "",
          time: e.time || "",
          location: e.location || "",
          category: e.category || ""
        })) as EventItem[]);
      } catch (err: any) {
        console.error("Error fetching events:", err);
        setError("Failed to load events. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, []);

  return (
    <div className="w-full bg-black text-white">
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          {/* Logo section */}
          <div className="w-1/6 flex-shrink-0 flex justify-start">
            <div className="relative w-28 h-24">
              <Image
                src="/human-capital-icon.png"
                alt="Human Capital Icon"
                fill
                priority
                className="object-contain"
              />
            </div>
          </div>

          {/* Content section */}
          <div className="flex-1 w-full">
            <h2 className="text-xl font-bold mb-6 text-right">
              Upcoming Events
            </h2>

            <CategoryLegend />

            {/* Top image grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {loading ? (
                <>
                  <div className="bg-gray-700 aspect-video rounded animate-pulse"></div>
                  <div className="bg-gray-700 aspect-video rounded animate-pulse"></div>
                  <div className="bg-gray-700 aspect-video rounded animate-pulse"></div>
                  <div className="bg-gray-700 aspect-video rounded animate-pulse"></div>
                </>
              ) : error ? (
                <div className="col-span-4 text-center text-red-400 py-8">
                  <p className="mb-4">{error}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="bg-orange-500 px-4 py-2 rounded hover:bg-orange-600"
                  >
                    Retry
                  </button>
                </div>
              ) : events.length > 0 ? (
                events
                  .slice(0, 4)
                  .map((event, idx) => (
                    <EventListCard
                      key={event.id}
                      event={event}
                      onClick={(ev) => setSelectedEvent(ev)}
                      index={idx}
                    />
                  ))
              ) : (
                <p className="text-gray-400 col-span-4 text-center">
                  No events available.
                </p>
              )}
            </div>

            {/* Invitation text */}
            <div className="text-left text-sm mb-6">
              <p>
                To obtain an invitation to our much sought-after business clinic
                and get a chance to win a free diagnostic card,{" "}
                <a href="#" className="text-orange-500 underline">
                  click here
                </a>
              </p>
            </div>

            {/* Job categories section */}
            <JobCategoryEvents />

            {/* Past events button */}
            <div className="flex justify-center mb-8">
              <button
                className="bg-orange-500 text-white px-4 py-2 rounded text-sm uppercase hover:bg-orange-600 transition"
                aria-label="Past events"
              >
                Past Events
              </button>
            </div>

            {/* Job search clinic section */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative w-32 h-32 mb-2">
                <Image
                  src="/Job-search.png"
                  alt="Job search illustration"
                  fill
                  className="object-contain"
                />
              </div>
              <button
                className="bg-orange-500 text-white px-4 py-2 rounded text-sm hover:bg-orange-600 transition"
                aria-label="Job search clinic"
              >
                Job search clinic
              </button>
            </div>

            {/* Footer tagline */}
            <div className="text-left text-sm mt-8">
              <p>
                Exploring the ideas of shaping tomorrow&apos;s opportunities
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Single Event Modal */}
      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          isOpen={true}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
};

export default EventList;
