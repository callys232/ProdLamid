"use client";

import Card from "./card";

export default function ProgressCard({ progress }: { progress: number }) {
  return (
    <Card title="📈 Project Progress">
      <div className="w-full bg-gray-700 rounded-full h-4">
        <div
          className="bg-[#2563EB] h-4 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-sm text-gray-300 mt-2">{progress}% complete</p>
    </Card>
  );
}
