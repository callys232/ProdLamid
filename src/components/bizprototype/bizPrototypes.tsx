"use client";

import React, { useState, useEffect } from "react";
import PrototypeCard from "./prototypeCard";
import PrototypeModal from "./prototypeModal";
import { useCart } from "@/components/Cartcontext";
import { mockPrototypes } from "@/mocks/mockPrototype";

interface BusinessPrototypesProps {
  text: string;
}

const BusinessPrototypes: React.FC<BusinessPrototypesProps> = ({ text }) => {
  const { addToCart } = useCart();
  const [activePrototype, setActivePrototype] = useState<string | null>(null);
  const [prototypes, setPrototypes] = useState(mockPrototypes); // ✅ start with mock
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrototypes = async () => {
      try {
        const res = await fetch("/api/prototypes");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setPrototypes(data);
      } catch (err) {
        console.warn("Using mock prototypes due to fetch error:", err);
        setPrototypes(mockPrototypes); // ✅ fallback
      } finally {
        setLoading(false);
      }
    };
    fetchPrototypes();
  }, []);

  const selected = prototypes.find((p) => p.id === activePrototype);

  return (
    <div className="w-full bg-gradient-to-b from-black to-[#0b0b0b] text-white">
      <main className="container mx-auto px-4 py-10">
        {/* Frosted header frame */}
        <div className="flex justify-center mb-10">
          <div className="px-6 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg">
            <h1 className="text-lg md:text-xl font-bold">{text}</h1>
          </div>
        </div>

        {/* Grid of Prototypes */}
        {loading ? (
          <p className="text-center text-white/70">Loading prototypes…</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {prototypes.map((prototype) => (
              <PrototypeCard
                key={prototype.id}
                {...prototype}
                isActive={activePrototype === prototype.id}
                onBuy={() => setActivePrototype(prototype.id)}
                onAddToCart={() =>
                  addToCart({
                    id: prototype.id,
                    name: prototype.name,
                    imageUrl: prototype.imagePath,
                    price: prototype.price,
                    quantity: 1,
                    description: prototype.altText,
                    category: "Prototype",
                  })
                }
              />
            ))}
          </div>
        )}
      </main>

      {/* Modal */}
      {selected && (
        <PrototypeModal
          isOpen={!!activePrototype}
          onClose={() => setActivePrototype(null)}
          name={selected.name}
          imagePath={selected.imagePath}
          altText={selected.altText}
          price={selected.price}
        />
      )}
    </div>
  );
};

export default BusinessPrototypes;
