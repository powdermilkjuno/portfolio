'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';

const CustomCursor: React.FC = () => {
  const [cursorPosition, setCursorPosition] = useState({ x: -100, y: -100 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      // Use requestAnimationFrame for smoother cursor movement
      requestAnimationFrame(() => {
        setCursorPosition({ x: event.clientX, y: event.clientY });
      });
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    // Add event listeners with passive option for better performance
    document.documentElement.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.documentElement.addEventListener('mouseenter', handleMouseEnter);
    document.documentElement.addEventListener('mouseleave', handleMouseLeave);

    // Clean up event listeners on component unmount
    return () => {
      document.documentElement.removeEventListener('mousemove', handleMouseMove);
      document.documentElement.removeEventListener('mouseenter', handleMouseEnter);
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <Image
      src="/PointerP1.svg"
      alt="Custom Cursor"
      width={64}
      height={64}
      style={{
        position: 'fixed',
        left: `${cursorPosition.x}px`,
        top: `${cursorPosition.y}px`,
        pointerEvents: 'none',
        transform: 'translate(-25px, -10px)',
        zIndex: 9999,
        transition: 'none',
      }}
    />
  );
};

export default CustomCursor; 