
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
      
      // Only update DOM when needed
      followerRef.current.style.transform = `translate3d(${followerPositionRef.current.x}px, ${followerPositionRef.current.y}px, 0)`;
    }
    
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  };
  
  useEffect(() => {
    const updateCursorPosition = (e: MouseEvent) => {
      // Store position in ref to avoid re-renders
      positionRef.current = { x: e.clientX, y: e.clientY };
      
      // Update main cursor directly without animation
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    document.addEventListener('mousemove', updateCursorPosition);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);
    
    // Initialize follower position
    if (followerRef.current) {
      followerPositionRef.current = { x: 0, y: 0 };
    }
    
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

  return (
    <>
      <div 
        ref={cursorRef}
        className="custom-cursor fixed pointer-events-none z-50"
      />
      <div 
        ref={followerRef}
        className="custom-cursor-follower fixed pointer-events-none z-40"
      />
    </>
  );
};

export default CustomCursor;
