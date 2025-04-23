import Image from "next/image";
import Link from "next/link";

const BusinessHistorySection = () => {
  return (
    <div className="w-full bg-black text-white py-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Left Side - Text Content */}
          <div className="space-y-4">
            <p className="text-gray-200 text-lg hover:text-white transition duration-300">
              Since 1992, we started the movement to bring businesses closer to
              markets with faster returns; we offer business intelligence to
              professional entrepreneurs and 'white-collar' retailers and have
              now digitalized the process, making it even easier and more
              efficient with our{" "}
              <Link
                href="/star-value"
                className="text-green-400 hover:text-green-300 transition duration-300 underline"
              >
                A star value.
              </Link>
            </p>

            {/* Logo section */}
            <div className="flex flex-wrap gap-4 mt-10 hover:scale-105 transition duration-300">
              <div className="relative w-36 h-36">
                <Image
                  src="/ibiz-logo.png"
                  alt="Biz Logo"
                  layout="fill"
                  objectFit="contain"
                  className="rounded-md"
                />
              </div>
            </div>
          </div>

          {/* Right Side - Image */}
          <div className="relative h-64 md:h-72 border border-gray-400 rounded-md overflow-hidden transform hover:scale-105 transition duration-300">
            <Image
              src="/eventsVid.png"
              alt="Business Space"
              layout="fill"
              objectFit="cover"
              className="rounded-md"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessHistorySection;
