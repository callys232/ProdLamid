"use client"

import { useState } from 'react';
import Image from "next/image";
import BizSphereModal from '../BizSphereModal';
import Link from "next/link";

const BizPhere = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  return (
    <div className="bg-black text-white min-h-screen">

      <main className="container mx-auto px-4 py-8 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Section */}
          <div className="border border-gray-700 rounded-md p-6 relative">
            <div className="absolute -top-6 left-6 bg-black border border-orange-500 rounded px-4 py-2">
              <h1 className="text-2xl font-bold text-orange-500">BIZPHERE</h1>
            </div>
            
            <div className="mt-10 space-y-6">
              <h2 className="text-2xl">
                The exclusive small business online networking <span className="text-orange-500">marketplace</span> where sellers meet buyers, and announce and exchange services and products.
              </h2>
              
              <div className="mt-8 flex justify-center">
                <Image 
                  src="/biz-buy-sell-cards.png" 
                  alt="Buy and Sell cards" 
                  width={300} 
                  height={250}
                  className="rounded"
                />
              </div>
            </div>
          </div>
          
          {/* Right Section */}
          <div className="space-y-8">
            <div>
              <p className="mb-4">
                The platform to secure cutting edge information on finance, suppliers, assets, land and more resources. It sorts buyers and sellers and protects merchants as they advertise and interact!
              </p>
              
              <p className="mb-6">
                Our secured filters offer a clean online gateway that provide beneficial business intelligence. Join the community, take a tour and post your products and services, reviews and comments!
              </p>
              
              <div className="flex justify-center md:justify-start">
                <button onClick={openModal} className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-6 rounded">
                  Join the Community
                </button>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-xl text-center">ASK AN ADVISOR FOR DIAGNOSTICS</h3>
              
              <div className="flex justify-center">
                <Image 
                  src="/help-note.png" 
                  alt="We can help you" 
                  width={240} 
                  height={180}
                  className="rounded"
                />
              </div>
              
              <div className="flex flex-col items-center space-y-4">
                <button onClick={openModal} className="bg-black hover:bg-gray-900 text-white font-bold py-3 px-6 rounded border border-white w-full">
                  CONSULT AN ADVISOR
                </button>
                
                <div className="flex items-center space-x-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <a href="mailto:crm@lamidconsulting.com" className="text-red-600 hover:underline">
                    crm@lamidconsulting.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <BizSphereModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};

export default BizPhere;
