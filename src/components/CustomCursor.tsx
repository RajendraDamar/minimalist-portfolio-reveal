
import React, { useEffect, useState, useRef } from 'react';

type CursorType = 'default' | 'clickable' | 'text';

const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [cursorType, setCursorType] = useState<CursorType>('default');
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
        cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);
    
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
            target.tagName === 'A' ||
            target.closest('.search-toggle') ||
            target.closest('.like-button') ||
            target.closest('.share-button')) {
          setCursorType('clickable');
        } else if (
          target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.getAttribute('contenteditable') === 'true' ||
          target.closest('.search-input')
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
  }, [isTouchDevice]);

  if (isTouchDevice) return null;

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
