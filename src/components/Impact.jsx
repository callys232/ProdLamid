import React from 'react'
import Image from 'next/image';
import Link from 'next/link';
import { FaLeaf, FaHospital, FaLightbulb, FaUsers } from 'react-icons/fa';

const Impact = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-300 mb-16">Impact</h1>
        
        <div className="space-y-20">
          {/* Section 1: Job and Wealth Creation */}
          <section className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/4 flex-shrink-0">
              <div className="relative h-48 w-full rounded-lg overflow-hidden">
                <Image 
                src="/farmers.png" 
                  alt="Farmers working together" 
                  layout="fill" 
                  objectFit="cover"
                  className="rounded-lg"
                />
              </div>
            </div>
            
            <div className="w-full md:w-3/4">
              <div className="flex items-start gap-4 mb-3">
                <div className="mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
                  </svg>
                </div>
                <div className="bg-transparent border border-green-500 text-green-400 px-4 py-2 rounded-md flex-grow">
                  <h2 className="text-xl font-medium">Job and Wealth Creation for Social Cohesion & Economic Recovery</h2>
                </div>
              </div>
              
              <p className="text-gray-400 mb-4 pl-12">
                We re-positioned cooperatives to re-set globalization; starting from few groups to communities and nations. By experience, we see job and wealth creation with cooperatives as ...
              </p>
              
              <p className="text-yellow-500 hover:underline cursor-pointer pl-12">
                Learn how this unique opportunity transformed over 5000 cooperatives.
              </p>
            </div>
          </section>
          
          {/* Section 2: Healthcare Partnerships */}
          <section className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/4 flex-shrink-0">
              <div className="relative h-48 w-full rounded-lg overflow-hidden">
                <Image 
                src="/hospital.png" 
                  alt="Hospital room" 
                  layout="fill" 
                  objectFit="cover"
                  className="rounded-lg"
                />
              </div>
            </div>
            
            <div className="w-full md:w-3/4">
              <div className="flex items-start gap-4 mb-3">
                <div className="mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7 2a1 1 0 00-.707 1.707L7 4.414v3.758a1 1 0 01-.293.707l-4 4C.817 14.769 2.156 18 4.828 18h10.343c2.673 0 4.012-3.231 2.122-5.121l-4-4A1 1 0 0113 8.172V4.414l.707-.707A1 1 0 0013 2H7zm2 6.172V4h2v4.172a3 3 0 00.879 2.12l1.168 1.168a4 4 0 01-8.094 0l1.168-1.168A3 3 0 009 8.172z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="bg-transparent border border-green-500 text-green-400 px-4 py-2 rounded-md flex-grow">
                  <h2 className="text-xl font-medium">Building Communities on Managed Healthcare Partnerships</h2>
                </div>
              </div>
              
              <p className="text-gray-400 pl-12">
                We improved maternal care, child survival and primary healthcare delivery and achieved organizational and financial sustainability among five communities' partnerships-for-health, after USAID's grant withdrawal by Johns Hopkins' University, Centre for Educational Development and Population Activities (CEDPA) and BASICS/Initiatives Virginia.
              </p>
            </div>
          </section>
          
          {/* Section 3: Climate Change */}
          <section className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/5 flex-shrink-0">
              <div className="flex justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13 7H7v6h6V7z" />
                  <path fillRule="evenodd" d="M7 2a1 1 0 012 0v1h2V2a1 1 0 112 0v1h2a2 2 0 012 2v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v2a2 2 0 01-2 2h-2v1a1 1 0 11-2 0v-1H9v1a1 1 0 11-2 0v-1H5a2 2 0 01-2-2v-2H2a1 1 0 110-2h1V9H2a1 1 0 010-2h1V5a2 2 0 012-2h2V2zM5 5h10v10H5V5z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            
            <div className="w-full md:w-2/3">
              <div className="mb-3">
                <div className="bg-transparent border border-green-500 text-green-400 px-4 py-2 rounded-md">
                  <h2 className="text-xl font-medium">Combating Climate Change with Renewable Energy</h2>
                </div>
              </div>
              
              <p className="text-gray-400 mb-4">
                By building women and youth-led entrepreneurial services clusters around Shell's renewable energy assets, we achieved equalization, mediation and peace making in the volatile, conflict-prone Niger Delta communities with environmental remediation and tactical stakeholder engagements.
              </p>
              
              <p className="text-gray-400 hover:underline cursor-pointer">
                Read more.
              </p>
            </div>
            
            {/* <div className="w-full md:w-1/4 flex justify-end">
              <div className="relative h-36 w-36 rounded-full overflow-hidden">
                <Image 
                src="/lightbulb.png" 
                  alt="Lightbulb with green plant inside" 
                  layout="fill" 
                  objectFit="cover"
                  className="rounded-full"
                />
              </div>
            </div> */}
            <div className="w-full md:w-1/4 order-3 md:order-3">
              <div className="relative h-64 w-full rounded-lg overflow-hidden">
                <Image 
                  src="/lightbulb.png" 
                  alt="Lightbulb with green plant inside" 
                  layout="fill" 
                  objectFit="cover"
                />
              </div>
            </div>
          </section>
          
          {/* Section 4: Digital Divide */}
          <section className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/5 flex-shrink-0">
              <div className="flex justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
              </div>
            </div>
            
            <div className="w-full md:w-1/2">
              <div className="mb-3">
                <div className="bg-transparent border border-green-500 text-green-400 px-4 py-2 rounded-md">
                  <h2 className="text-xl font-medium">Bridging the Digital and Generational Divide for Global Partnerships.</h2>
                </div>
              </div>
              
              <p className="text-gray-400 mb-6">
                We addressed youth unemployment and bridged the wealth creation gap by: supporting startups, addressing youth unemployability, generating high-growth jobs, and retained local talents through ...
              </p>
              
              <div className="flex items-center">
                <span className="text-gray-400 text-sm">READ MORE</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            
            <div className="w-full md:w-1/4 flex justify-end">
              <div className="relative h-64 w-full rounded-lg overflow-hidden">
                <Image 
                src="/helping-hand.png" 
                  alt="Person helping another climb up" 
                  layout="fill" 
                  objectFit="cover"
                  className="rounded-lg"
                />
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

export default Impact
