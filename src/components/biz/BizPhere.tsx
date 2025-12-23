"use client";

import { useState } from "react";
import Image from "next/image";
import BizSphereModal from "../BizSphereModal";

const BizPhere: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className="bg-black text-white py-10">
      <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left */}
        <div className="relative border border-gray-700 rounded-md p-6 hover:border-orange-500 transition">
          <div className="absolute -top-5 left-5 bg-black border border-orange-500 rounded px-3 py-1">
            <h1 className="text-xl font-bold text-orange-500">BIZPHERE</h1>
          </div>
          <h2 className="mt-6 text-xl hover:text-orange-400 transition">
            The exclusive small business online networking{" "}
            <span className="text-orange-500">marketplace</span> where sellers
            meet buyers.
          </h2>
          <div className="mt-6 flex justify-center">
            <Image
              src="/biz-buy-sell-cards.png"
              alt="Buy and Sell cards"
              width={260}
              height={200}
              className="rounded hover:scale-105 transition-transform"
            />
          </div>
        </div>

        {/* Right */}
        <div className="space-y-6">
          <p className="hover:text-gray-300 transition">
            The platform to secure cutting edge access to finance, suppliers,
            assets, land and more resources.
          </p>
          <p className="hover:text-gray-300 transition">
            Our secured filters offer a clean online gateway that provides
            beneficial business intelligence.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-5 rounded hover:scale-105 transition-transform"
          >
            Join the Community
          </button>
          <div className="space-y-3">
            <h3 className="text-lg text-center hover:text-orange-400 transition">
              ASK AN ADVISOR FOR DIAGNOSTICS
            </h3>
            <div className="flex justify-center">
              <Image
                src="/help-note.png"
                alt="We can help you"
                width={200}
                height={150}
                className="rounded hover:scale-105 transition-transform"
              />
            </div>
          </div>
        </div>
      </div>
      <BizSphereModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
};

export default BizPhere;
