const StartupFlowchart = () => {
  return (
    <div className="flex flex-col items-center text-center text-white bg-black py-10 px-6 md:px-12">
      <h2 className="text-xl md:text-2xl font-bold mb-6">
        Startup Creation & Acceleration
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {/* Stage 1 */}
        <div className="bg-purple-500 p-4 rounded-md">
          <img
            src="/icons/opportunity.png"
            alt="Viable Opportunities"
            className="mx-auto w-12 h-12"
          />
          <h3 className="text-lg font-semibold mt-2">Viable Opportunities</h3>
        </div>

        {/* Stage 2 */}
        <div className="bg-gray-800 p-4 rounded-md">
          <img
            src="/icons/structure.png"
            alt="State-of-the-art structures & systems"
            className="mx-auto w-12 h-12"
          />
          <h3 className="text-lg font-semibold mt-2">
            State-of-the-art Structures & Systems
          </h3>
        </div>

        {/* Stage 3 */}
        <div className="bg-red-600 p-4 rounded-md">
          <img
            src="/icons/prototype.png"
            alt="Minimum Viable Prototype"
            className="mx-auto w-12 h-12"
          />
          <h3 className="text-lg font-semibold mt-2">
            Minimum Viable Prototype
          </h3>
        </div>

        {/* Stage 4 */}
        <div className="bg-orange-500 p-4 rounded-md">
          <img
            src="/icons/talent.png"
            alt="Top-of-market Talent"
            className="mx-auto w-12 h-12"
          />
          <h3 className="text-lg font-semibold mt-2">Top-of-market Talent</h3>
        </div>

        {/* Stage 5 */}
        <div className="bg-green-500 p-4 rounded-md">
          <img
            src="/icons/finance.png"
            alt="Finance Access"
            className="mx-auto w-12 h-12"
          />
          <h3 className="text-lg font-semibold mt-2">Finance Access</h3>
        </div>

        {/* Stage 6 */}
        <div className="bg-gray-900 p-4 rounded-md">
          <img
            src="/icons/market.png"
            alt="Visibility for Market Dominance"
            className="mx-auto w-12 h-12"
          />
          <h3 className="text-lg font-semibold mt-2">
            Visibility for Market Dominance
          </h3>
        </div>

        {/* Stage 7 */}
        <div className="bg-white text-black p-4 rounded-md">
          <img
            src="/icons/global.png"
            alt="Global Access"
            className="mx-auto w-12 h-12"
          />
          <h3 className="text-lg font-semibold mt-2">Global Access</h3>
        </div>
      </div>

      {/* Call-to-Action */}
      <div className="mt-8 bg-red-700 text-white p-4 rounded-md text-center">
        <h3 className="text-lg font-bold">
          Over 3000 Startups Created & Accelerated
        </h3>
        <p className="text-sm">Be the next admired success!</p>
      </div>
    </div>
  );
};

export default StartupFlowchart;
