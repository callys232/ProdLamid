import React from "react";
import Image from 'next/image';
import Head from 'next/head';

const SDImapactandSocial = () => {
  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      <Head>
        <title>Sustainable Development Impact</title>
        <meta
          name="description"
          content="Sustainable Development CALEB BREAK-TREES impact and social inclusion"
        />
      </Head>

      {/* Circular Background Element */}
      <div className="absolute w-[800px] h-[800px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-2 border-gray-700 rounded-full z-0"></div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Metrics Banner */}
        <div className="flex justify-center mb-10">
          <div className="bg-blue-500 text-white px-4 py-1 rounded">
            <span className="font-semibold">2063 × 915</span>
          </div>
        </div>

        {/* Impact Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-16">
          <div className="flex justify-center md:justify-start">
            <div className="relative w-[250px] md:w-full max-w-sm aspect-[4/3] overflow-hidden rounded-lg">
              <Image
                src="/SD-farmers-field.png"
                alt="Farmers in field"
                layout="fill"
                objectFit="cover"
              />
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-3">Impact</h2>
            <p className="text-sm text-gray-300 mb-4">
              Sustainable Development CALEB BREAK-TREES INTO 3 MORE IMPACTS
              UNDER RUST_DEVELOP. By building diverse agricultural and artisanal
              vibrant businesses, we have scaled up green tree energy, conflict
              decreased deputation, quality education, responsive media,
              replication and agility. In the social consciousness huge public
              concerns with ultimate environmental remediation resulting from
              responsibly controlled open sourcing have provided 15 years of
              significant learning in green thinking, concentration on
              institution building, fundraising, sustainability programming and
              income generation for 8 community partnerships. Our "youth
              progression to responsible citizenship" transitional and financial
              sustainability plan has ensured food security and dignified work
              with the smart agriculture initiative with agility programming
              inbuilt, that achieves targets in poverty reduction, good
              governance, improved traditional, alternative and modern
              practices, education, health and health, unity & citizen's aid,
              state action matrix map for sustainable human development.
            </p>
            <button className="text-blue-400 hover:underline text-sm">
              Read more...
            </button>
          </div>
        </div>

        {/* Social Inclusion Section */}
        <div className="mb-16">
          <div className="flex items-center mb-4">
            <div className="mr-3">
              <svg
                className="w-8 h-8 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zm8 0a3 3 0 11-6 0 3 3 0 016 0zm-4.07 11c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold">Social Inclusion</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <p className="text-sm text-gray-300 mb-4">
                By experience, we can put our wealth creation with cooperative
                formation and skill acquisition into practice for sustainable
                income generating process into the middle and upper class,
                providing the needed resources for improved economic activity
                and quality of life. The miraculous process has been dramatic as
                the average youth in the enterprise develops fast and with
                improved facilities, these individuals thrive better than the
                average entrepreneur in that league.
              </p>

              {/* Image Grid */}
              <div className="mt-6">
                <div className="relative w-full aspect-[3/1] max-h-[150px] md:max-h-[200px] overflow-hidden rounded">
                  <Image
                    src="/SD-three-pic.png"
                    alt="Hands together"
                    layout="fill"
                    objectFit="contain"
                    className="bg-black"
                  />
                </div>
              </div>

              <div className="mt-6">
                <p className="text-sm">
                  Be the next raving success. Join the race
                </p>
                <p className="text-red-500 text-sm">
                  Register now and experience immersion
                </p>
                <div className="mt-2">
                  <button className="bg-transparent border border-red-500 text-red-500 px-4 py-1 text-sm hover:bg-red-500 hover:text-white transition duration-300 rounded-sm">
                    Boot Camp
                  </button>
                </div>
              </div>
            </div>

            <div>
              <div className="relative w-[250px] md:w-full mx-auto aspect-[3/4] overflow-hidden rounded">
                <Image
                  src="/SD-hospital-room.png"
                  alt="Hospital room"
                  layout="fill"
                  objectFit="cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SDImapactandSocial;
