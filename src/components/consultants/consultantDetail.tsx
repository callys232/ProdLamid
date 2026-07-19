"use client";

import Image from "next/image";
import { Star, CheckCircle, Shield } from "lucide-react";
import type { Consultant } from "@/types/client";

interface ConsultantDetailProps {
  consultant: Consultant;
}

export default function ConsultantDetail({ consultant }: ConsultantDetailProps) {
  const {
    name,
    image,
    role,
    industry,
    delivery,
    rate,
    rating,
    email,
    location,
    experience,
    languages,
    certifications,
    skills,
    projects,
    testimonials,
    caseStudies,
    aiMatchScore,
    successRate,
    clientSatisfaction,
    earningsToDate,
    availability,
    responseTime,
    preferredEngagementModel,
    verifiedStatus,
    insuranceCoverage,
  } = consultant;

  const renderStars = (rating: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${i + 1 <= Math.round(rating)
            ? "text-blue-500 fill-blue-500"
            : "text-gray-400"
          }`}
      />
    ));

  return (
    <div className="space-y-6 p-4 border rounded-lg bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="relative w-20 h-20 rounded-full overflow-hidden bg-gray-200">
          {image ? (
            <Image src={image} alt={name} fill className="object-cover rounded-full" />
          ) : (
            <div className="flex items-center justify-center h-full text-3xl">👤</div>
          )}
        </div>
        <div>
          <h3 className="text-xl font-semibold text-black flex items-center gap-2">
            {name}
            {verifiedStatus && <CheckCircle className="w-5 h-5 text-green-500" />}
          </h3>
          <p className="text-sm text-gray-600">{role}</p>
          <div className="flex mt-1" aria-label={`Rating: ${rating} out of 5`}>
            {renderStars(rating)}
          </div>
          {aiMatchScore && (
            <p className="text-xs text-blue-600 mt-1">AI Match Score: {aiMatchScore}%</p>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-gray-700">
        <p><span className="font-medium">Industry:</span> {industry}</p>
        <p><span className="font-medium">Delivery:</span> {delivery}</p>
        {experience && <p><span className="font-medium">Experience:</span> {experience} yrs</p>}
        {location && <p><span className="font-medium">Location:</span> {location}</p>}
        {email && <p><span className="font-medium">Email:</span> {email}</p>}
        <p><span className="font-medium">Rate:</span> ${rate}/hr</p>
        {preferredEngagementModel && (
          <p><span className="font-medium">Engagement:</span> {preferredEngagementModel}</p>
        )}
        {responseTime && <p><span className="font-medium">Response Time:</span> {responseTime}</p>}
      </div>

      {/* Skills */}
      {skills && skills.length > 0 && (
        <div>
          <h4 className="font-semibold text-black mb-1">Skills</h4>
          <ul className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <li key={skill} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-medium">
                {skill}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Certifications */}
      {certifications && certifications.length > 0 && (
        <div>
          <h4 className="font-semibold text-black mb-1">Certifications</h4>
          <ul className="list-disc list-inside text-sm text-gray-700">
            {certifications.map((cert) => <li key={cert}>{cert}</li>)}
          </ul>
        </div>
      )}

      {/* Projects */}
      {projects && projects.length > 0 && (
        <div>
          <h4 className="font-semibold text-black mb-1">Projects</h4>
          <ul className="list-disc list-inside text-sm text-gray-700">
            {projects.map((proj) => <li key={proj.id}>{proj.title}</li>)}
          </ul>
        </div>
      )}

      {/* Testimonials */}
      {testimonials && testimonials.length > 0 && (
        <div>
          <h4 className="font-semibold text-black mb-1">Testimonials</h4>
          <ul className="space-y-2 text-sm text-gray-700">
            {testimonials.map((t, idx) => (
              <li key={idx}>
                <p className="italic">"{t.feedback}"</p>
                <p className="text-xs text-gray-500">– {t.client}, {t.rating}/5</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Case Studies */}
      {caseStudies && caseStudies.length > 0 && (
        <div>
          <h4 className="font-semibold text-black mb-1">Case Studies</h4>
          <ul className="list-disc list-inside text-sm text-gray-700">
            {caseStudies.map((c, idx) => (
              <li key={idx}>
                {c.title} – {c.summary} {c.link && <a href={c.link} className="text-blue-600">Read more</a>}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Performance Metrics */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-gray-700">
        {successRate && <p><span className="font-medium">Success Rate:</span> {successRate}%</p>}
        {clientSatisfaction && <p><span className="font-medium">Client Satisfaction:</span> {clientSatisfaction}%</p>}
        {earningsToDate && <p><span className="font-medium">Earnings:</span> ${earningsToDate}</p>}
        {insuranceCoverage && (
          <p className="flex items-center gap-1">
            <Shield className="w-4 h-4 text-gray-500" /> {insuranceCoverage}
          </p>
        )}
      </div>

      {/* Availability */}
      {availability && availability.length > 0 && (
        <div>
          <h4 className="font-semibold text-black mb-1">Availability</h4>
          <ul className="text-sm text-gray-700">
            {availability.map((a, idx) => (
              <li key={idx}>
                {a.day}: {a.slots.join(", ")}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
