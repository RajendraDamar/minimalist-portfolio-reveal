
import React, { useEffect, useState, useRef } from 'react';

const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();
  const positionRef = useRef({ x: 0, y: 0 });
  const followerPositionRef = useRef({ x: 0, y: 0 });
  
  const animate = (time: number) => {
    if (previousTimeRef.current !== undefined) {
      if (!followerRef.current) return;
      
      // Calculate new follower position with smoother LERP
      followerPositionRef.current.x += (positionRef.current.x - followerPositionRef.current.x) * 0.1;
      followerPositionRef.current.y += (positionRef.current.y - followerPositionRef.current.y) * 0.1;
      
      // Update DOM with transform3d for better performance
      followerRef.current.style.transform = `translate3d(${followerPositionRef.current.x}px, ${followerPositionRef.current.y}px, 0)`;
    }
    
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  };
  
  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') return;
    
    const updateCursorPosition = (e: MouseEvent) => {
      // Store mouse position in ref to avoid re-renders
      positionRef.current = { x: e.clientX, y: e.clientY };
      
      // Update main cursor directly for immediate response
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
      
      // Set visibility on first mouse movement
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    // Initialize positions to prevent cursor jumping on load
    positionRef.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    followerPositionRef.current = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    
    // Add event listeners
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
  }, [isVisible]);

  return (
    <>
      <div 
        ref={cursorRef}
        className={`custom-cursor fixed pointer-events-none z-50 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      />
      <div 
        ref={followerRef}
        className={`custom-cursor-follower fixed pointer-events-none z-40 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      />
    </>
  );
};

export default CustomCursor;
