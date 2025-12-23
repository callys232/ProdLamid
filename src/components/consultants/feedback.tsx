"use client";

interface FeedbackProps {
  message: string;
  type?: "success" | "error";
}

export default function Feedback({ message, type = "success" }: FeedbackProps) {
  return (
    <div
      className={`fixed bottom-6 right-6 px-4 py-2 rounded-lg shadow-lg text-sm font-medium transition-all
        ${
          type === "success"
            ? "bg-green-600 text-white"
            : "bg-red-600 text-white"
        }`}
    >
      {message}
    </div>
  );
}
