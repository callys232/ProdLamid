"use client"

import Head from 'next/head';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const EventHeader = () => {

    const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);


  return (
    <div className="relative min-h-screen bg-black">
      <Head>
        <title>Innovate | Build | Grow</title>
        <meta name="description" content="Innovation landing page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Background with overlay */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-blue-900/30">
          {mounted && (
            <Image 
              src="/LD2.jpg" 
              alt="Background audience" 
              layout="fill"
              objectFit="cover"
              priority
              className="mix-blend-overlay opacity-80"
            />
          )}
        </div>
        
        {/* Animated dot pattern overlay */}
        {/* <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, rgba(0, 150, 255, 0.1) 1px, transparent 1px), radial-gradient(circle, rgba(255, 120, 50, 0.1) 1px, transparent 1px)',
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0, 10px 10px'
        }}></div> */}
      </div>

      {/* Main content */}
      <main className="relative z-10 flex items-center justify-center min-h-screen px-4 py-20 text-white">
        <div className="flex flex-col md:flex-row items-center justify-center max-w-6xl mx-auto gap-8 md:gap-16">
          
          {/* Light bulb image in dark container */}
          <div className="relative bg-black rounded-lg shadow-2xl1 overflow-hidden1 w-full max-w-sm aspect-square1 md:w-2/5">
            <div className="p-8 flex items-center justify-center h-full">
              {mounted && (
                <Image 
                  src="/event_lightbulb.png" 
                  alt="Light bulb" 
                  width={250}
                  height={250}
                  priority
                  className="drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                />
              )}
            </div>
            
            {/* Small glowing icon */}
            {/* <div className="absolute bottom-5 left-5 w-10 h-10 rounded-full bg-orange-500 p-2 animate-pulse">
              {mounted && (
                <Image 
                  src="/images/idea-icon.png" 
                  alt="Idea icon" 
                  width={24} 
                  height={24}
                  className="drop-shadow-[0_0_3px_rgba(255,165,0,0.8)]"
                />
              )}
            </div> */}
          </div>
          
          {/* Text content */}
          <div className="text-center md:text-left w-full md:w-3/5">
            <h1 className="text-6xl md:text-8xl font-bold tracking-wider">
              <span className="block mb-2 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">INNOVATE</span>
              <span className="block mb-2 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">BUILD</span>
              <span className="block text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">GROW</span>
            </h1>
          </div>
        </div>
      </main>
    </div>
  )
}

export default EventHeader
