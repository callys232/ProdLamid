"use client"

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const BizPT = () => {
    const [searchTerm, setSearchTerm] = useState('');
  
    const businessPrototypes = [
      {
        id: 1,
        name: "Fish Farming",
        category: "AGRIC",
        image: "/SD-people-working.png"
      },
      {
        id: 2,
        name: "Adire (Batik)",
        category: "TEXTILE",
        image: "/SD-people-working.png"
      },
      {
        id: 3,
        name: "Tie & Dye",
        category: "",
        image: "/SD-classroom.png",
        featured: true
      },
      {
        id: 4,
        name: "Barber",
        category: "SERVICE",
        image: "/SD-classroom.png"
      },
      {
        id: 5,
        name: "Distribution",
        category: "LOGISTICS",
        image: "/SD-classroom.png"
      }
    ];
  
    return (
      <div className="min-h-screen bg-black text-white p-4">
        <div className="max-w-6xl mx-auto">
          {/* Header with red button */}
          <div className="flex justify-center mb-6">
            <div className="bg-[#C12129] rounded-md px-6 py-2 text-white text-center font-semibold">
              READY TO ADOPT BIZ PROTO-TYPES
            </div>
          </div>
          
          {/* Main content card */}
          <div className="bg-[#111] rounded-xl p-4 md:p-6 border border-gray-800">
            {/* Search bar */}
            <div className="flex mb-6 max-w-lg mx-auto">
              <button className="bg-[#C12129] text-white px-4 py-2 rounded-l-md flex items-center">
                <span className="mr-2">×</span>
                <span>Filter</span>
              </button>
              <input
                type="text"
                placeholder="Search..."
                className="flex-1 px-4 py-2 bg-gray-200 text-black rounded-r-md focus:outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Business prototypes grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6 relative">
              {businessPrototypes.map((prototype) => (
                <div 
                  key={prototype.id} 
                  className={`${prototype.featured ? 'sm:col-span-1 md:col-span-1 md:row-span-2 lg:col-span-1 lg:row-span-1 lg:col-start-3 lg:row-start-1' : ''} 
                    bg-black rounded-lg border border-gray-800 overflow-hidden flex flex-col`}
                >
                  <div className="relative h-32 md:h-40">
                    <Image
                      src={prototype.image}
                      alt={prototype.name}
                      fill
                      style={{ objectFit: 'cover' }}
                      className="rounded-t-lg"
                    />
                  </div>
                  
                  <div className="p-2 flex flex-col flex-grow">
                    <div className="text-xs text-gray-400">
                      <span>NAME: {prototype.name}</span>
                      {prototype.category && (
                        <div>CATEGORY: {prototype.category}</div>
                      )}
                    </div>
                    
                    <div className="mt-auto flex space-x-2 pt-2">
                      <button className="bg-[#C12129] text-white text-xs rounded px-2 py-1 flex-1">
                        ADOPT
                      </button>
                      <button className="bg-transparent border border-[#C12129] text-white text-xs rounded px-2 py-1 flex-1">
                        DETAILS
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Tagline */}
            <div className="text-center text-white/90 mb-4 italic">
              Proven to guarantee success and earn investors' trust
            </div>
          </div>
          
          {/* Megaphone section */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mt-8 mb-6">
            <div className="w-24 h-24 md:w-32 md:h-32 relative flex-shrink-0">
              <Image
                src="/megaphone-icon.png"
                alt="Megaphone"
                fill
                style={{ objectFit: 'contain' }}
              />
            </div>
            
            <div>
              <p className="text-white text-base md:text-lg">
                To obtain an invitation to our much sought-after business clinic, 
                and get a chance to win a free diagnostic care, 
                <Link href="#" className="text-[#C12129] hover:underline ml-1">Click here</Link>.
              </p>
            </div>
          </div>
          
          {/* Counter */}
          <div className="mt-8 text-[#C12129] text-2xl md:text-3xl font-bold">
            3000+ SMES CREATED
          </div>
        </div>
      </div>
    );
}

export default BizPT
