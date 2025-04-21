"use client";
import Head from "next/head";
import Image from "next/image";
import { useState } from "react";

const Testimonial = () => {
  const [videoPlaying, setVideoPlaying] = useState(false);

  const clients = [
    { name: "Lafarge", logo: "/lafarge-logo.png" },
    { name: "Access", logo: "/diamond-logo.png" },
    { name: "Lagos State Government", logo: "/circular-logo.png" },
    { name: "Pepsi", logo: "/pepsi-logo.png" },
    { name: "Champion", logo: "/champion-logo.png" },
    { name: "TotalEnergies", logo: "/total-energies-logo.png" },
  ];
  return (
    <div className="bg-black text-white">
      {/* Testimonials section */}
      <div className="bg-black py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-2/5">
              <div
                className="border-2 border-blue-600 aspect-video relative cursor-pointer"
                onClick={() => setVideoPlaying(!videoPlaying)}
              >
                {!videoPlaying ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                      <div className="w-0 h-0 border-t-8 border-t-transparent border-l-16 border-l-white border-b-8 border-b-transparent ml-1"></div>
                    </div>
                  </div>
                ) : (
                  <video
                    className="w-full h-full"
                    controls
                    autoPlay
                    src="/videos/demo-video.mp4"
                  />
                )}
              </div>
            </div>

            <div className="w-full md:w-3/5">
              <h2 className="text-blue-600 text-2xl mb-6">Testimonials</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-900 p-4 rounded">
                  <p className="text-sm">
                    “The programs helped in the effective management and
                    motivation of staff to enable them leverage their
                    intellectual capability, to transform business challenges
                    into opportunities.”
                  </p>
                </div>
                <div className="bg-gray-900 p-4 rounded">
                  <p className="text-sm">
                    “LAMID’s training program enhanced the quality of the
                    negotiation processes with respective Trade Unions, and led
                    to significant improvements in industrial relations, between
                    their officials and management of the organization.”
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Clients section */}
      <div className="py-8">
        <div className="container mx-auto px-4">
          <h3 className="text-gray-400 text-sm mb-6">
            others we've worked for:
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {clients.map((client, index) => (
              <div key={index} className="flex items-center justify-center p-2">
                <div className="w-full h-16 relative">
                  <Image
                    src={client.logo}
                    alt={`${client.name} logo`}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonial;
