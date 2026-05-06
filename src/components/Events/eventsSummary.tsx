"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import EventCard from "./eventCard";
import EventModal from "./eventsModal";
import type { EventItem, Action } from "@/types/eventTypes"; // ✅ single source of truth
import { mockEvents } from "@/mocks/mockEvents";

const EventSummary: React.FC = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const router = useRouter();

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

  const eventsPerPage = 4;
  const totalPages = Math.ceil(events.length / eventsPerPage);
  const paginatedEvents = Array.from({ length: totalPages }, (_, i) =>
    events.slice(i * eventsPerPage, (i + 1) * eventsPerPage)
  );

  // ✅ Define modal actions using the Action type
  const registerAction: Action | undefined = selectedEvent
    ? {
        label: "Register",
        onClick: () => router.push(`/events/${selectedEvent.id}/register`),
      }
    : undefined;

  return (
    <div className="w-full bg-black text-white pb-6 px-4">
      <main className="max-w-6xl mx-auto">
        {loading ? (
          <p className="text-center text-gray-400">Loading events...</p>
        ) : events.length === 0 ? (
          <p className="text-center text-gray-400">No events available.</p>
        ) : (
          paginatedEvents.map((pageEvents, pageIndex) => (
            <div
              key={pageIndex}
              className={`${
                pageIndex === activePage ? "block" : "hidden"
              } mb-8`}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {pageEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onClick={() => setSelectedEvent(event)}
                  />
                ))}
              </div>
            </div>
          ))
        )}

        {/* Pagination dots */}
        {totalPages > 1 && (
          <div className="flex justify-center space-x-2 mt-8">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                aria-label={`Go to page ${index + 1}`}
                onClick={() => setActivePage(index)}
                className={`w-4 h-4 rounded-full ${
                  index === activePage
                    ? "bg-white"
                    : "bg-gray-600 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        )}
      </main>

      {/* Modal */}
      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          isOpen={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
          primaryAction={registerAction} // ✅ typed via Action
        />
      )}
    </div>
  );
};

export default EventSummary;
