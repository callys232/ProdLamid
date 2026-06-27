"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { EventItem } from "@/types/eventTypes";

interface EventCardProps {
  event: EventItem;
  onClick: () => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onClick }) => {
  const thumbnail = event.images?.[0]?.path || event.image;

  return (
    <motion.div
      onClick={onClick}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ scale: 1.05, y: -4 }}
      className="flex flex-col items-center cursor-pointer
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
    </motion.div>
  );
};

export default EventCard;
