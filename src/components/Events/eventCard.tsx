"use client";

import Image from "next/image";
import type { EventItem } from "@/types/eventTypes";

interface EventCardProps {
  event: EventItem;
  onClick: () => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onClick }) => {
  const thumbnail = event.images?.[0]?.path || event.image;

  return (
    <div
      onClick={onClick}
      className="flex flex-col items-center cursor-pointer opacity-0 animate-fadeIn 
                 transform transition duration-300 hover:scale-105 hover:-translate-y-1 
                 hover:shadow-xl hover:shadow-orange-500/30 rounded-xl bg-gradient-to-b 
                 from-gray-900 to-black p-4"
    >
      <div className="w-36 h-36 rounded-full overflow-hidden mb-3 relative ring-2 ring-transparent hover:ring-orange-500 transition">
        <Image
          src={thumbnail}
          alt={event.images?.[0]?.alt || event.title}
          fill
          className="object-cover transition-transform duration-300 hover:scale-110"
        />
      </div>
      <div
        className="border border-white px-4 py-1 mb-3 text-sm uppercase tracking-wider 
                      hover:bg-white hover:text-black transition-colors rounded-md"
      >
        {event.title}
      </div>
      <p className="text-center text-sm mb-2 opacity-80">{event.description}</p>
      {event.time && (
        <p className="text-center text-xs uppercase tracking-wider text-orange-400">
          {event.time}
        </p>
      )}
    </div>
  );
};

export default EventCard;
