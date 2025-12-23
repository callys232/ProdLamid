"use client";

import { useState, useEffect } from "react";
import type { EventItem } from "@/types/eventTypes";
import { mockEvents } from "@/mocks/mockEvents";
import EventListCard from "./eventListCard";
import EventModal from "./eventsModal";

const AllEvents = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

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

  const filteredEvents = events.filter((ev) => {
    const term = searchTerm.toLowerCase();
    return (
      ev.title.toLowerCase().includes(term) ||
      (ev.description && ev.description.toLowerCase().includes(term)) ||
      (ev.location && ev.location.toLowerCase().includes(term))
    );
  });

  return (
    <div className="bg-black text-white py-8">
      <h2 className="text-3xl font-extrabold mb-6 text-center bg-gradient-to-r from-orange-400 to-red-600 bg-clip-text text-transparent">
        All Events
      </h2>

      {/* Search input */}
      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Search events..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/2 px-4 py-2 rounded-md border border-orange-500 bg-black text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      {/* Events grid */}
      {loading ? (
        <p className="text-center text-gray-400">Loading events...</p>
      ) : filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event, idx) => (
            <EventListCard
              key={event.id}
              event={event}
              onClick={(ev) => setSelectedEvent(ev)}
              index={idx}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-400">No events found.</p>
      )}

      {/* Modal */}
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

export default AllEvents;
