"use client";
import Head from "next/head";
import Image from "next/image";

const BusinessPrototypes = ({ text }) => {
  const prototypes = [
    {
      id: 1,
      imagePath: "/prototype1.png",
      altText: "Business concept visualization prototype",
      name: "Web Design",
    },
    {
      id: 2,
      imagePath: "/prototype2.png",
      altText: "Product development prototype",
      name: "Mobile Rental Services",
    },
    {
      id: 3,
      imagePath: "/prototype3.png",
      altText: "Project management prototype",
      name: "Event Planning",
    },
    {
      id: 4,
      imagePath: "/prototype4.png",
      altText: "Product design prototype",
      name: "Gadget Replacement",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <Head>
        <title>{text}</title>
        <meta
          name="description"
          content="Business prototype examples including Web Design, Mobile Rental Services, Event Planning, and Gadget Replacement."
        />
        <meta
          name="keywords"
          content="business prototypes, web design, mobile services, event planning, product design, Lamid Consulting"
        />
        <meta name="author" content="Lamid Consulting" />
        <meta property="og:title" content={text} />
        <meta
          property="og:description"
          content="Explore business prototypes and concepts developed by Lamid Consulting."
        />
        <meta
          property="og:image"
          content="https://yourdomain.com/prototype1.png"
        />
        <meta
          property="og:url"
          content="https://yourdomain.com/business-prototypes"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <link
          rel="canonical"
          href="https://yourdomain.com/business-prototypes"
        />
      </Head>

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex justify-center mb-8">
          <div className="border border-white px-6 py-2 pop-item">
            <h1 className="text-lg md:text-xl font-bold">{text}</h1>
          </div>
        </header>

        {/* Prototype Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
          {prototypes.map((prototype) => (
            <article
              key={prototype.id}
              className="border-l border-r border-t border-gray-800 pb-4 rounded pop-item transition duration-300 hover:scale-105 hover:border-white"
            >
              {/* Image container */}
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
                <div className="flex items-center gap-7 w-full text-center mb-2">
                  <p className="text-sm">NAME:</p>
                  <div className="h-8 flex items-center justify-center font-semibold">
                    {prototype.name}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex justify-between gap-2">
                  <button className="bg-black border border-white text-white text-xs px-4 py-2 hover:bg-white hover:text-black transition duration-300 rounded pop-item">
                    BUY NOW
                  </button>
                  <button className="bg-black border border-white text-white text-xs px-4 py-2 hover:bg-white hover:text-black transition duration-300 rounded pop-item">
                    ADD TO CART
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>
      </main>

      {/* Pop animation styles */}
      <style jsx>{`
        .pop-item {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .pop-item:hover {
          transform: scale(1.05);
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  );
};

export default BusinessPrototypes;
