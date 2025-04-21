import React from 'react'
import Image from 'next/image';
import Head from 'next/head';

const SDQA = () => {
  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      <Head>
        <title>Corporate Values</title>
        <meta name="description" content="Our corporate values and approach" />
      </Head>
      
      {/* Main Container */}
      <div className="container mx-auto px-4 py-8 relative">
        {/* Logo */}
        <div className="mb-8">
          <span className="text-red-600 font-bold text-xl">NT</span>
        </div>
        
        {/* Red Arc in Top Right */}
        <div className="absolute top-0 right-0 w-32 h-32">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path d="M100,0 Q100,100 0,100" fill="none" stroke="#7a0000" strokeWidth="8" />
          </svg>
        </div>
        
        {/* Call to Action Button */}
        <div className="flex justify-center mb-8">
          <button className="bg-gray-400 text-black px-6 py-2 rounded-full hover:bg-gray-300 transition">
            call to action
          </button>
        </div>
        
        {/* Image Navigation */}
        <div className="mb-12 p-4 mx-auto max-w-xl">
          <div className="flex justify-center space-x-2">
            <div className="bg-gray-400 rounded-lg w-16 h-12"></div>
            <div className="bg-gray-400 rounded-lg w-24 h-12"></div>
            <div className="bg-gray-400 rounded-lg w-16 h-12"></div>
          </div>
        </div>
        
        {/* Content Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left Column - Values */}
          <div className="space-y-12">
            {/* Value 1 */}
            <div className="flex">
              <div className="mr-4">
                <div className="relative w-16 h-16">
                  <Image 
                    src="/people-icon.png" 
                    alt="Gears icon"
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
              </div>
              <div>
                <h3 className="text-red-600 text-lg font-semibold mb-2">Our Value and Approach</h3>
                <p className="text-gray-400 text-sm">
                  Authenticity and reliability, publicity maturity.<br />
                  Sharing, engaging, building confidence and effective feedback.<br />
                  Establishing value addition and constructive work with solutions.
                </p>
              </div>
            </div>
            
            {/* Value 2 */}
            <div className="flex">
              <div className="mr-4">
                <div className="relative w-16 h-16">
                  <Image 
                    src="/target-icon.png" 
                    alt="Target icon"
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
              </div>
              <div>
                <h3 className="text-red-600 text-lg font-semibold mb-2">Our Pledge and Strategy</h3>
                <p className="text-gray-400 text-sm">
                  The job description, dynamics, as it takes care to target things <br />
                  that are within reason, in scope, in our control and genuine, never <br />
                  out of field, sphere, cloud, so they are cleared, come back for <br />
                  execution and completions.
                </p>
              </div>
            </div>
            
            {/* Value 3 */}
            <div className="flex">
              <div className="mr-4">
                <div className="relative w-16 h-16">
                  <Image 
                    src="/growth-icon.png" 
                    alt="Growth icon"
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
              </div>
              <div>
                <h3 className="text-red-600 text-lg font-semibold mb-2">Building an Enduring Great Company</h3>
                <p className="text-gray-400 text-sm">
                  A great company can be expressed by its performance, generated <br />
                  from the core values. Trust grows and thrives upon promises kept and <br />
                  consistency. Planning is about the careful extract of all public <br />
                  partnership. Our promises are concrete that if it's said, deliver it.
                </p>
              </div>
            </div>
          </div>
          
          {/* Right Column - Question Answer Image */}
          <div className="relative">
            {/* Circle Background */}
            <div className="absolute inset-0 w-full h-full">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#7a0000" strokeWidth="1" strokeDasharray="3,3" />
              </svg>
            </div>
            
            {/* Hands Image */}
            <div className="relative w-full h-64 md:h-80">
              <Image 
                src="/SD-hands-together.png" 
                alt="Hands together"
                layout="fill"
                objectFit="contain"
              />
            </div>
            
            {/* Questions/Answers Box */}
            <div className="absolute bottom-8 right-8 bg-gray-300 rounded-lg p-4 w-40">
              <p className="text-gray-600 text-xs">Questions</p>
              <p className="text-black font-bold text-lg">Answers</p>
            </div>
          </div>
        </div>
        
        {/* Red Curved Element Bottom Left */}
        <div className="absolute bottom-0 left-0 w-32 h-32 opacity-30">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <path d="M0,100 Q100,100 100,0" fill="none" stroke="#ff0000" strokeWidth="10" />
          </svg>
        </div>
      </div>
    </div>
  )
}

export default SDQA
