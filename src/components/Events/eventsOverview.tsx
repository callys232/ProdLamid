"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import type { EventItem } from "@/types/eventTypes";
import { mockEvents } from "@/mocks/mockEvents";
import EventModal from "./eventsModal";
import CategoryLegend from "./CategoryLegend";
import Link from "next/link";

export default function EventsOverview() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
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

  // Show only first 6 events
  const displayedEvents = events.slice(0, 6);

  return (
    <div className="bg-black text-white py-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-orange-500">Event Summary</h2>
          <Link href="/events">
            <button className="bg-orange-500 text-white px-6 py-2 rounded font-semibold hover:bg-[#c21219] transition">
              View All Events
            </button>
          </Link>
        </div>

        <CategoryLegend />

        {/* Event cards */}
        {loading ? (
          <p className="text-center text-gray-400">Loading events...</p>
        ) : displayedEvents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedEvents.map((event) => (
              <div
                key={event.id}
                className="group bg-white/5 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden hover:border-orange-500 hover:shadow-lg hover:shadow-orange-500/10 transition cursor-pointer"
                onClick={() => setSelectedEvent(event)}
              >
                <div className="relative h-44 w-full">
                  <Image
                    src={event.image || "/tree-background.jpg"}
                    alt={event.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition" />
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold bg-gradient-to-r from-orange-400 to-red-600 bg-clip-text text-transparent mb-2">
                    {event.title}
                  </h3>
                  <p className="text-sm text-gray-300 mb-2 line-clamp-2">
                    {event.description}
                  </p>
                  <p className="text-xs text-gray-400 uppercase tracking-wide">
                    {event.date} {event.time && `— ${event.time}`}
                  </p>
                  <p className="text-xs text-gray-500">{event.location}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400">No events available.</p>
        )}

        {/* Modal for selected event */}
        {selectedEvent && (
          <EventModal
            event={selectedEvent}
            isOpen={true}
            onClose={() => setSelectedEvent(null)}
          />
        )}
      </div>
    </div>
  );
}
