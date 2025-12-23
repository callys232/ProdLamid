"use client";

import { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import type { EventItem } from "@/types/eventTypes";
import { mockEvents } from "@/mocks/mockEvents";
import EventModal from "./eventsModal";
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
      <Head>
        <title>Events Overview | HCD Worldwide</title>
        <meta
          name="description"
          content="Discover highlights from HCD Worldwide's leadership, innovation, and transformation events."
        />
      </Head>

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold text-orange-600">Event Summary</h2>
          <Link href="/events">
            <button className="bg-orange-600 text-white px-6 py-2 rounded font-semibold hover:bg-orange-700 transition">
              View All Events
            </button>
          </Link>
        </div>

        {/* Event cards */}
        {loading ? (
          <p className="text-center text-gray-400">Loading events...</p>
        ) : displayedEvents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedEvents.map((event) => (
              <div
                key={event.id}
                className="bg-white text-black rounded-lg shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer"
                onClick={() => setSelectedEvent(event)}
              >
                <div className="relative h-44 w-full">
                  <Image
                    src={event.image || "/tree-background.jpg"}
                    alt={event.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-orange-600 mb-2">
                    {event.title}
                  </h3>
                  <p className="text-sm text-gray-700 mb-2 line-clamp-2">
                    {event.description}
                  </p>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">
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
