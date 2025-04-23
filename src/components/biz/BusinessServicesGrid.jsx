import React from "react";
import Image from "next/image";

const ServiceCard = ({ image, text, position = "left" }) => {
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 flex flex-col md:flex-row items-center gap-4 h-full hover:border-gray-500 transition duration-300">
      <div
        className={`flex-shrink-0 ${
          position === "right" ? "md:order-last" : ""
        }`}
      >
        <div className="relative w-12 h-12 transform hover:scale-110 transition duration-300">
          <Image
            src={image}
            alt="Service Icon"
            layout="fill"
            objectFit="contain"
          />
        </div>
      </div>
      <p
        className={`text-white text-sm md:text-base ${
          position === "right" ? "md:text-right" : "md:text-left"
        } text-center hover:text-gray-300 transition duration-300`}
      >
        {text}
      </p>
    </div>
  );
};

const BusinessServicesGrid = () => {
  const images = {
    dollar: "/biz-dollar.png",
    chart: "/biz-chart.png",
    target: "/biz-businessman-icon.png",
    tech: "/biz-tech.png",
    gear: "/biz-gear.png",
    team: "/biz-target.png",
    reposition: "/biz-reposition.png",
    funnel: "/biz-funnel.png",
    lightbulb: "/biz-lightbulb.png",
  };

  const cards = [
    {
      image: images.dollar,
      text: "Develop client-centered products and services.",
      position: "left",
    },
    {
      image: images.dollar,
      text: "Set up structures that manage and assure sustained growth",
      position: "right",
    },
    {
      image: images.chart,
      text: "Work on the business for the clients, not just work in the business.",
      position: "left",
    },
    {
      image: images.team,
      text: "Build a top-notch team to deliver real-time value.",
      position: "right",
    },
    {
      image: images.target,
      text: "Follow-up clients for enduring relationships.",
      position: "left",
    },
    {
      image: images.tech,
      text: (
        <span>
          Use technology to{" "}
          <span className="text-red-500 font-bold">connect</span> to clients to
          deliver and track value.
        </span>
      ),
      position: "left",
    },
    {
      image: images.gear,
      text: "Set up state-of-the art systems for positive returns.",
      position: "right",
    },
    {
      image: images.reposition,
      text: "Re-position for the client and greater financial margin.",
      position: "left",
    },
    {
      image: images.funnel,
      text: "Achieve greater prospects' conversion to create lasting clients.",
      position: "right",
    },
    {
      image: images.lightbulb,
      text: "Innovate and make the organization globally accessible.",
      position: "left",
    },
  ];

  return (
    <div className="bg-black min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card, idx) => (
            <ServiceCard
              key={idx}
              image={card.image}
              text={card.text}
              position={card.position}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BusinessServicesGrid;
