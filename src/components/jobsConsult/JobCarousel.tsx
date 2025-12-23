"use client";

import { useEffect, useRef, useState, KeyboardEvent } from "react";
import JobCard from "./JobCard";
import { Project } from "@/types/project";

interface JobCarouselProps {
  title: string;
  jobs: Project[];
  onSelect: (job: Project) => void;
  activeJobId?: string;
}

export default function JobCarousel({
  title,
  jobs,
  onSelect,
  activeJobId,
}: JobCarouselProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const scrollBy = (delta: number) => {
    if (ref.current) {
      ref.current.scrollBy({ left: delta, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const update = () => {
      setCanScrollLeft(el.scrollLeft > 0);
      setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth);
    };

    el.addEventListener("scroll", update);
    update();

    return () => el.removeEventListener("scroll", update);
  }, []);

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft") scrollBy(-400);
    if (e.key === "ArrowRight") scrollBy(400);
  };

  return (
    <section className="relative" aria-label={`${title} carousel`}>
      <h2 className="text-xl font-bold text-white mb-3">{title}</h2>

      {/* Desktop arrows only */}
      <div className="hidden md:block">
        {canScrollLeft && (
          <button
            type="button"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/40 hover:bg-black/70 text-white px-3 py-2 rounded-full transition focus:outline-none focus:ring-2 focus:ring-[#c21219]"
            onClick={() => scrollBy(-400)}
            aria-label="Scroll left"
          >
            ‹
          </button>
        )}
        {canScrollRight && (
          <button
            type="button"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/40 hover:bg-black/70 text-white px-3 py-2 rounded-full transition focus:outline-none focus:ring-2 focus:ring-[#c21219]"
            onClick={() => scrollBy(400)}
            aria-label="Scroll right"
          >
            ›
          </button>
        )}
      </div>

      {/* Carousel container */}
      <div
        ref={ref}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className="
          flex gap-4 scroll-smooth pb-2 snap-mandatory focus:outline-none focus:ring-2 focus:ring-[#c21219]
          flex-col overflow-y-auto md:flex-row md:overflow-x-auto
        "
        role="list"
      >
        {jobs.length === 0 ? (
          <p className="text-gray-400">No jobs available in this category.</p>
        ) : (
          jobs.map((job) => (
            <div
              key={job._id || job.id}
              className="snap-start min-w-[280px] md:min-w-[320px] lg:min-w-[360px]"
              role="listitem"
            >
              <JobCard
                job={job}
                onClick={onSelect}
                isActive={activeJobId === (job._id || job.id)}
              />
            </div>
          ))
        )}
      </div>
    </section>
  );
}
