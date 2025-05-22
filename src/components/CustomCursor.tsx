
import React, { useState, useEffect, useRef } from 'react';
import { useMediaQuery } from '@/hooks/useMediaQuery';

const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [followerPosition, setFollowerPosition] = useState({ x: 0, y: 0 });
  const [isClickable, setIsClickable] = useState(false);
  const [isText, setIsText] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const isMobile = useMediaQuery('(max-width: 640px)');
  
  // Use refs for better performance
  const positionRef = useRef(position);
  const followerPositionRef = useRef(followerPosition);
  const isClickableRef = useRef(isClickable);
  const isTextRef = useRef(isText);
  const isVisibleRef = useRef(isVisible);
  const rafRef = useRef<number | null>(null);
  
  // Debounce mouse move events for better performance
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    // Skip cursor customization on mobile devices
    if (isMobile) return;
    
    const updatePosition = (e: MouseEvent) => {
      // Update position immediately for responsive cursor
      const newPosition = { x: e.clientX, y: e.clientY };
      setPosition(newPosition);
      positionRef.current = newPosition;
      
      // Debounce clickable check for better performance
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
      
      debounceTimeout.current = setTimeout(() => {
        checkClickable(e);
      }, 50); // Small debounce for performance
      
      if (!isVisibleRef.current) {
        setIsVisible(true);
        isVisibleRef.current = true;
      }
    };
    
    // Optimize follower position updates with RAF
    const updateFollowerPosition = () => {
      const currentPosition = positionRef.current;
      const currentFollowerPosition = followerPositionRef.current;
      
      // Use a faster animation for smoother following (0.2 instead of 0.1)
      const newFollowerPosition = {
        x: currentFollowerPosition.x + (currentPosition.x - currentFollowerPosition.x) * 0.2,
        y: currentFollowerPosition.y + (currentPosition.y - currentFollowerPosition.y) * 0.2
      };
      
      setFollowerPosition(newFollowerPosition);
      followerPositionRef.current = newFollowerPosition;
      
      rafRef.current = requestAnimationFrame(updateFollowerPosition);
    };
    
    // Check if cursor is over clickable elements
    const checkClickable = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const clickableElements = ['BUTTON', 'A', 'INPUT', 'TEXTAREA', '[contenteditable="true"]', '[role="button"]'];
      const isElementClickable = clickableElements.includes(target.tagName) || 
                        target.closest('.cursor-pointer') || 
                        target.closest('.project-item') ||
                        target.closest('.search-toggle') ||
                        target.closest('.search-input') ||
                        target.closest('.like-button') ||
                        target.closest('.share-button');
                        
      const isElementText = target.tagName === 'INPUT' || 
                   target.tagName === 'TEXTAREA' || 
                   target.hasAttribute('contenteditable');
                   
      if (isElementClickable !== isClickableRef.current) {
        setIsClickable(isElementClickable && !isElementText);
        isClickableRef.current = isElementClickable && !isElementText;
      }
      
      if (isElementText !== isTextRef.current) {
        setIsText(isElementText);
        isTextRef.current = isElementText;
      }
    };
    
    // Hide cursor when leaving window
    const handleMouseLeave = () => {
      setIsVisible(false);
      isVisibleRef.current = false;
    };
    
    // Show cursor when entering window
    const handleMouseEnter = (e: MouseEvent) => {
      setIsVisible(true);
      isVisibleRef.current = true;
      
      const newPosition = { x: e.clientX, y: e.clientY };
      setPosition(newPosition);
      positionRef.current = newPosition;
    };
    
    // Initialize follower position
    followerPositionRef.current = position;
    
    // Start animation loop
    rafRef.current = requestAnimationFrame(updateFollowerPosition);
    
    // Throttle mousemove events for better performance
    let lastTime = 0;
    const throttledMouseMove = (e: MouseEvent) => {
      const now = performance.now();
      if (now - lastTime > 10) { // Throttle to every ~10ms for smoother performance
        lastTime = now;
        updatePosition(e);
      }
    };
    
    // Add event listeners
    document.addEventListener('mousemove', throttledMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    
    // Clean up event listeners and animation frame
    return () => {
      document.removeEventListener('mousemove', throttledMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [isMobile, position]);
  
  // Don't render anything on mobile
  if (isMobile) return null;
  
  return (
    <>
      {/* Immediate cursor - no delay */}
      <div 
        className={`custom-cursor ${isClickable ? 'custom-cursor-clickable' : ''} ${isText ? 'custom-cursor-text' : ''}`}
        style={{ 
          left: `${position.x}px`, 
          top: `${position.y}px`,
          opacity: isVisible ? 1 : 0,
          transform: 'translate(-50%, -50%)', // Center the cursor exactly on the mouse pointer
          pointerEvents: 'none', // Ensure it doesn't interfere with clicking
          willChange: 'transform' // Performance optimization
        }}
      />
      {/* Follower cursor */}
      <div 
        className={`custom-cursor-follower ${isClickable ? 'custom-cursor-follower-clickable' : ''} ${isText ? 'custom-cursor-follower-text' : ''}`}
        style={{ 
          left: `${followerPosition.x}px`, 
          top: `${followerPosition.y}px`,
          opacity: isVisible ? 1 : 0,
          transform: 'translate(-50%, -50%)', // Center the follower exactly
          pointerEvents: 'none', // Performance optimization
          willChange: 'transform' // Performance optimization
        }}
      />
    </>
  );
};

export default CustomCursor;
