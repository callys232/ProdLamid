import React from 'react';
import Image from 'next/image';
import Head from 'next/head';

const SDBusinessPrototype = () => {
  return (
    <div className="bg-black text-white min-h-screen">
      <Head>
        <title>Job and Wealth Creation</title>
        <meta name="description" content="Sustainable Development job and wealth creation" />
      </Head>
      
      <div className="container mx-auto px-4 py-8">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Left - Placeholder Image */}
          <div className="bg-gray-300 rounded-3xl h-72 md:h-96"></div>
          
          {/* Right - Text Content */}
          <div className="space-y-8">
            <div>
              <h1 className="text-2xl font-bold text-red-500 mb-2">Job and Wealth Creation</h1>
              <p className="text-sm text-gray-300">
                <span className="text-red-500">Sustainable Development</span> is dedicated to bridging the wealth creation 
                gap utilizing the principles of green economy for sustainable capital, while building 
                capacity for high value and creativity for sustainable livelihood. We leverage 
                global partnerships aimed at sustainability, ensuring resource and financial 
                stability.
              </p>
            </div>
            
            <div>
              <p className="text-red-500 text-sm mb-2">CUSTOMIZED WEALTH CREATION</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-300">
                Members are equipped with skills as the first step in preparing and training 
                to move them to sustainable business models, digital access, and financing, 
                as well as access to national and global markets, collaborative partnerships, and 
                a micro fund that can strengthen entrepreneurship. <span className="text-red-500">CALEB THIS IS TO 
                BE CUSTOMIZED BUT PUT SOMETHING HERE SO ANYONE CHECKING WILL SEE 
                SOMETHING.</span>
              </p>
            </div>
            
            {/* Buttons */}
            <div className="flex flex-wrap gap-2">
              <button className="bg-gray-700 text-white px-4 py-2 text-sm rounded hover:bg-gray-600 transition">OUR PARTNERS</button>
              <button className="bg-gray-700 text-white px-4 py-2 text-sm rounded hover:bg-gray-600 transition">OUR ACTIVITIES</button>
              <a href="#" className="text-red-500 text-sm hover:underline flex items-center">
                READ MORE <span className="ml-1">→</span>
              </a>
            </div>
            
            <div>
              <p className="text-red-500 text-sm mb-2">CALEB THIS PART NEEDS TO BE UNDER SUSTAINABLE DEVELOPMENT</p>
              <p className="text-sm text-gray-300">
                We provided transitional threshold skills training securely dispersed wealth to 
                ensure there was optimal coverage. That focus promotes solid communities, 
                wealth distribution, and quality-centered progressive and structured long-term 
                objectives. Our comprehensive focus on key vocational capacity recognizes 
                refugee internalizations is OKAY but about places not moving. It recognizes 
                places hiring particular skills is normal mix and regionally as REFUGEES.
              </p>
            </div>
          </div>
        </div>
        
        {/* Business Prototype Section */}
        <div className="mb-8">
          <div className="flex items-center mb-6">
            <div className="relative w-8 h-8 mr-2">
              <Image 
                src="/biz-icon.png" 
                alt="Biz icon"
                width={32}
                height={32}
              />
            </div>
            <h2 className="text-xl font-semibold">Business Prototype</h2>
          </div>
          
          {/* Grid of Business Prototypes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {/* Prototype 1 */}
            <div className="border border-red-900 rounded-md p-2">
              <div className="relative w-full h-36 mb-3">
                <Image 
                  src="/SD-bags-stacked.png" 
                  alt="Stacked bags"
                  layout="fill"
                  objectFit="cover"
                  className="rounded"
                />
              </div>
              <div className="text-sm">
                <p className="font-semibold">Business Prototype</p>
                <p className="text-gray-400">Summary</p>
              </div>
            </div>
            
            {/* Prototype 2 */}
            <div className="border border-red-900 rounded-md p-2">
              <div className="relative w-full h-36 mb-3">
                <Image 
                  src="/SD-people-working.png" 
                  alt="People working together"
                  layout="fill"
                  objectFit="cover"
                  className="rounded"
                />
              </div>
              <div className="text-sm">
                <p className="font-semibold">Business Prototype</p>
                <p className="text-gray-400">Summary</p>
              </div>
            </div>
            
            {/* Prototype 3 */}
            <div className="border border-red-900 rounded-md p-2">
              <div className="relative w-full h-36 mb-3">
                <Image 
                  src="/SD-classroom.png" 
                  alt="Classroom training"
                  layout="fill"
                  objectFit="cover"
                  className="rounded"
                />
              </div>
              <div className="text-sm">
                <p className="font-semibold">Business Prototype</p>
                <p className="text-gray-400">Summary</p>
              </div>
            </div>
            
            {/* Prototype 4 */}
            <div className="border border-red-900 rounded-md p-2">
              <div className="relative w-full h-36 mb-3">
                <Image 
                  src="/SD-phone-icon.png" 
                  alt="Phone communication"
                  layout="fill"
                  objectFit="cover"
                  className="rounded"
                />
              </div>
              <div className="text-sm">
                <p className="font-semibold">Business Prototype</p>
                <p className="text-gray-400">Summary</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* World Map Background (Subtle) */}
        <div className="absolute bottom-0 right-0 opacity-20 pointer-events-none">
          <div className="relative w-64 h-64">
            <Image 
              src="/SD-world-map.png" 
              alt="World map"
              layout="fill"
              objectFit="contain"
            />
          </div>
        </div>
        
        {/* See All Button */}
        <div className="flex justify-center mt-8">
          <button className="bg-gray-800 text-white px-10 py-2 rounded hover:bg-gray-700 transition">
            SEE ALL PAGES
          </button>
        </div>
      </div>
    </div>
  )
}

export default SDBusinessPrototype
