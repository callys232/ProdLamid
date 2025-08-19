"use client";

import Head from "next/head";
import Image from "next/image";
import { useState, useMemo } from "react";

const EventSummary = () => {
  const [activePage, setActivePage] = useState(0);
  const [selectedType, setSelectedType] = useState("All");

  const events = [
    {
      id: 1,
      name: "EVENT NAME",
      info: "some more information about this event1",
      image: "/tree-background.jpg",
      time: "TIME",
      type: "Workshop",
    },
    {
      id: 2,
      name: "EVENT NAME",
      info: "some more information about this event2",
      image: "/tree-background.jpg",
      time: "TIME",
      type: "Summit",
    },
    {
      id: 3,
      name: "EVENT NAME",
      info: "some more information about this event3",
      image: "/tree-background.jpg",
      time: "TIME",
      type: "Networking",
    },
    {
      id: 4,
      name: "EVENT NAME",
      info: "some more information about this event4",
      image: "/tree-background.jpg",
      time: "TIME",
      type: "Workshop",
    },
    {
      id: 5,
      name: "EVENT NAME",
      info: "some more information about this event5",
      image: "/tree-background.jpg",
      time: "TIME",
      type: "Summit",
    },
    {
      id: 6,
      name: "EVENT NAME",
      info: "some more information about this event6",
      image: "/tree-background.jpg",
      time: "TIME",
      type: "Networking",
    },
    {
      id: 7,
      name: "EVENT NAME",
      info: "some more information about this event7",
      image: "/tree-background.jpg",
      time: "TIME",
      type: "Workshop",
    },
    {
      id: 8,
      name: "EVENT NAME",
      info: "some more information about this event8",
      image: "/tree-background.jpg",
      time: "TIME",
      type: "Summit",
    },
  ];

  const eventTypes = ["All", "Workshop", "Summit", "Networking"];
  const eventsPerPage = 4;

  const filteredEvents = useMemo(() => {
    return selectedType === "All"
      ? events
      : events.filter((event) => event.type === selectedType);
  }, [selectedType]);

  const paginatedEvents = useMemo(() => {
    const pages = Math.ceil(filteredEvents.length / eventsPerPage);
    return Array.from({ length: pages }, (_, i) =>
      filteredEvents.slice(i * eventsPerPage, (i + 1) * eventsPerPage)
    );
  }, [filteredEvents]);

  const totalPages = paginatedEvents.length;
  const currentPageEvents = paginatedEvents[activePage] || [];

  const circleSizes = [800, 600, 400];
  const circleOpacities = ["opacity-50", "opacity-40", "opacity-30"];

  return (
    <>
      <Head>
        {/* Meta tags retained as-is */}
        <meta name="lamid events" content="Events listing page" />
        <meta
          name="description"
          content="Explore Lamid Consulting's events—from corporate summits to community activations—designed to foster innovation, collaboration, and sustainable impact."
        />
        <meta
          name="keywords"
          content="Lamid events, corporate summits, community engagement, strategic events, business networking, innovation workshops, sustainable development"
        />
        <meta name="lamid" content="Lamid Consulting" />
        <meta
          property="og:title"
          content="Lamid Events | Strategic Engagements & Impactful Experiences"
        />
        <meta
          property="og:description"
          content="Join Lamid Consulting's events that drive innovation, collaboration, and sustainable impact across industries and communities."
        />
        <meta
          property="og:image"
          content="https://lamidconsulting.com/events-banner.jpg"
        />
        <meta property="og:url" content="https://lamidconsulting.com/events" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Lamid Events | Strategic Engagements & Impactful Experiences"
        />
        <meta
          name="twitter:description"
          content="Discover Lamid Consulting's events that connect leaders, innovators, and changemakers."
        />
        <meta
          name="twitter:image"
          content="https://lamidconsulting.com/events-banner.jpg"
        />
        <link rel="canonical" href="https://lamidconsulting.com/events" />
      </Head>

      <div className="relative min-h-screen bg-black text-white">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="w-full h-full relative">
            {circleSizes.map((size, i) => (
              <div
                key={i}
                style={{ width: `${size}px`, height: `${size}px` }}
                className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 border border-gray-800 rounded-full ${circleOpacities[i]}`}
              />
            ))}
          </div>
        </div>
        <div className="h-12" />
        <main className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <button className="border border-orange px-4 py-2 text-sm uppercase tracking-wider hover:bg-white hover:text-black transition-colors">
              EVENT SUMMARY
            </button>
            <div className="flex items-center space-x-2">
              <label htmlFor="filter" className="text-sm uppercase">
                Filter:
              </label>
              <select
                id="filter"
                value={selectedType}
                onChange={(e) => {
                  setSelectedType(e.target.value);
                  setActivePage(0);
                }}
                className="bg-black border border-orange text-white px-2 py-1 text-sm"
              >
                {eventTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {currentPageEvents.length > 0 ? (
            <section className="mb-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {currentPageEvents.map((event) => (
                  <article
                    key={event.id}
                    className="flex flex-col items-center bg-black transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg hover:shadow-orange-500/30 rounded-lg p-4"
                  >
                    <div className="w-36 h-36 rounded-full overflow-hidden mb-3 relative">
                      <Image
                        src={event.image}
                        alt={`Image for ${event.name}`}
                        layout="fill"
                        objectFit="cover"
                        loading="lazy"
                        className="glow-circle transition-transform hover:scale-110 hover:shadow-md hover:shadow-orange-400/40"
                      />
                    </div>
                    <button className="border border-orange px-4 py-1 mb-3 text-sm uppercase tracking-wider hover:bg-orange-500 hover:text-white transition-colors">
                      {event.name}
                    </button>
                    <p className="text-center text-sm mb-2 opacity-80">
                      {event.info}
                    </p>
                    <p className="text-center text-xs uppercase tracking-wider">
                      {event.time}
                    </p>
                  </article>
                ))}
              </div>
            </section>
          ) : (
            <p className="text-center text-red-500 text-sm mt-8">
              No events found.
            </p>
          )}

          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-4 mt-8 p-2 rounded-md hover:bg-orange-500/10 transition-colors">
              <button
                onClick={() => setActivePage((prev) => Math.max(prev - 1, 0))}
                disabled={activePage === 0}
                className="px-3 py-1 border border-orange-500 text-sm text-white rounded hover:bg-orange-500 hover:text-black transition-colors disabled:opacity-50"
              >
                Prev
              </button>

              {paginatedEvents.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActivePage(index)}
                  className={`w-4 h-4 rounded-full transition-all duration-300 ${
                    index === activePage
                      ? "bg-orange-500 scale-110 shadow-md shadow-orange-500/40"
                      : "bg-gray-600 hover:bg-orange-400"
                  }`}
                  aria-label={`Go to page ${index + 1}`}
                />
              ))}

              <button
                onClick={() =>
                  setActivePage((prev) => Math.min(prev + 1, totalPages - 1))
                }
                disabled={activePage === totalPages - 1}
                className="px-3 py-1 border border-orange-500 text-sm text-white rounded hover:bg-orange-500 hover:text-black transition-colors disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default EventSummary;
