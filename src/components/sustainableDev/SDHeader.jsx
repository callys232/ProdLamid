import React from 'react';
import Image from 'next/image';
import Head from 'next/head';

const SDHeader = () => {
  return (
    <div className="relative min-h-screen bg-black text-white pt-12 md:pt-24">
      <Head>
        <title>Sustainable Development</title>
        <meta name="description" content="Growing groups to world-class communities with sustainable development" />
      </Head>
      
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/LD4.jpg" 
          alt="Forest background" 
          layout="fill" 
          objectFit="cover" 
          className="opacity-40"
        />
      </div>
      
      <div className="relative z-10 container mx-auto px-4 md:px-8 flex flex-col min-h-screen">
        {/* Header with logo and title */}
        <div className="flex flex-col sm:flex-row items-center mt-4 sm:mt-8">
          <div className="w-24 h-24 sm:w-32 sm:h-32 mb-4 sm:mb-0 sm:mr-4 relative">
            <Image 
              src="/sustainable-icon.png" 
              alt="Globe in hands" 
              width={128}
              height={128}
              className=""
            />
          </div>
          <div className="text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-500">Sustainable Development</h1>
            <p className="text-xs sm:text-sm text-gray-300">Growing groups to world-class communities with sustainable development</p>
          </div>
        </div>
        
        {/* Main content in middle of screen */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center my-8 md:my-auto">
          <div className="order-2 lg:order-1">
            <p className="text-white text-sm sm:text-base md:text-lg text-center lg:text-left">
              We achieved social inclusion, managed healthcare partnerships, gender equality, youth and women's
              empowerment with digitalization, as crucial means to equity, diversity, governance and peace-building in
              accelerating the Sustainable Development Goals
            </p>
            
            {/* Learn More Button */}
            <div className="flex justify-center lg:justify-start">
              <button className="bg-green-500 text-white py-2 px-6 rounded mt-4 sm:mt-6 uppercase text-sm font-bold">
                Learn More
              </button>
            </div>
          </div>
          
          {/* Earth Image */}
          <div className="flex justify-center lg:justify-end order-1 lg:order-2 mb-6 lg:mb-0">
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96">
              <Image 
                src="/SD-hands-holding-earth.png" 
                alt="Hands holding Earth" 
                layout="fill" 
                objectFit="cover" 
                className="rounded-lg"
              />
            </div>
          </div>
        </div>
        
        {/* Some spacing at bottom */}
        <div className="mb-8 md:mb-16"></div>
      </div>
    </div>
  );
};

export default SDHeader;