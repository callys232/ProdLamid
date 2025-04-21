import Head from "next/head";
import Image from "next/image";

const HCDEvent = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Head>
        <title>Human Capital Development Events</title>
        <meta
          name="description"
          content="Human Capital Development events and opportunities"
        />
      </Head>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8">
          {/* Logo section */}
          <div className="w-1/6 flex-shrink-0 flex justify-start">
            <div className="relative w-28 h-24">
              <Image
                src="/human-capital-icon.png"
                alt="Human Capital Icon"
                layout="fill"
                objectFit="contain"
                priority
              />
            </div>
          </div>

          {/* Content section */}
          <div className="flex-1 w-full">
            <h2 className="text-xl font-bold mb-6 text-right">
              Upcoming Events
            </h2>

            {/* Top image grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-gray-700 aspect-video"></div>
              <div className="bg-gray-700 aspect-video"></div>
              <div className="bg-gray-700 aspect-video"></div>
              <div className="bg-gray-700 aspect-video"></div>
            </div>

            {/* Invitation text */}
            <div className="text-center text-sm mb-6">
              <p>
                To obtain an invitation to our much sought-after business clinic
                and get a chance to win a free diagnostic card,{" "}
                <a href="#" className="text-orange-500">
                  click here
                </a>
              </p>
            </div>

            {/* Job categories section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="flex flex-col">
                <div className="bg-gray-700 aspect-video mb-2"></div>
                <h3 className="text-md font-semibold">Job Scoping</h3>
                <a href="#" className="text-orange-500 text-sm">
                  view this
                </a>
              </div>

              <div className="flex flex-col">
                <div className="bg-gray-700 aspect-video mb-2"></div>
                <h3 className="text-md font-semibold">
                  About to Disappear Jobs
                </h3>
                <a href="#" className="text-orange-500 text-sm">
                  view this
                </a>
              </div>

              <div className="flex flex-col">
                <div className="bg-gray-700 aspect-video mb-2"></div>
                <h3 className="text-md font-semibold">
                  Re-skilling for 21st Century Jobs
                </h3>
                <a href="#" className="text-orange-500 text-sm">
                  view this
                </a>
              </div>
            </div>

            {/* See all events button */}
            <div className="flex justify-center mb-8">
              <button className="bg-orange-500 text-white px-4 py-2 rounded text-sm uppercase">
                See all events
              </button>
            </div>

            {/* Job search clinic section */}
            <div className="flex flex-col items-center mb-8">
              <div className="relative w-32 h-32 mb-2">
                {/* This would be the job search icon/illustration */}
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
              <button className="bg-orange-500 text-white px-4 py-2 rounded text-sm">
                Job search clinic
              </button>
            </div>

            {/* Footer tagline */}
            <div className="text-center text-sm mt-8">
              <p>Exploring the ideas of shaping tomorrow's opportunities</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HCDEvent;