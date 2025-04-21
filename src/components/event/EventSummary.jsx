"use client"

import Head from 'next/head';
import Image from 'next/image';
import { useState } from 'react';

const EventSummary = () => {
    const [activePage, setActivePage] = useState(0);
  
  // Sample event data - in a real app, this would come from an API or database
  const events = [
    {
      id: 1,
      name: "EVENT NAME",
      info: "some more information about this event1",
      image: "/tree-background.jpg",
      time: "TIME"
    },
    {
      id: 2,
      name: "EVENT NAME",
      info: "some more information about this event2",
      image: "/tree-background.jpg",
      time: "TIME"
    },
    {
      id: 3,
      name: "EVENT NAME",
      info: "some more information about this event3",
      image: "/tree-background.jpg",
      time: "TIME"
    },
    {
      id: 4,
      name: "EVENT NAME",
      info: "some more information about this event4",
      image: "/tree-background.jpg",
      time: "TIME"
    },
    {
      id: 5,
      name: "EVENT NAME",
      info: "some more information about this event5",
      image: "/tree-background.jpg",
      time: "TIME"
    },
    {
      id: 6,
      name: "EVENT NAME",
      info: "some more information about this event6",
      image: "/tree-background.jpg",
      time: "TIME"
    },
    {
      id: 7,
      name: "EVENT NAME",
      info: "some more information about this event7",
      image: "/tree-background.jpg",
      time: "TIME"
    },
    {
      id: 8,
      name: "EVENT NAME",
      info: "some more information about this event8",
      image: "/tree-background.jpg",
      time: "TIME"
    },
  ];
  
  // Split events into pages of 4
  const eventsPerPage = 4;
  const totalPages = Math.ceil(events.length / eventsPerPage);
  const paginatedEvents = Array.from({ length: totalPages }, (_, i) => 
    events.slice(i * eventsPerPage, (i + 1) * eventsPerPage)
  );

  return (
    <div className="min-h-screen bg-black text-white py-6 px-4">
      <Head>
        <title>Events</title>
        <meta name="description" content="Events listing page" />
      </Head>

      <main className="max-w-6xl mx-auto">
        {paginatedEvents.map((pageEvents, pageIndex) => (
          <div 
            key={pageIndex} 
            className={`${pageIndex === activePage ? 'block' : 'hidden'} mb-8`}
          >
            <div className="flex justify-between items-center mb-6">
              <button className="border border-white px-4 py-2 text-sm uppercase tracking-wider hover:bg-white hover:text-black transition-colors">
                EVENT SUMMARY
              </button>
              <button className="border border-white px-4 py-2 text-sm uppercase tracking-wider hover:bg-white hover:text-black transition-colors flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                FILTER
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {pageEvents.map((event) => (
                <div key={event.id} className="flex flex-col items-center">
                  <div className="w-36 h-36 rounded-full overflow-hidden mb-3 relative">
                    <Image
                      src={event.image}
                      alt={event.name}
                      layout="fill"
                      objectFit="cover"
                      className="transition-transform hover:scale-110"
                    />
                  </div>
                  <button className="border border-white px-4 py-1 mb-3 text-sm uppercase tracking-wider hover:bg-white hover:text-black transition-colors">
                    {event.name}
                  </button>
                  <p className="text-center text-sm mb-2 opacity-80">{event.info}</p>
                  <p className="text-center text-xs uppercase tracking-wider">{event.time}</p>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Pagination dots */}
        <div className="flex justify-center space-x-2 mt-8">
          {paginatedEvents.map((_, index) => (
            <button
              key={index}
              onClick={() => setActivePage(index)}
              className={`w-4 h-4 rounded-full ${index === activePage ? 'bg-white' : 'bg-gray-600'}`}
              aria-label={`Go to page ${index + 1}`}
            ></button>
          ))}
        </div>
      </main>
    </div>
    )
};

export default EventSummary;