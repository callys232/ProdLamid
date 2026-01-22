// components/FloatingBox.tsx
"use client";

import Link from "next/link";

export default function FloatingBox() {
  return (
    <div className="fixed bottom-6 left-6 flex flex-col items-center gap-2 z-50">
      {/* Need Help Bubble */}
      <Link href="/contact">
        <div
          className="animate-bounce bg-gray-900 text-white text-sm px-3 py-1 rounded-full shadow-md cursor-pointer hover:bg-red-600 transition duration-300"
          style={{ animationDuration: "3s" }} // <-- slower bounce
        >
          Need Help?
        </div>
      </Link>
    </div>
  );
}
