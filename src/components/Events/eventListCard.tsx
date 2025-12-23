"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import type { EventItem } from "@/types/eventTypes";

interface EventListCardProps {
  event: EventItem;
  onClick: (event: EventItem) => void;
  index: number;
}

const EventListCard: React.FC<EventListCardProps> = ({
  event,
  onClick,
  index,
}) => {
  // Map categories to fixed colors
  const accentColorByCategory: Record<string, string> = {
    Workshop: "bg-orange-500",
    Seminar: "bg-[#c21219]",
    Networking: "bg-blue-500",
    Conference: "bg-green-500",
    Training: "bg-purple-500",
  };

  const accentPalette = [
    "bg-orange-500",
    "bg-[#c21219]",
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
  ];

  const accentColor =
    event.category && accentColorByCategory[event.category]
      ? accentColorByCategory[event.category]
      : accentPalette[index % accentPalette.length];

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -4 }}
      className="
        group relative cursor-pointer rounded-xl overflow-hidden
        bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-md
        border border-white/10 shadow-md
        hover:shadow-orange-500/20 hover:border-orange-500
        transition-all duration-300
      "
      onClick={() => onClick(event)}
    >
      {/* Thumbnail */}
      <div className="relative w-full h-40 overflow-hidden">
        <Image
          src={event.image}
          alt={event.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition" />
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col h-full">
        <h3
          className="
            text-lg font-extrabold mb-1
            bg-gradient-to-r from-orange-400 to-red-600 bg-clip-text text-transparent
            group-hover:from-orange-300 group-hover:to-red-500 transition-all
          "
        >
          {event.title}
        </h3>

        {event.date && (
          <p className="text-sm text-gray-300 mb-1">
            {event.date} {event.time && `— ${event.time}`}
          </p>
        )}

        {event.location && (
          <p className="text-sm text-gray-400 mb-2">{event.location}</p>
        )}

        <p className="text-sm text-gray-200 line-clamp-3">
          {event.description}
        </p>
      </div>

      {/* Centered dynamic accent bar */}
      <div
        className={`
          absolute bottom-0 left-1/2 -translate-x-1/2
          h-1 w-1/3 ${accentColor}
          group-hover:w-1/2 transition-all rounded-t-md
        `}
      />
    </motion.div>
  );
};

export default EventListCard;
