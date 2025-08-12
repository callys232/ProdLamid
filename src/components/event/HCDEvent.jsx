"use client";
import Head from "next/head";
import Image from "next/image";

const HCDEvent = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Head>
        <meta
          name="description"
          content="Explore Lamid Consulting's Human Capital Development events, including job scoping, re-skilling, and business clinics for future-ready careers."
        />
        <meta
          name="keywords"
          content="human capital development, job scoping, re-skilling, disappearing jobs, business clinic, Lamid Consulting, career growth"
        />
        <meta name="author" content="Lamid Consulting" />
        <meta
          property="og:title"
          content="Human Capital Development Events | Lamid Consulting"
        />
        <meta
          property="og:description"
          content="Join Lamid Consulting's events to shape tomorrow's opportunities through strategic career development's Human Capital Development events, including job scoping, re-skilling, and business clinics for future-ready careers."
        />
        <meta
          name="keywords"
          content="human capital development, job scoping, re-skilling, disappearing jobs, business clinic, Lamid Consulting, career growth"
        />
        <meta name="author" content="Lamid Consulting" />
        <meta
          property="og:title"
          content="Human Capital Development Events | Lamid Consulting"
        />
        <meta
          property="og:description"
          content="Join Lamid Consulting's events to shape tomorrow's opportunities through strategic career development."
        />
        <meta
          property="og:image"
          content="https://yourdomain.com/human-capital-icon.png"
        />
        <meta property="og:url" content="https://yourdomain.com/events/hcd" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://yourdomain.com/events/hcd" />
      </Head>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <section className="flex flex-col md:flex-row justify-between items-start gap-8">
          {/* Logo section */}
          <figure className="w-1/6 flex-shrink-0 flex justify-start">
            <div className="relative w-28 h-24 pop-item">
              <Image
                src="/human-capital-icon.png"
                alt="Human Capital Icon"
                layout="fill"
                objectFit="contain"
                priority
              />
            </div>
          </figure>

          {/* Content section */}
          <div className="flex-1 w-full">
            <h2 className="text-xl font-bold mb-6 text-right">
              Upcoming Events
            </h2>

            {/* Top image grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-gray-700 aspect-video pop-item" />
              ))}
            </div>

            {/* Invitation text */}
            <div className="text-center text-sm mb-6">
              <p className="transition-colors duration-300 hover:text-orange-400">
                To obtain an invitation to our much sought-after business clinic
                and get a chance to win a free diagnostic card,{" "}
                <a
                  href="#"
                  className="text-orange-500 hover:text-white underline transition-colors duration-300"
                >
                  click here
                </a>
              </p>
            </div>

            {/* Job categories section */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {[
                "Job Scoping",
                "About to Disappear Jobs",
                "Re-skilling for 21st Century Jobs",
              ].map((title, i) => (
                <div key={title} className="flex flex-col">
                  <div className="bg-gray-700 aspect-video mb-2 pop-item" />
                  <h3 className="text-md font-semibold">{title}</h3>
                  <a
                    href="#"
                    className="text-orange-500 text-sm hover:underline"
                  >
                    view this
                  </a>
                </div>
              ))}
            </section>

            {/* See all events button */}
            <div className="flex justify-center mb-8">
              <button className="bg-orange-500 text-white px-4 py-2 rounded text-sm uppercase hover:bg-orange-600 transition duration-300">
                See all events
              </button>
            </div>

            {/* Job search clinic section */}
            <section className="flex flex-col items-center mb-8">
              <div className="relative w-32 h-32 mb-2 pop-item">
                <div className="bg-transparent w-full h-full flex items-center justify-center">
                  <div className="relative w-20 h-20">
                    <Image
                      src="/Job-search.png"
                      alt="Job search illustration"
                      layout="fill"
                      objectFit="contain"
                    />
                  </div>
                </div>
              </div>
              <button className="bg-orange-500 text-white px-4 py-2 rounded text-sm hover:bg-orange-600 transition duration-300">
                Job search clinic
              </button>
            </section>

            {/* Footer tagline */}
            <footer className="text-center text-sm mt-8">
              <p className="transition-colors duration-300 hover:text-orange-400">
                Exploring the ideas of shaping tomorrow's opportunities
              </p>
            </footer>
          </div>
        </section>
      </main>

      {/* Pop animation styles */}
      <style jsx>{`
        .pop-item {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .pop-item:hover {
          transform: scale(1.05);
          box-shadow: 0 0 10px rgba(255, 165, 0, 0.6);
        }
      `}</style>
    </div>
  );
};

export default HCDEvent;
