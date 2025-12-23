"use client";
import { useEffect, useState } from "react";
import type { Review } from "@/types/eventTypes";
import { mockReviews } from "@/mocks/mockreview";

export default function ReviewSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch reviews from DB, fallback to mock
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch("/api/reviews");
        if (!res.ok) throw new Error("Failed to fetch");
        const data: Review[] = await res.json();
        setReviews(data);
      } catch (err) {
        console.warn("Using mock reviews as fallback:", err);
        setReviews(mockReviews);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  // Save review to DB, fallback to local state
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) {
      setError("Name and comment are required.");
      return;
    }
    setError("");

    const newReview: Review = {
      id: Date.now(),
      name,
      rating,
      comment,
      uploadedAt: new Date().toLocaleString(),
    };

    // Optimistic update
    setReviews((prev) => [newReview, ...prev]);

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newReview),
      });
      if (!res.ok) throw new Error("Failed to save");
      const saved = await res.json();
      // Replace optimistic with saved
      setReviews((prev) => [
        saved,
        ...prev.filter((r) => r.id !== newReview.id),
      ]);
    } catch (err) {
      console.warn("Saving to mock fallback:", err);
      // Keep optimistic review
    }

    setName("");
    setComment("");
    setRating(5);
  };

  const renderStars = (count: number) => (
    <div className="flex items-center gap-1 mb-2">
      {Array.from({ length: count }).map((_, idx) => (
        <span key={idx} className="text-[#c21219]">
          ★
        </span>
      ))}
      {Array.from({ length: 5 - count }).map((_, idx) => (
        <span key={idx} className="text-gray-300">
          ★
        </span>
      ))}
    </div>
  );

  return (
    <div className="bg-white/50 border border-[#c21219] rounded-lg shadow-lg p-6 space-y-6">
      <h2 className="text-2xl font-bold text-[#c21219] border-b border-[#c21219] pb-2">
        Client Reviews
      </h2>

      {/* Review Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <div>
          <label className="block text-sm font-medium text-black mb-1">
            Your Name
          </label>
          <input
            aria-label="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 rounded-md border border-[#c21219] focus:ring-2 focus:ring-[#c21219]"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-black mb-1">
            Rating
          </label>
          <select
            aria-label="ratings"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="w-full hover:bg-black px-3 py-2 rounded-md border border-[#c21219] focus:ring-2 focus:ring-[#c21219]"
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
            aria-label="comments"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full px-3 py-2 rounded-md border border-[#c21219] focus:ring-2 focus:ring-[#c21219]"
            rows={4}
            required
          />
        </div>

        <button
          type="submit"
          className="bg-[#c21219] text-white px-6 py-2 rounded-md hover:bg-red-700 transition"
        >
          Submit Review
        </button>
      </form>

      {/* Reviews List */}
      <div className="space-y-4">
        {loading ? (
          <p className="text-gray-600 text-sm">Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p className="text-gray-600 text-sm">No reviews yet. Be the first!</p>
        ) : (
          reviews.map((review) => (
            <div
              key={review.id}
              className="border border-[#c21219] rounded-md p-4 bg-white shadow-sm"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-[#c21219]">{review.name}</h3>
                <span className="text-xs text-gray-600">
                  {review.uploadedAt}
                </span>
              </div>
              {renderStars(review.rating)}
              <p className="text-black text-sm leading-relaxed">
                {review.comment}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
