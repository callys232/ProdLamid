"use client"

import { useState } from 'react';
import Image from 'next/image';

export default function BusinessPrototypes() {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const prototypes = [
    [
      {
        name: "AFRICAN STAR FRUIT",
        image: "/daycare.png",
        description: ""
      },
      {
        name: "Daycare",
        image: "/daycare.png",
        description: "This business will offer top-quality day care services for busy parents seeking reliable childcare."
      },
      {
        name: "Interior Decoration",
        image: "/interior-decoration.png",
        description: "This business will offer design, redesign, renovation, and decoration of homes, offices, and other spaces."
      },
      {
        name: "Travel Agency",
        image: "/travel-agency.png",
        description: "Provides ticket reservations, visa procurement service, packaging and customer travel experiences, etc."
      }
    ],
    [
      {
        name: "Mobile Toilet Services",
        image: "/mobile-toilet.png",
        description: "A clean fleet properly owned by the city and placed flexibly in the necessary locations."
      },
      {
        name: "Vehicle Repair",
        image: "/vehicle-repair.png",
        description: "This document provides information about a variety of maintenance and mechanical repairs for all types of vehicles."
      },
      {
        name: "Flowering",
        image: "/flowering.png",
        description: "Roses and floral arrangements creating meaningful floral works along with celebrity endorsements and unique designs."
      },
      {
        name: "DIGITAL SOLUTIONS",
        image: "/digital-solutions.png",
        description: ""
      }
    ]
  ];
  
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="flex justify-between items-center px-6 py-4">
        <button className="border border-white px-4 py-2 text-sm">BUSINESS PROTOTYPES</button>
        <button className="border border-white px-4 py-2 text-sm flex items-center">
          <span className="mr-2">CATEGORIES</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 6H20M4 12H20M4 18H20" stroke="white" strokeWidth="2"/>
          </svg>
        </button>
      </div>
      
      {/* Main grid */}
      <div className="px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {prototypes[currentSlide].map((prototype, index) => (
            <div key={index} className="flex flex-col border-l border-t border-r border-white">
              {/* Image container - fixed height */}
              <div className="relative h-48 w-full overflow-hidden bg-black">
                <Image
                  src={prototype.image}
                  alt={prototype.name}
                  fill
                  style={{ objectFit: 'contain' }}
                  className="p-2"
                />
              </div>
              
              {/* Content */}
              <div className="p-4 border-t border-white">
                <div className="mb-2">
                  <span className="text-sm text-gray-400">NAME:</span>
                  <h3 className="font-bold">{prototype.name}</h3>
                </div>
                {prototype.description && (
                  <p className="text-sm mb-4">{prototype.description}</p>
                )}
                <button className="bg-black border border-white text-white text-sm px-3 py-1">
                  BUY NOW
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Pagination dots */}
      <div className="flex justify-center items-center gap-2 mt-6">
        {prototypes.map((_, index) => (
          <button 
            key={index} 
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full ${currentSlide === index ? 'bg-white' : 'bg-gray-600'}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}