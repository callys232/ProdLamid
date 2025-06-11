import { useState, useEffect } from "react";
import Image from "next/image";
import BizSphereModal from "./BizSphereModal";
import Signup from "./SignupForm";

const EventCard = ({ event, index, selectedEventId, onSelect }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), index * 950);
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <button
      onClick={() => onSelect(event.id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`flex flex-col items-center rounded-lg p-3 shadow-md transition-all duration-500 ease-out transform 
      ${isVisible ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0"} 
      ${
        selectedEventId === event.id || isHovered
          ? "border border-orange-500"
          : "border-none"
      } 
      hover:scale-105`}
    >
      <div className="relative w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 rounded-full overflow-hidden mb-2 md:mb-3">
        <Image
          src={event.image}
          alt={event.name}
          fill
          sizes="(max-width: 600px) 100vw, 40vw"
          className="object-cover"
        />
      </div>
      <p className="text-center text-xs md:text-sm">{event.name}</p>
    </button>
  );
};

const Events = ({
  categories = ["Startups", "Growth Firms", "Co-operatives", "Social Sector"],
  events = [
    { id: 1, name: "About To Disappear Jobs", image: "/EfficiencyIcon.png" },
    { id: 2, name: "Human Development", image: "/EfficiencyIcon.png" },
    { id: 3, name: "The Niger Delta", image: "/EfficiencyIcon.png" },
    { id: 4, name: "Transforming Communities", image: "/EfficiencyIcon.png" },
  ],
  showSignUp = true,
  showMore = true,
  onSignUp = () => console.log("Sign Up clicked"),
  onMore = () => console.log("More clicked"),
}) => {
  const [selectedEventId, setSelectedEventId] = useState(null);

  return (
    <section className="w-full bg-black text-white py-6 md:py-8">
      {/* Category Navigation */}
      <div className="container mx-auto px-4 py-4 md:py-6">
        <nav className="flex flex-wrap justify-center gap-3 md:gap-6 text-xs md:text-sm lg:text-base">
          {categories.map((category, index) => (
            <a
              key={index}
              href="#"
              className="text-orange-500 hover:text-orange-400 transition duration-300"
            >
              {category}
            </a>
          ))}
        </nav>
      </div>

      {/* Events Section */}
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="flex justify-start mb-6 md:mb-8">
          <div className="border hover:bg-orange-700 border-orange-900 rounded-lg inline-block px-6 py-2">
            <h2 className="text-white text-sm md:text-base">EVENTS</h2>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 lg:gap-8 mb-6 md:mb-8">
          {events.map((event, index) => (
            <EventCard
              key={event.id}
              event={event}
              index={index}
              selectedEventId={selectedEventId}
              onSelect={setSelectedEventId}
            />
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {showSignUp && (
            <button
              onClick={() => console.log("Events clicked")}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-md text-xs md:text-sm transition duration-300"
              aria-label="Sign up for events"
            >
              Sign Up
            </button>
          )}
          {showMore && (
            <button
              onClick={() => console.log("More clicked")}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-md text-xs md:text-sm transition duration-300"
              aria-label="See more events"
            >
              More
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default Events;
