
import React, { useEffect, useState, useRef } from 'react';

const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();
  const positionRef = useRef({ x: 0, y: 0 });
  const followerPositionRef = useRef({ x: 0, y: 0 });
  
  // Don't show custom cursor on mobile/touch devices
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  
  useEffect(() => {
    // Check if device is touch-based
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
    
    // Initialize cursor position to center of screen to prevent initial jump
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    
    if (cursorRef.current) {
      cursorRef.current.style.transform = `translate3d(${centerX}px, ${centerY}px, 0)`;
      positionRef.current = { x: centerX, y: centerY };
    }
    
    if (followerRef.current) {
      followerRef.current.style.transform = `translate3d(${centerX}px, ${centerY}px, 0)`;
      followerPositionRef.current = { x: centerX, y: centerY };
    }
  }, []);
  
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
    // Don't initialize cursor on touch devices
    if (isTouchDevice) return;
    
    // Check if we're in a browser environment
    if (typeof window === 'undefined') return;
    
    const updateCursorPosition = (e: MouseEvent) => {
      // Store mouse position in ref to avoid re-renders
      positionRef.current = { x: e.clientX, y: e.clientY };
      
      // Update main cursor directly for immediate response
      if (cursorRef.current) {
        // Apply transform with no offset to match exact mouse position
        cursorRef.current.style.transform = `translate(-50%, -50%) translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);
    
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
  }, [isTouchDevice]);

  if (isTouchDevice) return null;

  return (
    <>
      <div 
        ref={cursorRef}
        className="custom-cursor fixed pointer-events-none z-50 w-4 h-4 bg-portfolio-white rounded-full transform -translate-x-1/2 -translate-y-1/2"
        style={{ 
          top: 0, 
          left: 0,
          transition: 'opacity 0.2s ease-in-out',
          opacity: isVisible ? 0.7 : 0 
        }}
      />
      <div 
        ref={followerRef}
        className="custom-cursor-follower fixed pointer-events-none z-40 w-12 h-12 border border-portfolio-white rounded-full transform -translate-x-1/2 -translate-y-1/2"
        style={{ 
          top: 0, 
          left: 0,
          transition: 'opacity 0.2s ease-in-out',
          opacity: isVisible ? 0.5 : 0 
        }}
      />
    </>
  );
};

export default CustomCursor;
