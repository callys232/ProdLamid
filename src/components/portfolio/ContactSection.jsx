"use client"

import { useState } from 'react';
import Image from 'next/image';

const ContactSection = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
      });
      
      const [isSubmitting, setIsSubmitting] = useState(false);
      const [submitStatus, setSubmitStatus] = useState(null);
    
      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
          ...prev,
          [name]: value
        }));
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        // Simulate form submission
        try {
          // Replace with actual API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          setSubmitStatus({ success: true, message: 'Message sent successfully!' });
          setFormData({ name: '', email: '', message: '' });
        } catch (error) {
          setSubmitStatus({ success: false, message: 'Failed to send message. Please try again.' });
        } finally {
          setIsSubmitting(false);
          // Clear status after 3 seconds
          setTimeout(() => setSubmitStatus(null), 3000);
        }
      };
    
      return (
        <section className="bg-black text-white min-h-screen w-full flex flex-col items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-6xl">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold inline-block border border-red-600 px-6 py-3 mb-12">
              CONTACT US
            </h2>
            
            {/* Main container with image and form */}
            <div className="relative">
              {/* The illustration/image - positioned to the left */}
              <div className="hidden sm:block absolute left-0 bottom-0 w-1/2 h-full z-0">
                <div className="relative w-full h-full">
                  <Image 
                    src="/contact-illustration.png" 
                    alt="Contact illustration" 
                    width={400}
                    height={300}
                    className="object-contain object-left-bottom"
                    
                    unoptimized
                  />
                 
                </div>
              </div>
              
              {/* Form container - positioned to partially overlap the image */}
              <div className="relative z-10 sm:ml-auto sm:w-3/5 bg-black">
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div>
                    <input
                      type="text"
                      name="name"
                      placeholder="NAME:"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-gray-300 text-gray-800 placeholder-gray-600 rounded-none focus:outline-none focus:ring-2 focus:ring-red-600"
                    />
                  </div>
                  
                  <div>
                    <input
                      type="email"
                      name="email"
                      placeholder="EMAIL:"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-gray-300 text-gray-800 placeholder-gray-600 rounded-none focus:outline-none focus:ring-2 focus:ring-red-600"
                    />
                  </div>
                  
                  <div>
                    <textarea
                      name="message"
                      placeholder="MESSAGE:"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows="6"
                      className="w-full px-4 py-3 bg-gray-300 text-gray-800 placeholder-gray-600 rounded-none focus:outline-none focus:ring-2 focus:ring-red-600 resize-none"
                    />
                  </div>
                  
                  <div className="mt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-red-600 text-white py-2 px-12 rounded-none hover:bg-red-700 transition-colors disabled:opacity-70"
                    >
                      {isSubmitting ? 'SENDING...' : 'SEND'}
                    </button>
                  </div>
                  
                  {submitStatus && (
                    <div className={`mt-4 p-3 ${submitStatus.success ? 'bg-green-700' : 'bg-red-700'} text-white`}>
                      {submitStatus.message}
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </section>
      );
}

export default ContactSection
