"use client";
import { useState } from "react";
import type { Review } from "@/mocks/mockreview";

interface ReviewFormProps {
  onAddReview: (review: Review) => void;
}

export default function ReviewForm({ onAddReview }: ReviewFormProps) {
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) return;

    const newReview: Review = {
      id: Date.now(),
      name,
      rating,
      comment,
      uploadedAt: new Date().toLocaleString(),
    };

    // Pass review up to parent
    onAddReview(newReview);

    // Reset form
    setName("");
    setComment("");
    setRating(5);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white p-4 border border-[#2563EB] rounded-md shadow-sm"
    >
      <div>
        <label className="block text-sm font-medium text-black mb-1">
          Your Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 rounded-md border border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]"
          placeholder="Enter your name"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-black mb-1">
          Rating
        </label>
        <select
          aria-label="rating"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="w-full px-3 py-2 rounded-md border border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]"
        >
          {[5, 4, 3, 2, 1].map((r) => (
            <option key={r} value={r}>
              {r} ★
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-black mb-1">
          Comment
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full px-3 py-2 rounded-md border border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]"
          rows={4}
          placeholder="Write your review..."
          required
        />
      </div>

      <button
        type="submit"
        className="bg-[#2563EB] text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
      >
        Submit Review
      </button>
    </form>
  );
}
