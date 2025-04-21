"use client";

import Image from "next/image";
import { motion } from "framer-motion";

// Option 1: Text Only on Mobile, Text + Full-width Image on Desktop
const HeaderOption1 = () => {
  return (
    <header className="h-screen bg-black text-white pt-12">
      <div className="h-full flex flex-col md:flex-row items-center">
        {/* Text Content */}
        <div className="w-full md:w-1/2 px-4 sm:px-6 lg:px-8 flex items-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center md:text-left max-w-xl mx-auto md:mx-0">
            We build and grow world-class organizations
          </h1>
        </div>

        {/* Image - Hidden on mobile, full-width on desktop */}
        <div className="hidden md:block w-1/2 h-full">
          <Image
            src="/Home1.png"
            alt="Header Title"
            width={800}
            height={600}
            priority
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </header>
  );
};

// Option 2: Stacked Layout (Text above Image) on Mobile, Side by Side on Desktop
const HeaderOption2 = () => {
  return (
    <header className="relative min-h-[100dvh] w-full overflow-x-hidden bg-black text-white">
      <div className="flex flex-col md:flex-row items-center">
        {/* Text Content */}
        <motion.div
          className="w-full md:w-[60%] px-4 sm:px-6 md:px-8 lg:px-12 pt-20 md:pt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.h1
            className="text-3xl sm:text-4xl md:text-3xl lg:text-4xl font-bold text-center md:text-left max-w-[90%] mx-auto md:mx-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            We build and grow world-class organizations
          </motion.h1>
        </motion.div>

        {/* Image */}
        <motion.div 
          className="w-full md:w-[60%] md:h-screen mt-8 md:mt-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="w-full h-[40vh] md:h-full">
            {/* <Image
              src="/Home1.png"
              alt="Header Title"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain md:object-cover"
            /> */}
            <Image
            src="/Home1.png"
            alt="Header Title"
            width={800}
            height={400}
            priority
            className=" object-cover"
          />
          </div>
        </motion.div>

        {/* <div className="hidden md:block h-full">
          <Image
            src="/Home1.png"
            alt="Header Title"
            width={800}
            height={400}
            priority
            className=" object-cover"
          />
        </div> */}
      </div>
    </header>
  );
};

// Option 3: Background Image with Overlay Text
const HeaderOption3 = () => {
  return (
    <header className="h-screen bg-black text-white pt-12 relative">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/Home1.png"
          alt="Background"
          fill
          priority
          className="object-cover opacity-30"
        />
      </div>

      {/* Text Content */}
      <div className="relative h-full flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-center max-w-xl">
          We build and grow world-class organizations
        </h1>
      </div>
    </header>
  );
};

export { HeaderOption1, HeaderOption2, HeaderOption3 };
