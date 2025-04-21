import { useState } from 'react';
import Image from 'next/image';
import BizSphereModal from './BizSphereModal';

const Events = ({ 
  categories = ["Startups", "Growth Firms", "Co-operatives", "Social Sector"],
  events = [
    { id: 1, name: "Event Name", image: "/EfficiencyIcon.png" },
    { id: 2, name: "Event Name", image: "/EfficiencyIcon.png" },
    { id: 3, name: "Event Name", image: "/EfficiencyIcon.png" },
    { id: 4, name: "Event Name", image: "/EfficiencyIcon.png" }
  ],
  showSignUp = true,
  showMore = true,
  onSignUp = () => console.log("Sign Up clicked"),
  onMore = () => console.log("More clicked")
}) => {

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
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
          <div className="border border-orange-500 rounded-lg inline-block px-6 py-2">
            <h2 className="text-white text-sm md:text-base">EVENTS</h2>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 lg:gap-8 mb-6 md:mb-8">
          {events.map((event) => (
            <div key={event.id} className="flex flex-col items-center">
              <div className="relative w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 rounded-full overflow-hidden mb-2 md:mb-3">
                <Image 
                  src={event.image} 
                  alt={event.name} 
                  fill
                  className="object-cover"
                />
              </div>
              <p className="text-center text-xs md:text-sm">{event.name}</p>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {showSignUp && (
            <button 
              onClick={openModal}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-md text-xs md:text-sm transition duration-300"
            >
              Sign Up
            </button>
          )}
          {showMore && (
            <button 
              onClick={openModal}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-md text-xs md:text-sm transition duration-300"
            >
              More
            </button>
          )}
        </div>
      </div>
      <BizSphereModal isOpen={isModalOpen} onClose={closeModal} />
    </section>
  );
};

export default Events;