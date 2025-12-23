// src/components/project/BidCard.tsx
import Card from "./card";

export default function BidCard() {
  return (
    <Card title="💰 Place a Bid">
      <form className="space-y-4">
        <input
          type="number"
          placeholder="Bid Amount ($)"
          className="w-full p-2 rounded-md bg-[#0c0000] border border-[#3a1919] text-white"
        />
        <textarea
          placeholder="Message to project owner..."
          className="w-full p-2 rounded-md bg-[#0c0000] border border-[#3a1919] text-white"
        />
        <button
          type="submit"
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-semibold"
        >
          Submit Bid
        </button>
      </form>
    </Card>
  );
}
