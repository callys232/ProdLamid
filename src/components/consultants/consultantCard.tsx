"use client";

import { Star } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import type { Consultant } from "@/types/client";
import ConsultantModal from "./consultantModal";
import Feedback from "./feedback"; // ✅ reusable toast

interface ConsultantCardProps {
  consultant: Consultant;
}

export default function ConsultantCard({ consultant }: ConsultantCardProps) {
  const {
    name,
    image,
    industry,
    delivery,
    rate,
    rating,
    experience,
    role,
    email,
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
        className={`w-4 h-4 ${
          i + 1 <= Math.round(rating)
            ? "text-red-500 fill-red-500"
            : "text-gray-600"
        }`}
      />
    ));

  // ✅ Hire Now handler
  const handleHire = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await fetch("/api/hire-consultant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          consultantId: consultant.id || consultant._id,
          consultantEmail: email,
        }),
      });

      if (res.ok) {
        setFeedback({
          message: "Hire request sent successfully!",
          type: "success",
        });
        setTimeout(() => setFeedback(null), 2500);
      } else {
        setFeedback({
          message: "Something went wrong. Try again.",
          type: "error",
        });
        setTimeout(() => setFeedback(null), 2500);
      }
    } catch (err) {
      console.error(err);
      setFeedback({ message: "Error sending hire request.", type: "error" });
      setTimeout(() => setFeedback(null), 2500);
    }
  };

  return (
    <>
      <div
        className="bg-[#140000] border border-[#2a0d0d] rounded-lg shadow-lg hover:shadow-red-700/30 transition-all duration-300 hover:-translate-y-1 p-4 flex flex-col justify-between cursor-pointer"
        onClick={() => setShowModal(true)}
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
              <div className="text-red-500 text-2xl font-bold">👤</div>
            )}
          </div>
          <h3 className="text-lg font-semibold text-white mt-3">{name}</h3>
          <p className="text-xs text-gray-400 -mt-1 mb-1">{role}</p>

          <div
            className="flex justify-center mb-2"
            aria-label={`Rating: ${rating} out of 5`}
          >
            {renderStars(rating)}
          </div>
        </div>

        {/* Info */}
        <div className="text-center mb-3">
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
          <p className="text-red-500 font-semibold text-sm">${rate}/hr</p>
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-3 mt-auto">
          {/* View Team → opens modal */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowModal(true);
            }}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded-md transition-all"
          >
            View Team
          </button>

          {/* Hire Now → triggers API + feedback */}
          <button
            type="button"
            onClick={handleHire}
            className="px-4 py-2 border border-red-600 text-red-400 hover:bg-red-800 hover:text-white text-xs font-medium rounded-md transition-all"
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
