"use client";

import React from "react";

interface CardGridProps {
  children: React.ReactNode;
  columns?: string; // Tailwind grid cols e.g. "grid-cols-2 md:grid-cols-4"
}

const CardGrid: React.FC<CardGridProps> = ({
  children,
  columns = "grid-cols-2 md:grid-cols-4",
}) => {
  return (
    <div className={`grid ${columns} gap-4 sm:gap-6 md:gap-8`}>{children}</div>
  );
};

export default CardGrid;
