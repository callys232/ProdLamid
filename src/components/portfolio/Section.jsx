import React from 'react'
import Image from 'next/image';

const Section = () => {
    return (
        <section className="bg-black text-white py-12 px-4 md:px-8 lg:px-16">
          {/* Three column services section */}
          <div className="container mx-auto mb-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Column 1 - Management */}
              <div className="flex flex-col items-center md:items-start">
                <div className="mb-4">
                  <Image 
                    src="/pt-target-icon.png" 
                    alt="Target icon" 
                    width={64} 
                    height={64}
                    className="w-16 h-16"
                  />
                </div>
                <div className="text-center md:text-left">
                  <p className="text-sm leading-relaxed">
                    <span className="font-bold">LAMID's Management comprises a core team of highly experienced and effective professionals.</span> They design, coordinate, manage and lead human capital development and business advisory services to client organizations. Their strong business acumen sets that clients cannot acquire elsewhere, making them a definite rare of LAMID's services.
                  </p>
                </div>
              </div>
    
              {/* Column 2 - Vision */}
              <div className="flex flex-col items-center md:items-start">
                <div className="mb-4">
                  <Image 
                    src="/pt-calendar-icon.png" 
                    alt="Calendar icon" 
                    width={64} 
                    height={64}
                    className="w-16 h-16"
                  />
                </div>
                <div className="text-center md:text-left">
                  <p className="text-sm leading-relaxed">
                    <span className="font-bold">Vision 2025: "To nurture 4,000 more of Africa's best talents to deliver excellence, grow and in-creating profitability and providing sustainable businesses by 2025. With client-focused and customized organizational growth and development models and support, because we commit to a shared outcome."</span> Creating a growth of 25% annually.
                  </p>
                </div>
              </div>
    
              {/* Column 3 - Technology */}
              <div className="flex flex-col items-center md:items-start">
                <div className="mb-4">
                  <Image 
                    src="/pt-dollar-icon.png" 
                    alt="Dollar up arrow icon" 
                    width={64} 
                    height={64}
                    className="w-16 h-16"
                  />
                </div>
                <div className="text-center md:text-left">
                  <p className="text-sm leading-relaxed">
                    <span className="font-bold">As business is increasingly transacted with technology on the rise, introducing capabilities and flexibility,</span> technically infused presence and in the face of stiff competition in all markets, making it compelling for timely introduction of products, the use of old web technology is obsolete, our website is developed to conform with the latest technology.
                  </p>
                </div>
              </div>
            </div>
          </div>
    
          {/* Bottom content section */}
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left box - What is Bizphare-Bizclub */}
              <div className="border border-gray-600 rounded-lg overflow-hidden relative h-48 md:h-64">
                <div className="absolute inset-0">
                  <Image 
                    src="/pt-business-meeting.png" 
                    alt="Business meeting" 
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative z-10 p-4">
                  <div className="bg-red-800 text-white inline-block px-3 py-1 rounded mb-4">
                    <h3 className="text-sm font-medium">What is Bizphare-Bizclub?</h3>
                  </div>
                  {/* Content would go here */}
                </div>
              </div>
    
              {/* Right box - Empty content area */}
              <div className="border border-gray-600 rounded-lg h-48 md:h-64">
                {/* This appears to be an empty content area in the original image */}
              </div>
            </div>
          </div>
        </section>
      );
}

export default Section
