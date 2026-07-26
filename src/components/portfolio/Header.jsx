import React from 'react'

const Header = () => {
  return (
    <section className="w-full bg-black text-white py-16 pt-24">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-stretch gap-8">
          {/* Left side - Title */}
          <div className="w-full md:w-1/3 bg-gradient-to-br from-blue-900 to-blue-700 rounded-3xl p-8 flex items-center justify-center">
            <h2 className="text-3xl font-bold uppercase tracking-wider">OUR STRENGTH</h2>
          </div>

          {/* Right side - Content */}
          <div className="w-full md:w-2/3 flex items-center">
            <p className="text-sm md:text-base lg:text-lg leading-relaxed">
              For over three decades, we have worked globally across industries, communities, and boardrooms. We have seen the gaps. We have seen the potential — and we built LAMID ONE to bridge both. A unified ecosystem where trusted expertise and advanced AI work together to deliver consulting, training, and business growth in one digital environment.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Header
