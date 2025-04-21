import { useState, useEffect } from 'react';

export default function BizSphereModal({ isOpen, onClose }) {
  const [isVisible, setIsVisible] = useState(isOpen);

  useEffect(() => {
    setIsVisible(isOpen);
  }, [isOpen]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-md shadow-lg w-full max-w-md relative animate-fadeIn">
        {/* Close button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 bg-black text-white p-1 rounded-md hover:bg-gray-800"
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        
        {/* Modal content */}
        <div className="py-12 px-6 text-center">
          {/* Logo and dots */}
          <div className="flex justify-center mb-2">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-red-700"></div>
              <div className="h-2 w-2 rounded-full bg-red-300"></div>
              <div className="h-2 w-2 rounded-full bg-gray-300"></div>
              <div className="h-2 w-2 border border-black"></div>
            </div>
          </div>
          
          {/* Brand name */}
          <div className="flex flex-col items-center mb-6">
            <h2 className="text-lg font-bold tracking-wider text-black">BIZSPHERE</h2>
            <p className="text-xs text-black">it's all about business</p>
          </div>
          
          {/* Main text */}
          <p className="mb-8 text-sm md:text-base text-black">
            The exclusive online networking <span className="text-red-600 font-medium">marketplace</span>, where sellers meet buyers, and exchange services and products
          </p>
          
          {/* CTA button */}
          <button 
            className="bg-red-800 hover:bg-red-900 text-white py-2 px-8 rounded transition-colors w-full sm:w-auto"
            onClick={onClose}
          >
            Join our Community
          </button>
        </div>
      </div>
    </div>
  );
}