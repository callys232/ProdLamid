"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaRocket, FaHandshake, FaArrowRight } from "react-icons/fa";

const BizVisionCardsSection = () => {
  return (
    <div className="relative w-full bg-black text-white py-16 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/tree-background.jpg"
          alt="Technology Background"
          fill
          className="object-cover opacity-60 transition-opacity duration-300"
        />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black z-0 opacity-70"></div>

      {/* Cards Container */}
      <div className="relative z-10 container mx-auto px-4 flex flex-col md:flex-row justify-center md:justify-between items-stretch gap-10">
        {/* Lamid Tech Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="w-full md:w-5/12 flex"
        >
          <Link
            href="/portfolio"
            className="w-full"
            aria-label="View Lamid Tech portfolio"
          >
            <div className="card-glare relative border border-blue-500 rounded-md p-6 pt-6 bg-black bg-opacity-70 group transition duration-500 transform hover:scale-105 hover:-translate-y-1 hover:border-blue-700 hover:shadow-[0_0_25px_rgba(255,0,0,0.4)] cursor-pointer h-full min-h-[250px] flex flex-col justify-between overflow-hidden">
              {/* Title Banner */}
              <div className="mb-4 px-4 py-1 border border-blue-500 rounded bg-black group-hover:bg-blue-500 group-hover:text-black transition duration-300">
                <div className="flex items-center gap-2">
                  <FaHandshake className="text-blue-500 group-hover:text-black" />
                  <h3 className="text-blue-500 font-bold group-hover:text-black text-sm sm:text-base">
                    Lamid Tech
                  </h3>
                </div>
              </div>

              {/* Card Content */}
              <div className="z-10">
                <p className="text-sm sm:text-base text-blue-500 group-hover:text-white">
                  The exclusive small business online networking marketplace,
                  where sellers meet buyers, and announce and exchange services
                  and products.
                </p>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Vision 2030 Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="w-full md:w-5/12 flex"
        >
          <Link
            href="/portfolio"
            className="w-full"
            aria-label="View Vision 2030 portfolio"
          >
            <div className="card-glare relative border border-green-500 rounded-md p-6 pt-6 bg-black bg-opacity-70 group transition duration-500 transform hover:scale-105 hover:-translate-y-1 hover:border-green-700 hover:shadow-[0_0_25px_rgba(0,255,0,0.4)] cursor-pointer h-full min-h-[250px] flex flex-col overflow-hidden">
              {/* Title Banner */}
              <div className="mb-4 px-4 py-1 border border-green-500 rounded bg-black group-hover:bg-green-500 group-hover:text-black transition duration-300">
                <div className="flex items-center gap-2">
                  <FaRocket className="text-green-500 group-hover:text-black" />
                  <h3 className="text-green-500 font-bold group-hover:text-black text-sm sm:text-base">
                    VISION 2030
                  </h3>
                </div>
              </div>

              {/* Card Content */}
              <div className="z-10">
                <p className="text-sm sm:text-base text-green-500 text-left group-hover:text-white">
                  To produce 5,000 start-ups to deliver exceptional value and
                  dominate markets.
                </p>
              </div>
            </div>
          </Link>
        </motion.div>
      </div>

      {/* CTA Button */}
      <div className="relative z-10 mt-10 text-center px-4">
        <Link href="/portfolio">
          <div className="group bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 sm:px-8 rounded transition duration-300 inline-flex items-center gap-2 cursor-pointer text-sm sm:text-base">
            Our Portfolio
            <FaArrowRight className="transform group-hover:translate-x-1 transition duration-300" />
          </div>
        </Link>
      </div>

      {/* Glare Styles */}
      <style jsx>{`
        .card-glare::before {
          content: "";
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(
            120deg,
            rgba(255, 255, 255, 0.1) 0%,
            rgba(255, 255, 255, 0.3) 50%,
            rgba(255, 255, 255, 0.1) 100%
          );
          transform: rotate(25deg) translateX(-100%);
          transition: transform 0.8s ease-in-out;
          pointer-events: none;
          z-index: 1;
        }

        .card-glare:hover::before {
          transform: rotate(25deg) translateX(100%);
        }
      `}</style>
    </div>
  );
};

export default BizVisionCardsSection;
