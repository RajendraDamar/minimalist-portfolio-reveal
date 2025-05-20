
import React, { useState, useEffect } from 'react';
import { useMediaQuery } from '@/hooks/useMediaQuery';

const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [followerPosition, setFollowerPosition] = useState({ x: 0, y: 0 });
  const [isClickable, setIsClickable] = useState(false);
  const [isText, setIsText] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const isMobile = useMediaQuery('(max-width: 640px)');
  
  useEffect(() => {
    // Skip cursor customization on mobile devices
    if (isMobile) return;
    
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    
    const updateFollowerPosition = () => {
      setFollowerPosition(prevPos => {
        return {
          x: prevPos.x + (position.x - prevPos.x) * 0.1,
          y: prevPos.y + (position.y - prevPos.y) * 0.1
        };
      });
      requestAnimationFrame(updateFollowerPosition);
    };
    
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
      
      if (!isVisible) {
        setIsVisible(true);
      }
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
    
    // Initialize follower position
    setFollowerPosition({ x: position.x, y: position.y });
    
    // Start animation loop
    const animationId = requestAnimationFrame(updateFollowerPosition);
    
    // Add event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      cancelAnimationFrame(animationId);
    };
  }, [position, isMobile, isVisible]);
  
  if (isMobile) return null;
  
  return (
    <>
      <div 
        className={`custom-cursor ${isClickable ? 'custom-cursor-clickable' : ''} ${isText ? 'custom-cursor-text' : ''}`}
        style={{ 
          left: `${position.x}px`, 
          top: `${position.y}px`,
          opacity: isVisible ? 1 : 0
        }}
      />
      <div 
        className={`custom-cursor-follower ${isClickable ? 'custom-cursor-follower-clickable' : ''} ${isText ? 'custom-cursor-follower-text' : ''}`}
        style={{ 
          left: `${followerPosition.x}px`, 
          top: `${followerPosition.y}px`,
          opacity: isVisible ? 1 : 0
        }}
      />
    </>
  );
};

export default CustomCursor;
