import React from 'react';
import { Link } from 'react-router-dom';

const BrandLogo: React.FC = () => {
  return (
    <Link to="/dashboard" className="block"> 
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center justify-center w-10 h-10 bg-gray-900 rounded-lg">
          <svg 
            className="w-6 h-6 text-white" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" 
            />
          </svg>
        </div>
        
        {/* Animated Brand Name */}
        <div className="relative overflow-hidden">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight animate-fade-in">
            Vạn Dinh
          </h1>
          <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-gray-900 to-gray-600 animate-slide-right" 
               style={{ width: '100%' }} />
        </div>
      </div>
    </Link>
  );
};

export default BrandLogo;