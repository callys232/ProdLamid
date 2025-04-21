import React from "react";
import Head from "next/head";
import Image from "next/image";

const HcdEvent = () => {
  return (
    <div className="relative min-h-screen bg-black text-white">
      {/* Background circular gradients */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="w-full h-full relative">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-gray-800 rounded-full opacity-50"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-gray-800 rounded-full opacity-30"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-gray-800 rounded-full opacity-20"></div>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-8 py-12">
        <main className="max-w-6xl mx-auto">
          {/* Training Section with Faculty Profile */}
          <section className="mb-16">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-full md:w-1/3">
                  <div className="relative">
                    <div className="relative h-[27rem] w-full overflow-hidden rounded-lg mb-4">
                      <Image
                        src="/SD-training-graphic.png"
                        alt="People studying together"
                        layout="fill"
                        objectFit="cover"
                      />
                    </div>
                </div>
              </div>

              <div className="w-full md:w-2/3">
                <h2 className="text-2xl font-bold mb-4 text-orange-500">
                  Faculty Profile
                </h2>

                <p className="text-sm mb-4">
                  Using the most intellectually experienced consultant
                  facilitators, we match their expertise to clients' needs. As
                  specialists in their own fields, each bring expertise in a
                  professional specialty and commit to model the theories they
                  teach. They are selected from suitable and best qualified
                  people, chosen for their ability to convey knowledge, and
                  share their skills and experience.
                </p>

                <p className="text-sm mb-6">
                  "LAMID's trainings enhanced the quality of the negotiation
                  processes with respective Trade Unions, and led to significant
                  improvements in industrial relations, between their officials
                  and management teams," organizes "LAMID Consulting has
                  continued to assist them to design and implement various
                  productivity and management development programs, to build the
                  capacity of senior Local Governments officials in the state,
                  and enable them meet the growing developmental challenges."
                </p>
              </div>
            </div>
          </section>

          {/* Events Section */}
          <section className="mb-16">
            <div className="border border-zinc-800 rounded px-4 py-2 inline-block mb-8">
              <h2 className="text-xl font-bold text-orange-500">EVENTS</h2>
            </div>

            <div className="flex flex-wrap justify-between gap-4 mb-8">
              <div className="text-center">
                <div className="w-24 h-24 mx-auto rounded-full overflow-hidden mb-2">
                  <Image
                    src="/SD-people-working.png"
                    alt="Event 1"
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-sm font-medium">
                  Reskill
                  <br />
                  ing
                </h3>
              </div>

              <div className="text-center">
                <div className="w-24 h-24 mx-auto rounded-full overflow-hidden mb-2">
                  <Image
                    src="/SD-people-working.png"
                    alt="Event 2"
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-sm font-medium">
                  Reskill
                  <br />
                  ing
                </h3>
              </div>

              <div className="text-center">
                <div className="w-24 h-24 mx-auto rounded-full overflow-hidden mb-2">
                  <Image
                    src="/SD-people-working.png"
                    alt="Event 3"
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-sm font-medium">
                  About to
                  <br />
                  Disappear
                </h3>
              </div>

              <div className="text-center">
                <div className="w-24 h-24 mx-auto rounded-full overflow-hidden mb-2">
                  <Image
                    src="/SD-people-working.png"
                    alt="Event 4"
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-sm font-medium">
                  Event
                  <br />
                  Name
                </h3>
              </div>
            </div>

            <div className="flex justify-center mb-8">
              <button className="px-6 py-2 bg-orange-600 text-white rounded text-sm font-medium hover:bg-orange-700 transition-colors">
                Sign Up Now
              </button>
            </div>

            <p className="text-center text-sm">
              We have been retained by an array of clients with personalized
              solutions, enabling them to maintain an enviable leadership
              position.
            </p>
          </section>
        </main>
      </div>
    </div>
  );
};

export default HcdEvent;