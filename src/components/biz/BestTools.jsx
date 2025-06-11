import { useState } from "react";
import Image from "next/image";
import React from "react";

const BestToolsCard = ({ tool }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div
      className="relative flex flex-col items-center p-4 rounded-lg shadow-md bg-gray-900 text-white transition-all duration-300 cursor-pointer 
      hover:scale-105 hover:border hover:border-blue-500"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setIsModalOpen(true)}
    >
      <div className="relative w-20 h-20 md:w-32 md:h-32 rounded-full overflow-hidden mb-3">
        <Image src={tool.image} alt={tool.name} fill className="object-cover" />
      </div>
      <p className="text-center font-semibold text-sm md:text-base">
        {tool.name}
      </p>

      {/* Tooltip on Hover */}
      {isHovered && (
        <div className="absolute -bottom-10 bg-blue-600 text-white text-xs py-1 px-3 rounded-md shadow-lg">
          {tool.description}
        </div>
      )}

      {/* Modal on Click */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg text-white shadow-lg w-80 md:w-96">
            <h2 className="text-lg font-bold mb-2">{tool.name}</h2>
            <p className="text-sm">{tool.fullDetails}</p>
            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md text-white"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const BestTools = () => {
  const tools = [
    {
      id: 1,
      name: "Strategy",
      image: "/strategy-icon.png",
      description: "Smart planning for success",
      fullDetails:
        "Developing a powerful business strategy ensures long-term growth and scalability.",
    },
    {
      id: 2,
      name: "Finance Access",
      image: "/finance-icon.png",
      description: "Funding & capital management",
      fullDetails:
        "Accessing the right financial resources is key to sustaining business operations.",
    },
    {
      id: 3,
      name: "Market Dominance",
      image: "/market-icon.png",
      description: "Expanding brand reach",
      fullDetails:
        "Capturing market share through competitive positioning and strategic marketing.",
    },
    {
      id: 4,
      name: "Viable Opportunities",
      image: "/opportunities-icon.png",
      description: "Seizing profitable ventures",
      fullDetails:
        "Identifying and leveraging opportunities that drive sustainable success.",
    },
    {
      id: 5,
      name: "Innovation",
      image: "/innovation-icon.png",
      description: "Driving creative solutions",
      fullDetails:
        "Innovation is the key to staying ahead in a competitive market.",
    },
    {
      id: 6,
      name: "Leadership",
      image: "/leadership-icon.png",
      description: "Guiding successful teams",
      fullDetails:
        "Strong leadership enables growth, motivation, and operational excellence.",
    },
    {
      id: 7,
      name: "Customer Focus",
      image: "/customer-focus-icon.png",
      description: "Understanding user needs",
      fullDetails:
        "Customer-centric approaches lead to long-term loyalty and success.",
    },
    {
      id: 8,
      name: "Sustainability",
      image: "/sustainability-icon.png",
      description: "Building lasting impact",
      fullDetails:
        "Sustainable strategies ensure future-proof success and environmental responsibility.",
    },
  ];

  return (
    <section className="relative text-center">
      {/* Background Image Covering Event Cards */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/bestTools-bg.jpg"
          alt="Best Tools background"
          fill
          className="object-cover"
        />
      </div>

      <div className="container mx-auto px-6 py-12">
        <h1 className="text-2xl font-bold mb-6 text-white">
          Best Tools for Startup Success
        </h1>

        {/* Tool Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {tools.map((tool) => (
            <BestToolsCard key={tool.id} tool={tool} />
          ))}
        </div>
      </div>

      {/* Interactive Buttons */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mt-4 px-4">
        <button className="border border-white px-6 py-3 rounded-md bg-transparent hover:bg-red-700 text-white font-medium text-lg transform hover:scale-105 transition duration-300">
          Build Right! Avoid costly trial and error.
        </button>

        <button className="border border-white px-6 py-3 rounded-md bg-transparent hover:bg-red-700 text-white font-medium text-lg transform hover:scale-105 transition duration-300">
          Get started - FREE Diagnostics, Limited time only!
        </button>
      </div>
    </section>
  );
};

export default BestTools;
