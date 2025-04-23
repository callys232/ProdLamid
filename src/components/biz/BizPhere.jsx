"use client";

import { useState } from "react";
import Image from "next/image";
import BizSphereModal from "../BizSphereModal";
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
          <div className="border border-gray-700 rounded-md p-6 relative hover:border-orange-500 transition duration-300">
            <div className="absolute -top-6 left-6 bg-black border border-orange-500 rounded px-4 py-2 hover:bg-orange-500 hover:text-black transition duration-300">
              <h1 className="text-2xl font-bold text-orange-500">BIZPHERE</h1>
            </div>

            <div className="mt-10 space-y-6">
              <h2 className="text-2xl hover:text-orange-400 transition duration-300">
                The exclusive small business online networking{" "}
                <span className="text-orange-500">marketplace</span> where
                sellers meet buyers, and announce and exchange services and
                products.
              </h2>

              <div className="mt-8 flex justify-center">
                <Image
                  src="/biz-buy-sell-cards.png"
                  alt="Buy and Sell cards"
                  width={300}
                  height={250}
                  className="rounded transform hover:scale-105 transition duration-300"
                />
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="space-y-8">
            <div>
              <p className="mb-4 hover:text-gray-300 transition duration-300">
                The platform to secure cutting edge access to finance,
                suppliers, assets, land and more resources. It delivers brand
                visibility to buyers and sellers and protects merchants as they
                advertise and interact!{" "}
              </p>

              <p className="mb-6 hover:text-gray-300 transition duration-300">
                Our secured filters offer a clean online gateway that provides
                beneficial business intelligence. Join the community, take a
                tour and post your products and services, reviews, and comments!
              </p>

              <div className="flex justify-center md:justify-start">
                <button
                  onClick={openModal}
                  className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-6 rounded transform hover:scale-105 transition duration-300"
                >
                  Join the Community
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl text-center hover:text-orange-400 transition duration-300">
                ASK AN ADVISOR FOR DIAGNOSTICS
              </h3>

              <div className="flex justify-center">
                <Image
                  src="/help-note.png"
                  alt="We can help you"
                  width={240}
                  height={180}
                  className="rounded transform hover:scale-105 transition duration-300"
                />
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
