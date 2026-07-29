"use client";
import { useEffect, useState } from "react";
import { getReviews, createReview } from "@/lib/api/reviewApi";

export default function ReviewSection() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Fetch reviews from API
  useEffect(() => {
    const fetchReviewsData = async () => {
      try {
        setLoading(true);
        setFetchError(null);
        const { reviews: data } = await getReviews({ limit: 20 });
        setReviews(data);
      } catch (err: any) {
        setFetchError("Failed to load reviews");
      } finally {
        setLoading(false);
      }
    };
    fetchReviewsData();
  }, []);

  // Save review to API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) {
      setError("Name and comment are required.");
      return;
    }
    setError("");

    try {
      const newReview = await createReview({
        rating,
        comment,
        reviewerName: name
      });

      // Add to list
      setReviews((prev) => [newReview, ...prev]);

      // Reset form
      setName("");
      setComment("");
      setRating(5);
    } catch (err: any) {
      setError("Failed to submit review. Please try again.");
    }
  };

  const renderStars = (count: number) => (
    <div className="flex items-center gap-1 mb-2">
      {Array.from({ length: count }).map((_, idx) => (
        <span key={idx} className="text-[#2563EB]">
          ★
        </span>
      ))}
      {Array.from({ length: 5 - count }).map((_, idx) => (
        <span key={idx} className="text-gray-600">
          ★
        </span>
      ))}
    </div>
  );

  return (
    <div className="bg-white/50 border border-[#2563EB] rounded-lg shadow-lg p-6 space-y-6">
      <h2 className="text-2xl font-bold text-[#2563EB] border-b border-[#2563EB] pb-2">
        Client Reviews
      </h2>

      {/* Review Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <p className="text-blue-600 text-sm">{error}</p>}
        <div>
          <label className="block text-sm font-medium text-black mb-1">
            Your Name
          </label>
          <input
            aria-label="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 rounded-md border border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]"
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
            className="w-full hover:bg-black px-3 py-2 rounded-md border border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]"
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
            className="w-full px-3 py-2 rounded-md border border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]"
            rows={4}
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

      {/* Reviews List */}
      <div className="space-y-4">
        {loading ? (
          <p className="text-gray-600 text-sm">Loading reviews...</p>
        ) : fetchError ? (
          <div className="text-center">
            <p className="text-blue-600 text-sm mb-2">{fetchError}</p>
            <button
              onClick={() => window.location.reload()}
              className="text-sm bg-[#2563EB] text-white px-4 py-1 rounded hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        ) : reviews.length === 0 ? (
          <p className="text-gray-600 text-sm">No reviews yet. Be the first!</p>
        ) : (
          reviews.map((review) => (
            <div
              key={review.id || review._id}
              className="border border-[#2563EB] rounded-md p-4 bg-white shadow-sm"
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-[#2563EB]">{review.reviewerName || review.name || "Anonymous"}</h3>
                <span className="text-xs text-gray-600">
                  {review.createdAt ? new Date(review.createdAt).toLocaleString() : review.uploadedAt || ""}
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
