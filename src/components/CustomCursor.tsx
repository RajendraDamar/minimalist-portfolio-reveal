
import React, { useEffect, useState } from 'react';

const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [followerPosition, setFollowerPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateCursorPosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const updateCursorFollowerPosition = () => {
      setFollowerPosition((prev) => ({
        x: prev.x + (position.x - prev.x) * 0.2,
        y: prev.y + (position.y - prev.y) * 0.2,
      }));
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    document.addEventListener('mousemove', updateCursorPosition);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    const followerInterval = setInterval(updateCursorFollowerPosition, 10);

    return () => {
      document.removeEventListener('mousemove', updateCursorPosition);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      clearInterval(followerInterval);
    };
  }, [position]);

  if (!isVisible) return null;

  return (
    <>
      <div 
        className="custom-cursor fixed pointer-events-none z-50 mix-blend-difference bg-portfolio-white"
        style={{ 
          left: `${position.x}px`, 
          top: `${position.y}px`,
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
        }} 
      />
      <div 
        className="custom-cursor-follower fixed pointer-events-none z-40 mix-blend-difference"
        style={{ 
          left: `${followerPosition.x}px`, 
          top: `${followerPosition.y}px`,
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          border: '1px solid #FFFFFF',
          transform: 'translate(-50%, -50%)',
        }} 
      />
    </>
  );
};

export default CustomCursor;
