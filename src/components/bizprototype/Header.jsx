"use client"

import Head from 'next/head';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const Header = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative min-h-screen bg-black">
      {/* Background with overlay */}
      <div className="absolute inset-0 overflow-hidden">
        <Image 
          src="/LD2.jpg" 
          alt="Background audience" 
          fill
          style={{ objectFit: 'cover' }}
          priority
          className="opacity-60"
        />
      </div>

      {/* Main content */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8 text-white">
        <div className="flex flex-col md:flex-row items-center justify-center max-w-6xl w-full mx-auto gap-6 md:gap-8 lg:gap-16">
          
          {/* Light bulb image in dark container */}
          <div className="relative w-full max-w-xs sm:max-w-sm md:w-2/5 mb-6 md:mb-0">
            <div className="p-2 sm:p-4 md:p-8 flex items-center justify-center">
              {mounted && (
                <Image 
                  src="/bizp-lightbulb.png" 
                  alt="Light bulb" 
                  width={180}
                  height={180}
                  sizes="(max-width: 640px) 150px, (max-width: 768px) 180px, 250px"
                  priority
                  className="drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] w-auto h-auto max-w-full"
                />
              )}
            </div>
          </div>
          
          {/* Text content */}
          <div className="text-center md:text-left w-full md:w-3/5">
            <h1 className="font-bold tracking-wider">
              <span className="block mb-1 sm:mb-2 text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-8xl text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">ADVICE</span>
              <span className="block mb-1 sm:mb-2 text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-8xl text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">INNOVATION</span>
              <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-8xl text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">FUNDING.</span>
            </h1>
          </div>
        </div>
      
        {/* Red paragraph (now inside main with proper spacing) */}
        <div className="w-full mt-4 sm:mt-6 md:mt-8 lg:mt-12">
          <p className="text-[#C12129] text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium text-center mx-auto max-w-4xl px-4">
            You do not have to re-invent the wheel, see our proven successful transformations.
          </p>
        </div>
      </main>
    </div>
  )
}

export default Header