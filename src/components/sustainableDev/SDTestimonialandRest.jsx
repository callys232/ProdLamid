import React from 'react';
import Image from 'next/image';
import Head from 'next/head';

const SDTestimonialandRest = () => {
  return (
    <div className="bg-black text-white min-h-screen">
      <Head>
        <title>Training & Testimonials</title>
        <meta name="description" content="World-class training programs and testimonials" />
      </Head>
      
      <div className="container mx-auto px-4 py-12">
        {/* Testimonials Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          {/* Left Column - Text Testimonials */}
          <div>
            <h2 className="text-xl font-bold text-red-500 mb-6">Testimonials</h2>
            <div className="space-y-4">
              <p className="text-sm text-gray-300">
                <span className="text-white">"</span>The programs helped in the effective management and motivation of staff to 
                enable them leverage their intellectual capability, to transform business 
                challenges into results.<span className="text-white">"</span>
              </p>
              
              <p className="text-sm text-gray-300">
                <span className="text-white">"</span>LAMID's training program enhanced the quality of the negotiation processes 
                with respective Trade Unions, and led to significant improvements in 
                Industrial Relations across various establishments in this 
                organization.<span className="text-white">"</span>
              </p>
              
              <p className="text-sm text-gray-300">
                <span className="text-white">"</span>LAMID Consulting has continued to assist clients to design and 
                implement various productivity and management development programs, to 
                build the capacity of senior Local Governments officials in the state, and enable 
                them tackle the growing developmental challenges.<span className="text-white">"</span>
              </p>
            </div>
          </div>
          
          {/* Right Column - Empty Box with Red Border */}
          <div className="border border-red-700 rounded-3xl h-48 md:h-64 p-4">
            {/* This is the empty box with just the red border */}
          </div>
        </div>
        
        {/* Training Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Training Image */}
          <div className="relative h-72 bg-gray-900 rounded-lg overflow-hidden">
            <Image
              src="/SD-training-graphic.png"
              alt="Training Skills Development"
              layout="fill"
              objectFit="cover"
            />
          </div>
          
          {/* Building world-class talents */}
          <div>
            <h3 className="text-xl font-semibold text-orange-500 mb-4">Building world-class talents</h3>
            <p className="text-sm text-gray-300 mb-6">
              Our training events have a distinct signature for being adaptable 
              and unique throughout to obtain the desired outcome and 
              impact needed for participants. First, we customize the training to 
              meet the set goals of the participants, organization by selecting 
              the appropriate methodology, training aids and materials to 
              achieve desirable best possible outcome and enjoy a 
              universal reputation for the quality of our trainings.
            </p>
            
            {/* Orange Divider Line */}
            <div className="w-full h-0.5 bg-orange-500 mt-10"></div>
          </div>
          
          {/* Transforming people */}
          <div>
            <h3 className="text-xl font-semibold text-orange-500 mb-4">Transforming people to high-performance talents</h3>
            <p className="text-sm text-gray-300 mb-6">
              We set experts at promoting academic excellence with our 
              world applications using the most intellectually experienced 
              consultants (lecturers, matching their expertise to need). 
              Our approach to sustainable learning starts with the 
              specialists in their own field, chosen for their ability to convey 
              knowledge and skills their style and expertise, who then bring 
              them to life and make the experiences personally relevant to 
              themes they learn.
            </p>
            
            {/* Orange Divider Line */}
            <div className="w-full h-0.5 bg-orange-500 mt-10"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SDTestimonialandRest
