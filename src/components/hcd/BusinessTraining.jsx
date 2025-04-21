import React from "react";
import Image from "next/image";

const BusinessTraining = () => {
  return (
    <div className="relative min-h-screen bg-black text-white">
      <div className="container mx-auto px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Left side - Business diagram */}
          <div className="w-full md:w-1/3">
            <div className="relative w-64 h-64 mx-auto">
              {/* This would be replaced with your actual image */}
              <div className="relative">
                <Image
                  src="/BIZ_LOGOS.png"
                  alt="Business Diagram with BIZ, prototypes, and bbgr sections"
                  width={250}
                  height={250}
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>

          {/* Middle - Training description and options */}
          <div className="w-full md:w-1/3 space-y-4">
            <div className="mb-6">
              <p className="text-white text-sm mb-4">
                "Use cutting-edge tools to secure top-tier talent for permanent, temporary, and contract roles."
              </p>
              
              <div className="space-y-1">
                <div className="bg-red-900 px-3 py-1 text-sm text-white">
                  Functional management training
                </div>
                <div className="bg-amber-800 px-3 py-1 text-sm text-white">
                  Leadership awareness training
                </div>
                <div className="bg-green-900 px-3 py-1 text-sm text-white">
                  Job Search workshops
                </div>
              </div>
            </div>
          </div>

          {/* Right side - People with rising arrow illustration */}
          <div className="w-full md:w-1/3">
            <div className="relative w-64 h-64 mx-auto">
              {/* This would be replaced with your actual image */}
              <Image
                src="/hcd-team-illustration.png"
                alt="Business growth illustration with people and rising arrow"
                width={300}
                height={300}
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessTraining;