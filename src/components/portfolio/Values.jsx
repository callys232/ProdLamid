import React from 'react'
import Image from 'next/image'

const Values = () => {
  return (
    <div className="w-full">
              {/* Full-width responsive image container with preserved content */}
              <div className="w-full relative">
                <Image
                  src="/values.png"
                  alt="Title"
                  width={1920}
                  height={1080}
                  priority
                  className="w-full h-auto object-contain"
                  sizes="100vw"
                />
              </div>
            </div>
  )
}

export default Values
