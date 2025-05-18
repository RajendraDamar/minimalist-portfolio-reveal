
import React, { useEffect, useState, useRef } from 'react';

const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();
  
  const animate = (time: number) => {
    if (previousTimeRef.current !== undefined) {
      if (!cursorRef.current || !followerRef.current) return;
      
      // Get cursor position from CSS variables to avoid layout thrashing
      const x = parseFloat(document.documentElement.style.getPropertyValue('--cursor-x') || '0');
      const y = parseFloat(document.documentElement.style.getPropertyValue('--cursor-y') || '0');
      
      // Update follower position with LERP
      const followerRect = followerRef.current.getBoundingClientRect();
      const followerX = parseFloat(followerRef.current.style.left || '0');
      const followerY = parseFloat(followerRef.current.style.top || '0');
      
      const newX = followerX + (x - followerX) * 0.15;
      const newY = followerY + (y - followerY) * 0.15;
      
      // Only update DOM when there's significant change (optimization)
      if (Math.abs(newX - followerX) > 0.1 || Math.abs(newY - followerY) > 0.1) {
        followerRef.current.style.left = `${newX}px`;
        followerRef.current.style.top = `${newY}px`;
      }
    }
    
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  };
  
  useEffect(() => {
    const updateCursorPosition = (e: MouseEvent) => {
      // Store cursor position in CSS variables to avoid layout thrashing
      document.documentElement.style.setProperty('--cursor-x', `${e.clientX}`);
      document.documentElement.style.setProperty('--cursor-y', `${e.clientY}`);
      
      if (!cursorRef.current) return;
      
      // Update main cursor directly (no animation needed)
      cursorRef.current.style.left = `${e.clientX}px`;
      cursorRef.current.style.top = `${e.clientY}px`;
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    document.addEventListener('mousemove', updateCursorPosition);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);
    
    // Start animation loop
    requestRef.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener('mousemove', updateCursorPosition);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      <div 
        ref={cursorRef}
        className="custom-cursor fixed pointer-events-none z-50 mix-blend-difference"
        style={{ transform: 'translate(-50%, -50%)' }} 
      />
      <div 
        ref={followerRef}
        className="custom-cursor-follower fixed pointer-events-none z-40 mix-blend-difference"
        style={{ transform: 'translate(-50%, -50%)' }}
      />
    </>
  );
};

export default CustomCursor;
