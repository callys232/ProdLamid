// components/ConsultantCard.tsx
"use client";

import { Star } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import type { Consultant } from "@/types/client";
import ConsultantModal from "./consultantModal";
import Feedback from "./feedback";

interface ConsultantCardProps {
  consultant: Consultant;
  isPremiumUser?: boolean;
  isEnterpriseUser?: boolean;
}

export default function ConsultantCard({
  consultant,
  isPremiumUser = false,
  isEnterpriseUser = false,
}: ConsultantCardProps) {
  const {
    name,
    image,
    industry,
    delivery,
    rate,
    rating,
    experience,
    role,
    skills = [],
  } = consultant;

  const [showModal, setShowModal] = useState(false);
  const [feedback, setFeedback] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const renderStars = (rating: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i + 1 <= Math.round(rating) ? "text-blue-500 fill-blue-500" : "text-gray-400"}`}
      />
    ));

  const handleHire = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const { hireConsultant } = await import("@/lib/api/consultantApi");
      await hireConsultant(consultant.id || consultant._id || "", "");
      setFeedback({
        message: "Hire request sent successfully!",
        type: "success",
      });
      setTimeout(() => setFeedback(null), 2500);
    } catch (err) {
      setFeedback({
        message: "Error sending hire request. Please try again.",
        type: "error",
      });
      setTimeout(() => setFeedback(null), 2500);
    }
  };

  return (
    <>
      <div
        className="bg-gradient-to-b from-[#1a0d0d] to-[#0d0000] border border-[#2a0d0d] rounded-xl shadow-md
                   hover:shadow-lg hover:shadow-blue-700/30 transition-all duration-300 hover:-translate-y-1 hover:bg-[#1f0d0d] p-5 flex flex-col justify-between cursor-pointer"
        onClick={() => setShowModal(true)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") setShowModal(true);
        }}
      >
        {/* Avatar / Image */}
        <div className="flex flex-col items-center mb-4">
          <div className="relative w-16 h-16 rounded-full bg-[#2a0d0d] flex items-center justify-center overflow-hidden">
            {image ? (
              <Image
                src={image}
                alt={name}
                fill
                className="object-cover rounded-full"
              />
            ) : (
              <div className="text-blue-500 text-2xl font-bold">👤</div>
            )}
          </div>

          <h3 className="text-lg font-semibold text-white mt-3">{name}</h3>
          <p className="text-xs text-gray-400 -mt-1 mb-2">{role}</p>

          <div
            className="flex justify-center mb-2"
            aria-label={`Rating: ${rating} out of 5`}
          >
            {renderStars(rating)}
          </div>

          {/* Skills row: visible on card */}
          {skills.length > 0 && (
            <div className="mt-2 w-full flex flex-wrap justify-center gap-2">
              {skills.slice(0, 6).map((s) => (
                <span
                  key={s}
                  className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs font-medium truncate max-w-[8rem]"
                  title={s}
                >
                  {s}
                </span>
              ))}
              {skills.length > 6 && (
                <span className="px-2 py-0.5 bg-gray-800 text-gray-200 rounded-full text-xs">
                  +{skills.length - 6}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="text-center mb-3 space-y-1">
          <p className="text-gray-300 text-sm">{industry}</p>
          <p className="text-gray-300 text-sm">{delivery}</p>
          {experience && (
            <p className="text-gray-300 text-sm">
              Experience: {experience} yrs
            </p>
          )}
        </div>

        {/* Rate */}
        <div className="text-center mb-4">
          <p className="text-blue-500 font-semibold text-sm">${rate}/hr</p>
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-3 mt-auto">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowModal(true);
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-md shadow-sm hover:shadow-md transition-all"
          >
            View Team
          </button>

          <button
            type="button"
            onClick={handleHire}
            className="px-4 py-2 border border-blue-600 text-blue-400 hover:bg-blue-800 hover:text-white text-xs font-medium rounded-md shadow-sm hover:shadow-md transition-all"
          >
            Hire Now
          </button>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <ConsultantModal
          isOpen={showModal}
          consultant={consultant}
          onClose={() => setShowModal(false)}
        />
      )}

      {/* Feedback Toast */}
      {feedback && <Feedback message={feedback.message} type={feedback.type} />}
    </>
  );
}
