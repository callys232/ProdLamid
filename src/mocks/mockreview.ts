// mocks/mockreviews.ts

export interface Review {
  id: number;
  name: string;
  rating: number; // 1–5 stars
  comment: string;
  uploadedAt: string;
}

export const mockReviews: Review[] = [
  {
    id: 1,
    name: "Jane Doe",
    rating: 5,
    comment:
      "Excellent service, very professional and timely delivery. Highly recommend!",
    uploadedAt: "2025-12-13 14:30",
  },
  {
    id: 2,
    name: "John Smith",
    rating: 4,
    comment: "Good experience overall, but communication could be improved.",
    uploadedAt: "2025-12-13 14:40",
  },
  {
    id: 3,
    name: "Amaka Obi",
    rating: 5,
    comment:
      "Amazing work on our project. The team went above and beyond expectations.",
    uploadedAt: "2025-12-13 14:50",
  },
  {
    id: 4,
    name: "David Johnson",
    rating: 3,
    comment:
      "Average service. The project was delivered but not as polished as expected.",
    uploadedAt: "2025-12-13 15:00",
  },
  {
    id: 5,
    name: "Fatima Ahmed",
    rating: 4,
    comment:
      "Great support and follow-up. I’ll definitely work with them again.",
    uploadedAt: "2025-12-13 15:10",
  },
];
