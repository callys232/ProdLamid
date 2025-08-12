"use client";

import React from "react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { FaLeaf, FaHospital, FaLightbulb } from "react-icons/fa";

const Impact = () => {
  return (
    <>
      <Head>
        <meta
          name="description"
          content="Explore our impact through job creation, healthcare partnerships, and climate action. Empowering communities for sustainable development."
        />
        <meta
          name="keywords"
          content="Impact, Sustainable Development, Cooperatives, Healthcare, Climate Change, Renewable Energy, Community Empowerment"
        />
        <meta name="lamid" content="Lamid Consulting" />
        <meta
          property="og:title"
          content="Impact | Sustainable Development Initiatives"
        />
        <meta
          property="og:description"
          content="Discover how we drive change through economic recovery, health equity, and climate resilience."
        />
        <meta property="og:image" content="/farmers.png" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://lamidconsulting.com/impact" />
        <link rel="canonical" href="https://lamidconsulting.com/impact" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="min-h-screen bg-black text-white">
        <main className="container mx-auto px-4 py-12">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-300 mb-16 hover:text-white transition duration-300 animate-fadeUp">
            Impact
          </h1>

          <div className="space-y-20">
            {/* Section 1: Job and Wealth Creation */}
            <section className="flex flex-col md:flex-row gap-8">
              <div className="w-full md:w-1/4 flex-shrink-0 transform hover:scale-105 transition duration-300">
                <div className="relative h-48 w-full rounded-lg overflow-hidden">
                  <Image
                    src="/farmers.png"
                    alt="Group of farmers collaborating in a field"
                    fill
                    className="object-cover rounded-lg"
                    priority
                  />
                </div>
              </div>

              <div className="w-full md:w-3/4">
                <div className="flex items-start gap-4 mb-3">
                  <FaLeaf className="h-8 w-8 text-yellow-500 mt-1" />
                  <div className="bg-transparent border border-green-500 text-green-400 px-4 py-2 rounded-md flex-grow hover:bg-green-500 hover:text-black transition duration-300">
                    <h2 className="text-xl font-medium">
                      Job and Wealth Creation for Social Cohesion & Economic
                      Recovery
                    </h2>
                  </div>
                </div>

                <p className="text-gray-400 mb-4 pl-12">
                  We positioned cooperatives to re-set globalization; starting
                  from few groups to communities and states. By experience, we
                  see job and wealth creation through cooperatives as a scalable
                  model for inclusive growth.
                </p>

                <Link href="/impact/job-creation">
                  <p className="text-yellow-500 hover:underline cursor-pointer pl-12 transition duration-300 hover:text-yellow-400">
                    Learn how this unique opportunity transformed over 5000
                    cooperatives.
                  </p>
                </Link>
              </div>
            </section>

            {/* Section 2: Healthcare Partnerships */}
            <section className="flex flex-col md:flex-row gap-8">
              <div className="w-full md:w-1/4 flex-shrink-0 transform hover:scale-105 transition duration-300">
                <div className="relative h-48 w-full rounded-lg overflow-hidden">
                  <Image
                    src="/hospital.png"
                    alt="Modern hospital room with medical equipment"
                    fill
                    className="object-cover rounded-lg"
                    priority
                  />
                </div>
              </div>

              <div className="w-full md:w-3/4">
                <div className="flex items-start gap-4 mb-3">
                  <FaHospital className="h-8 w-8 text-white mt-1" />
                  <div className="bg-transparent border border-green-500 text-green-400 px-4 py-2 rounded-md flex-grow hover:bg-green-500 hover:text-black transition duration-300">
                    <h2 className="text-xl font-medium">
                      Building Communities on Managed Healthcare Partnerships
                    </h2>
                  </div>
                </div>

                <p className="text-gray-400 pl-12">
                  We improved maternal care, child survival, and primary
                  healthcare delivery, achieving organizational and financial
                  sustainability among five communities'
                  partnerships-for-health.
                </p>
              </div>
            </section>

            {/* Section 3: Climate Change */}
            <section className="flex flex-col md:flex-row gap-8">
              <div className="w-full md:w-1/5 flex-shrink-0 flex justify-center">
                <FaLightbulb className="h-12 w-12 text-white transform hover:scale-110 transition duration-300" />
              </div>

              <div className="w-full md:w-2/3">
                <div className="mb-3">
                  <div className="bg-transparent border border-green-500 text-green-400 px-4 py-2 rounded-md hover:bg-green-500 hover:text-black transition duration-300">
                    <h2 className="text-xl font-medium">
                      Combating Climate Change with Renewable Energy
                    </h2>
                  </div>
                </div>

                <p className="text-gray-400 mb-4">
                  By building women and youth-led entrepreneurial clusters
                  around clean energy assets, we achieved equalization and
                  environmental remediation in Niger Delta communities.
                </p>

                <Link href="/impact/climate-action">
                  <p className="text-gray-400 hover:underline cursor-pointer transition duration-300 hover:text-white">
                    Read more.
                  </p>
                </Link>
              </div>
            </section>
          </div>
        </main>
      </div>
    </>
  );
};

export default Impact;
