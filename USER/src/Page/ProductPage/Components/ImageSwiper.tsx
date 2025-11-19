
import React, { useState } from 'react';

interface ImageSwiperProps {
  images: string[];
  productName: string;
  className?: string;
}

const ImageSwiper: React.FC<ImageSwiperProps> = ({ images, productName, className = '' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const currentImage = imageErrors[currentIndex] || !images[currentIndex]
    ? 'https://via.placeholder.com/400x400/f3f4f6/9ca3af?text=No+Image'
    : images[currentIndex];

  if (images.length === 0) {
    return <div className={`${className} bg-gray-100 flex items-center justify-center`}>
      <span className="text-gray-400">No Image</span>
    </div>;
  }

  return (
    <div className={`relative group overflow-hidden ${className}`}>
      <img
        src={currentImage}
        alt={`${productName} - ${currentIndex + 1}`}
        onError={() => setImageErrors(prev => ({ ...prev, [currentIndex]: true }))}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />

      {images.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-all z-10"
            aria-label="Previous"
          >
            ‹
          </button>
          <button
            onClick={handleNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-all z-10"
            aria-label="Next"
          >
            ›
          </button>

          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setCurrentIndex(i); }}
                className={`w-2 h-2 rounded-full transition-all ${i === currentIndex ? 'bg-white w-8' : 'bg-white/60'}`}
              />
            ))}
          </div>

          <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
            {currentIndex + 1}/{images.length}
          </div>
        </>
      )}
    </div>
  );
};

export default ImageSwiper;