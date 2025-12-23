"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import Modal from "@/components/Modals/hcdModal";
import Feedback from "./feedback";
import type { Consultant } from "@/types/client";
import { useState } from "react";

interface ConsultantModalProps {
  isOpen: boolean;
  onClose: () => void;
  consultant: Consultant;
}

export default function ConsultantModal({
  isOpen,
  onClose,
  consultant,
}: ConsultantModalProps) {
  const {
    name,
    image,
    industry,
    delivery,
    rate,
    rating,
    role,
    email,
    experience,
    skills,
    projects,
  } = consultant;

  const [feedback, setFeedback] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const renderStars = (rating: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${
          i + 1 <= Math.round(rating)
            ? "text-red-500 fill-red-500"
            : "text-gray-300"
        }`}
      />
    ));

  const handleHire = async () => {
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
        setTimeout(() => {
          setFeedback(null);
          onClose();
        }, 2500);
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
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Consultant Details"
        width="max-w-2xl"
      >
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <div className="relative w-20 h-20 rounded-full overflow-hidden bg-gray-200">
              {image ? (
                <Image
                  src={image}
                  alt={name}
                  fill
                  className="object-cover rounded-full"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-3xl">
                  👤
                </div>
              )}
            </div>
            <div>
              <h3 className="text-xl font-semibold text-black">{name}</h3>
              <p className="text-sm text-gray-600">{role}</p>
              <div
                className="flex mt-1"
                aria-label={`Rating: ${rating} out of 5`}
              >
                {renderStars(rating)}
              </div>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-gray-700">
            <p>
              <span className="font-medium">Industry:</span> {industry}
            </p>
            <p>
              <span className="font-medium">Delivery:</span> {delivery}
            </p>
            {experience && (
              <p>
                <span className="font-medium">Experience:</span> {experience}{" "}
                yrs
              </p>
            )}
            {email && (
              <p>
                <span className="font-medium">Email:</span> {email}
              </p>
            )}
            <p>
              <span className="font-medium">Rate:</span> ${rate}/hr
            </p>
          </div>

          {/* Skills */}
          {skills && skills.length > 0 && (
            <div>
              <h4 className="font-semibold text-black mb-1">Skills</h4>
              <ul className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <li
                    key={skill}
                    className="px-2 py-1 bg-red-100 text-red-700 rounded-md text-xs font-medium"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Projects */}
          {projects && projects.length > 0 && (
            <div>
              <h4 className="font-semibold text-black mb-1">Projects</h4>
              <ul className="list-disc list-inside text-sm text-gray-700">
                {projects.map((proj) => (
                  <li key={proj.id}>{proj.title}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Hire Now Button */}
          <div className="flex justify-center pt-4">
            <button
              type="button"
              onClick={handleHire}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-md shadow-md transition-all"
            >
              Hire Now
            </button>
          </div>
        </div>
      </Modal>

      {/* Feedback Toast */}
      {feedback && <Feedback message={feedback.message} type={feedback.type} />}
    </>
  );
}
