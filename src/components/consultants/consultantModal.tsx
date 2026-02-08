"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import Modal from "@/components/Modals/hcdModal";
import Feedback from "./feedback";
import type { Consultant } from "@/types/client";
import { useState, useEffect } from "react";

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
        className={`w-5 h-5 ${i + 1 <= Math.round(rating)
          ? "text-red-500 fill-red-500"
          : "text-gray-300"
          }`}
      />
    ));

  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [userProjects, setUserProjects] = useState<{ id: string, title: string }[]>([]);

  useEffect(() => {
    if (isOpen) {
      fetchUserProjects();
    }
  }, [isOpen]);

  const fetchUserProjects = async () => {
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      if (data.success) {
        // Only projects owned by current user (backend route /api/projects probably needs adjustment or filtering here)
        // For simplicity assuming it returns relevant projects or we'll filter on backend in the hire API anyway
        setUserProjects(data.data.map((p: any) => ({ id: p._id || p.id, title: p.title })));
      }
    } catch (err) {
      console.error("Error fetching projects:", err);
    }
  };

  const handleHire = async () => {
    if (!selectedProjectId) {
      setFeedback({ message: "Please select a project first", type: "error" });
      return;
    }
    try {
      const res = await fetch("/api/hire-consultant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          consultantId: consultant.id || consultant._id,
          projectId: selectedProjectId,
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

          {/* Project Selection */}
          <div className="pt-4 border-t border-gray-100">
            <h4 className="font-semibold text-black mb-2 text-sm uppercase tracking-wider">Hire for Project</h4>
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm text-black bg-white focus:ring-red-500 focus:border-red-500"
            >
              <option value="">-- Choose a Project --</option>
              {userProjects.map((proj) => (
                <option key={proj.id} value={proj.id}>{proj.title}</option>
              ))}
            </select>
          </div>

          {/* Hire Now Button */}
          <div className="flex justify-center pt-2">
            <button
              type="button"
              onClick={handleHire}
              disabled={!selectedProjectId}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-md shadow-md transition-all disabled:opacity-50 disabled:bg-gray-400"
            >
              Confirm Hire
            </button>
          </div>
        </div>
      </Modal>

      {/* Feedback Toast */}
      {feedback && <Feedback message={feedback.message} type={feedback.type} />}
    </>
  );
}
