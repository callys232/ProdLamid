// components/Footer.jsx
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-[#181818] text-white py-8 px-4 md:px-12">
      <div className="container mx-auto">
        {/* Top section with logo and social icons */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          {/* Logo */}
          <div className="mb-6 md:mb-0">
            <Link href="/">
              <Image 
                src="/lamid-logo.png" 
                alt="Lamid Consulting" 
                width={200} 
                height={80}
                className="mb-4"
              />
            </Link>
            
            {/* Social Media Icons */}
            <div className="flex space-x-4">
              <Link href="https://facebook.com" className="text-white hover:text-gray-400">
                <FaFacebook size={24} />
              </Link>
              <Link href="https://twitter.com" className="text-white hover:text-gray-400">
                <FaTwitter size={24} />
              </Link>
              <Link href="https://instagram.com" className="text-white hover:text-gray-400">
                <FaInstagram size={24} />
              </Link>
              <Link href="https://linkedin.com" className="text-white hover:text-gray-400">
                <FaLinkedin size={24} />
              </Link>
            </div>
          </div>

          {/* Newsletter */}
          <div className="w-full md:w-1/2 lg:w-1/3">
            <h3 className="text-red-600 text-lg font-bold mb-2">Newsletter</h3>
            <p className="text-sm mb-4">Sign up for our news letter to stay up to date on the latest from Lamid Consulting.</p>
            <div className="flex flex-col sm:flex-row">
              <input 
                type="email" 
                placeholder="your mail here..." 
                className="bg-transparent border-0 rounded-l px-4 py-2 w-full sm:w-2/3 focus:outline-none"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
              />
              <button className="bg-red-600 text-white px-4 py-2 rounded-r uppercase text-sm font-semibold mt-2 sm:mt-0">
                Signup
              </button>
            </div>
          </div>
        </div>

        {/* Quick links */}
        <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-8">
          <Link href="/bizphere" className="bg-red-900 hover:bg-red-800 px-4 py-2 rounded text-white">
            Bizphere
          </Link>
          <Link href="/events" className="bg-red-900 hover:bg-red-800 px-4 py-2 rounded text-white">
            Events
          </Link>
          <Link href="/biz" className="bg-red-900 hover:bg-red-800 px-4 py-2 rounded text-white">
            BIZ
          </Link>
          <Link href="/hcd" className="bg-red-900 hover:bg-red-800 px-4 py-2 rounded text-white">
            HCD
          </Link>
          <Link href="/sd" className="bg-red-900 hover:bg-red-800 px-4 py-2 rounded text-white">
            SD
          </Link>
        </div>

        {/* Contact */}
        <div className="mt-8">
          <h3 className="text-red-600 text-lg font-bold mb-4">Contact Us</h3>
          <div className="flex items-center">
            <FaEnvelope className="mr-2" />
            <a href="mailto:hq@lamidconsulting.com" className="text-white hover:text-gray-400">
              hq@lamidconsulting.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;