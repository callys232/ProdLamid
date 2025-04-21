import React from "react";
import Image from "next/image";
import Link from "next/link";

const BusinessGrowthSection = () => {
  const networkItems = [
    {
      id: 1,
      title: 'Job Scoping',
      image: '/biz-event-1.png',
    },
    {
      id: 2,
      title: 'Reskilling',
      image: '/biz-event-1.png',
    },
    {
      id: 3,
      title: 'About to Disappear',
      image: '/biz-event-1.png',
    },
    {
      id: 4,
      title: 'Event Name',
      image: '/biz-event-1.png',
    },
  ];

  return (
    <div className="relative w-full bg-black text-white py-8 px-4 md:px-8">
      {/* Background overlay with opacity */}
      <div className="absolute inset-0 bg-black opacity-80 z-0">
        <Image 
          src="/LD2.jpg" 
          alt="Background"
          layout="fill"
          objectFit="cover"
          className="opacity-20"
        />
      </div>
      
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Top section with growth chart and text */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-6">
          {/* Left - Business Growth Chart */}
          <div className="w-full md:w-1/3">
            <div className="relative h-44 w-full">
              <Image 
                src="/biz-business-growth-chart.png" 
                alt="Business Growth Chart"
                layout="fill"
                objectFit="contain"
                className="rounded"
              />
            </div>
          </div>
          
          {/* Right - Text Content */}
          <div className="w-full md:w-2/3">
            <p className="text-lg mb-6">
              Network as you get the <span className="font-bold underline">expertise</span> to ignite growth and massive results
            </p>
            
            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-gray-100 text-black py-2 px-6 rounded hover:bg-gray-200">
               
              </button>
              <button className="bg-gray-100 text-black py-2 px-6 rounded hover:bg-gray-200">
                
              </button>
            </div>
          </div>
        </div>
        
        {/* EVENTS heading */}
        <div className="text-center mb-6">
          <h2 className="text-lg font-bold">EVENTS</h2>
        </div>
        
        {/* Network items grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {networkItems.map((item) => (
            <div key={item.id} className="flex flex-col items-center">
              <div className="relative h-24 w-24 mb-2 overflow-hidden rounded-full border-2 border-white">
                <Image 
                  src={item.image} 
                  alt={item.title}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <p className="text-center">{item.title}</p>
            </div>
          ))}
        </div>
        
        {/* Bottom tagline */}
        <div className="text-center mt-4">
          <p className="text-sm md:text-base">
            Adopt a global mentality, act small but think big: deploy the strategies and knowledge (not resources) of large organizations to steadily grow.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BusinessGrowthSection;
