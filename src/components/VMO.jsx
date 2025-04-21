import React from "react";

const VMO = () => {
  return (
    <div className="min-h-scssreen bg-black text-white">
      <div>
        <title>LAMID - Values and Mission</title>
        <meta name="description" content="LAMID company values and mission" />
        <link rel="icon" href="/favicon.ico" />
      </div>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {/* Values Section */}
          <div className="bg-black border border-gray-800 rounded-lg p-6">
            <div className="text-center mb-4">
              <div className="bg-green-600 text-white font-bold py-2 px-4 rounded-md inline-block">
                VALUES
              </div>
            </div>
            <div className="text-sm">
              <p className="mb-4">
                LAMID has identified its core values which have shaped and
                defined our approach to proffering solutions. What we stand for,
                what sums up our business ideals, culture, products and services
                are embedded in these values. They are explicitly represented
                in:
              </p>
              <div className="mt-6">
                {/* This area can be expanded with the actual values */}
              </div>
            </div>
          </div>

          {/* Mission Section */}
          <div className="bg-black border border-gray-800 rounded-lg p-6">
            <div className="text-center mb-4">
              <div className="bg-blue-600 text-white font-bold py-2 px-4 rounded-md inline-block">
                MISSION
              </div>
            </div>
            <div className="text-sm">
              <p>
                We improve your performance and achieve massive results by
                providing a million-dollar value with an A+ effort, as you pay
                less for more!
              </p>
            </div>
          </div>

          {/* Our Approach Section */}
          <div className="bg-black border border-gray-800 rounded-lg p-6">
            <div className="text-center mb-4">
              <div className="bg-orange-500 text-white font-bold py-2 px-4 rounded-md inline-block">
                OUR APPROACH
              </div>
            </div>
            <div className="text-sm">
              <p>
                A great company can be measured by its performance (generating
                enough cash-flow through highly profitable operations that
                become self-sustaining). The greatness of a company has a lot to
                do with its leadership and planning is always the starting point
                of all great endeavors.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VMO;
