import Head from "next/head";
import Image from "next/image";

const BusinessPrototypes = ({text}) => {
  // Sample data for the prototype cards
  const prototypes = [
    {
      id: 1,
      imagePath: "/prototype1.png",
      altText: "Business concept visualization prototype",
      name: "Web Design"
    },
    {
      id: 2,
      imagePath: "/prototype2.png",
      altText: "Product development prototype",
      name: "Mobile Rental Services"
    },
    {
      id: 3, 
      imagePath: "/prototype3.png",
      altText: "Project management prototype",
      name: "Event Planning"
    },
    {
      id: 4,
      imagePath: "/prototype4.png",
      altText: "Product design prototype",
      name: "Gadget Replacement"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <Head>
        <title>{text}</title>
        <meta name="description" content="Business prototype examples" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-center mb-8">
          <div className="border border-white px-6 py-2">
            <h1 className="text-lg md:text-xl font-bold">{text}</h1>
          </div>
        </div>

        {/* Prototype Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
          {prototypes.map((prototype) => (
            <div
              key={prototype.id}
              className="border-l border-r border-t border-gray-800 pb-4"
            >
              {/* Image container with fixed aspect ratio */}
              <div className="relative aspect-square w-full mb-4">
                <Image
                  src={prototype.imagePath}
                  alt={prototype.altText}
                  layout="fill"
                  objectFit="contain"
                  priority
                />
              </div>

              {/* Name section */}
              <div className="px-4">
                <div className="flex items-center gap-7 w-full text-center">
                  <p className="text-sm">NAME:</p>
                  <div className="h-8 flex items-center justify-center">
                    {prototype.name}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex justify-between">
                  <button className="bg-black border border-white text-white text-xs px-4 py-2 hover:bg-gray-900 transition-colors">
                    BUY NOW
                  </button>
                  <button className="bg-black border border-white text-white text-xs px-4 py-2 hover:bg-gray-900 transition-colors">
                    ADD TO CART
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default BusinessPrototypes;