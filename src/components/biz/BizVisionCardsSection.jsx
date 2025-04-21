import Image from 'next/image';

const BizVisionCardsSection = () => {
    return (
        <div className="relative w-full h-64 md:h-72 bg-black text-white">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image 
              src="/tree-background.jpg" 
              alt="Technology Background" 
              layout="fill"
              objectFit="cover"
              className="opacity-60"
            />
          </div>
          
          {/* Content Container */}
          <div className="relative z-10 h-full flex items-center justify-center">
            <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
              
              {/* Lamid Tech Card */}
              <div className="w-full md:w-5/12 border border-red-500 rounded-md p-4 bg-black bg-opacity-70 relative">
                {/* Header Banner */}
                <div className="absolute -top-4 left-4 bg-black px-4 py-1 border border-red-500 rounded">
                  <h3 className="text-white font-bold">Lamid Tech</h3>
                </div>
                
                {/* Card content */}
                <div className="mt-4">
                  <p className="text-sm text-gray-200">
                    The exclusive small business online networking marketplace, where sellers meet buyers, and announce and exchange services and products.
                  </p>
                </div>
              </div>
              
              {/* Vision 2030 Card */}
              <div className="w-full md:w-5/12 border border-green-500 rounded-md p-4 bg-black bg-opacity-70 relative">
                {/* Header Banner */}
                <div className="absolute -top-4 left-4 bg-black px-4 py-1 border border-green-500 rounded">
                  <h3 className="text-green-500 font-bold">VISION 2030</h3>
                </div>
                
                {/* Card content */}
                <div className="mt-4">
                  <p className="text-sm text-gray-200">
                    To produce 5,000 start ups to deliver exceptional value and dominate markets.
                  </p>
                </div>
              </div>
              
            </div>
          </div>
        </div>
      );
}

export default BizVisionCardsSection
