
import React, { useState, useEffect } from 'react';

interface SlideshowProps {
  images: string[];
  interval?: number;
}

const Slideshow: React.FC<SlideshowProps> = ({ images, interval = 4000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        setIsTransitioning(false);
      }, 500); // Match this with the CSS transition time
    }, interval);

    return () => clearInterval(timer);
  }, [images.length, interval]);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {images.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          } ${isTransitioning && index === currentIndex ? 'animate-fade-out' : ''} ${
            isTransitioning && index === (currentIndex + 1) % images.length ? 'animate-fade-in' : ''
          }`}
        >
          <img
            src={image}
            alt={`Slideshow ${index}`}
            className="w-full h-full object-cover"
          />
        </div>
      ))}
      <div className="absolute inset-0 bg-portfolio-charcoal opacity-40" />
    </div>
  );
};

export default Slideshow;
