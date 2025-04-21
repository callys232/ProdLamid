import React from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { FaArrowRight } from 'react-icons/fa';

const HcdBp = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Head>
        <title>LAMID Business Profile</title>
        <meta name="description" content="LAMID Business Profile" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-8 md:py-12">
        {/* Business Profile Header */}
        <header className="mb-8 md:mb-12">
          <h1 className="text-lg uppercase tracking-wider mb-6 md:mb-8">BUSINESS PROFILE</h1>
          
          {/* Business Guide Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {/* Card 1 */}
            <div className="relative border-l border-r border-yellow-600">
              <div className="px-4 py-2">
                <div className="mb-4 rounded overflow-hidden">
                  <Image 
                    src="/hcd-tie-dye.png" 
                    alt="Tie Dye Pattern" 
                    width={200} 
                    height={150}
                    className="w-full"
                  />
                </div>
                <p className="font-semibold mb-1">Business Guide</p>
                <p className="text-sm text-gray-400">Summary</p>
              </div>
            </div>
            
            {/* Card 2 */}
            <div className="relative border-l border-r border-yellow-600">
              <div className="px-4 py-2">
                <div className="mb-4 rounded overflow-hidden">
                  <Image 
                    src="/hcd-shoe-making.png" 
                    alt="Business Meeting" 
                    width={200} 
                    height={150}
                    className="w-full" 
                  />
                </div>
                <p className="font-semibold mb-1">Business Guide</p>
                <p className="text-sm text-gray-400">Strategy</p>
              </div>
            </div>
            
            {/* Card 3 */}
            <div className="relative border-l border-r border-yellow-600">
              <div className="px-4 py-2">
                <div className="mb-4 rounded overflow-hidden">
                  <Image 
                    src="/hcd-meeting.png" 
                    alt="Training Room" 
                    width={200} 
                    height={150}
                    className="w-full" 
                  />
                </div>
                <p className="font-semibold mb-1">Business Guide</p>
                <p className="text-sm text-gray-400">Summary</p>
              </div>
            </div>
            
            {/* Card 4 */}
            <div className="relative border-l border-r border-yellow-600">
              <div className="px-4 py-2">
                <div className="flex flex-col h-full justify-between">
                  <div>
                    <p className="text-orange-500 mb-1">International management training</p>
                    <p className="text-green-500 mb-4">Leadership development training</p>
                  </div>
                  <div>
                    <p className="font-semibold mb-1">Business Guide</p>
                    <p className="text-sm text-gray-400">Summary</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>
        
        {/* Guides Section with Illustration */}
        <section className="mb-8 md:mb-12">
          <div className="flex flex-col items-center">
            <button className="bg-transparent border border-orange-500 text-orange-500 rounded px-6 py-2 mb-6 hover:bg-orange-500 hover:text-white transition duration-300">
              SEE GUIDES
            </button>
            
            <div className="relative w-[250px] h-[250px] md:w-[320px] md:h-[320px]">
              <Image
                src="/hcd-team-illustration.png"
                alt="Team Working with Growth Chart"
                layout="fill"
                objectFit="contain"
                className="object-contain"
                priority
              />
            </div>
          </div>
        </section>
        
        {/* Human Capital Development Section */}
        <section className="mb-8 md:mb-12 flex justify-center">
          <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg max-w-md w-full sm:w-[400px] p-6">
            <div className="flex mb-4">
              <div className="w-12 h-12 mr-4">
                <Image
                  src="/hcd-lamid-logo.png"
                  alt="LAMID Logo"
                  width={48}
                  height={48}
                />
              </div>
              <div>
                <p className="text-sm text-gray-400">HUMAN Capital Development</p>
              </div>
            </div>
            
            <p className="text-sm mb-6">
              "Use cutting-edge tools to secure top-tier talent for permanent, temporary, and contract roles."
            </p>
            
            <button className="bg-red-900 rounded-full p-3 hover:bg-red-800 transition duration-300">
              <FaArrowRight className="text-white" />
            </button>
          </div>
        </section>
        
        {/* Footer */}
        <footer className="text-right">
          <p className="text-lg">LAMID TECHNOLOGY</p>
        </footer>
      </main>
    </div>
  )
}

export default HcdBp
