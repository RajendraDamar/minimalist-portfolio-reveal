
import React, { useState, useEffect, useRef } from 'react';
import { useMediaQuery } from '@/hooks/useMediaQuery';

const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isClickable, setIsClickable] = useState(false);
  const [isText, setIsText] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const isMobile = useMediaQuery('(max-width: 640px)');
  
  // Refs for better performance
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  
  useEffect(() => {
    // Skip cursor customization on mobile devices
    if (isMobile) return;
    
    let lastX = 0;
    let lastY = 0;
    let cursorX = 0;
    let cursorY = 0;
    
    // Throttle mousemove updates for better performance
    const updatePosition = (e: MouseEvent) => {
      cursorX = e.clientX;
      cursorY = e.clientY;
      
      // Update main cursor immediately for responsiveness
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
      }
      
      if (!isVisible) {
        setIsVisible(true);
      }
    };
    
    // Smooth follower position with RAF
    const animateFollower = () => {
      // Smoother easing with better performance
      const easeFactor = 0.15; // Higher = faster following, lower = more laggy
      
      // Calculate the distance between current and target
      lastX = lastX + (cursorX - lastX) * easeFactor;
      lastY = lastY + (cursorY - lastY) * easeFactor;
      
      // Update follower with transformed position
      if (followerRef.current) {
        followerRef.current.style.transform = `translate(${lastX}px, ${lastY}px)`;
      }
      
      rafRef.current = requestAnimationFrame(animateFollower);
    };
    
    // Start animation loop
    rafRef.current = requestAnimationFrame(animateFollower);
    
    // Check if cursor is over clickable elements
    const checkClickable = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const clickableElements = ['BUTTON', 'A', 'INPUT', 'TEXTAREA', '[contenteditable="true"]', '[role="button"]'];
      const isClickable = clickableElements.includes(target.tagName) || 
                          target.closest('.cursor-pointer') || 
                          target.closest('.project-item') ||
                          target.closest('.search-toggle') ||
                          target.closest('.search-input') ||
                          target.closest('.like-button') ||
                          target.closest('.share-button');
                          
      const isText = target.tagName === 'INPUT' || 
                     target.tagName === 'TEXTAREA' || 
                     target.hasAttribute('contenteditable');
                     
      setIsClickable(isClickable && !isText);
      setIsText(isText);
    };
    
    // Show cursor on mouse move
    const handleMouseMove = (e: MouseEvent) => {
      updatePosition(e);
      checkClickable(e);
    };
    
    // Hide cursor when leaving window
    const handleMouseLeave = () => {
      setIsVisible(false);
    };
    
    // Show cursor when entering window
    const handleMouseEnter = (e: MouseEvent) => {
      setIsVisible(true);
      updatePosition(e);
    };
    
    // Add event listeners with passive option for better performance
    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    
    // Clean up event listeners and animation frame
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isMobile, isVisible]);
  
  if (isMobile) return null;
  
  return (
    <>
      {/* Immediate cursor - no delay */}
      <div 
        ref={cursorRef}
        className={`custom-cursor ${isClickable ? 'custom-cursor-clickable' : ''} ${isText ? 'custom-cursor-text' : ''}`}
        style={{ 
          opacity: isVisible ? 1 : 0,
          left: '-100px',  // Initial off-screen position
          top: '-100px',
          transform: 'translate(-50%, -50%)' // Center the cursor exactly
        }}
      />
      {/* Follower cursor */}
      <div 
        ref={followerRef}
        className={`custom-cursor-follower ${isClickable ? 'custom-cursor-follower-clickable' : ''} ${isText ? 'custom-cursor-follower-text' : ''}`}
        style={{ 
          opacity: isVisible ? 1 : 0,
          left: '-100px',  // Initial off-screen position
          top: '-100px',
          transform: 'translate(-50%, -50%)' // Center the follower exactly
        }}
      />
    </>
  );
};

export default CustomCursor;
