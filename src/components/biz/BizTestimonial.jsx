import React from "react";
import Image from "next/image";
import Link from "next/link";

const BizTestimonial = () => {
  return (
    <div className="relative bg-black text-white">
      {/* Testimonial Image */}
      <div className="w-full">
        <div className="w-full relative">
          <Image
            src="/biz-testimonial.png"
            alt="Testimonial"
            width={1920}
            height={1080}
            priority
            className="w-full h-auto object-contain hover:opacity-90 transition-opacity duration-300"
            sizes="100vw"
          />
        </div>
      </div>

      {/* Job Loss Question Image */}
      <div className="w-full max-w-[300px] mx-auto py-8 px-4 transform hover:scale-105 transition-transform duration-300">
        <Link href="mailto:info@lamidconsulting.com">
          <Image
            src="/biz-question.png"
            alt="What would happen if you lost your job today?"
            width={300}
            height={375}
            priority
            className="w-full h-auto object-contain"
          />
        </Link>
      </div>
    </div>
  );
};

export default BizTestimonial;
