
import React, { useEffect, useState, useRef } from 'react';

type CursorType = 'default' | 'clickable' | 'text';

const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [cursorType, setCursorType] = useState<CursorType>('default');
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
    
    // Function to update cursor based on what it's hovering
    const updateCursorType = () => {
      const handlePointerEnter = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        
        // Check if element or its parent has certain classes or attributes
        if (target.closest('button') || 
            target.closest('a') || 
            target.closest('.cursor-pointer') ||
            target.closest('.project-item') ||
            target.closest('[role="button"]') ||
            target.tagName === 'BUTTON' ||
            target.tagName === 'A') {
          setCursorType('clickable');
        } else if (
          target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.getAttribute('contenteditable') === 'true'
        ) {
          setCursorType('text');
        } else {
          setCursorType('default');
        }
      };
      
      document.addEventListener('mouseover', handlePointerEnter);
      return () => document.removeEventListener('mouseover', handlePointerEnter);
    };
    
    // Add event listeners
    document.addEventListener('mousemove', updateCursorPosition);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);
    
    // Start animation loop
    requestRef.current = requestAnimationFrame(animate);
    
    // Set up cursor type detection
    const cleanupCursorType = updateCursorType();

    return () => {
      document.removeEventListener('mousemove', updateCursorPosition);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      
      cleanupCursorType();
      
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [isVisible]);

  return (
    <>
      <div 
        ref={cursorRef}
        className={`custom-cursor fixed pointer-events-none z-50 ${isVisible ? 'opacity-100' : 'opacity-0'} ${
          cursorType === 'clickable' ? 'custom-cursor-clickable' : 
          cursorType === 'text' ? 'custom-cursor-text' : ''
        }`}
      />
      <div 
        ref={followerRef}
        className={`custom-cursor-follower fixed pointer-events-none z-40 ${isVisible ? 'opacity-100' : 'opacity-0'} ${
          cursorType === 'clickable' ? 'custom-cursor-follower-clickable' : 
          cursorType === 'text' ? 'custom-cursor-follower-text' : ''
        }`}
      />
    </>
  );
};

export default CustomCursor;
