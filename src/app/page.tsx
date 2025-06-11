"use client"; // This directive is necessary for using hooks like useState and useEffect

import { useState, useEffect } from 'react';
import Image from "next/image"; // Import Next.js Image component
import "./globals.css";
import { FaExclamationTriangle } from "react-icons/fa";
import localFont from 'next/font/local';
import BottomNavigation from './components/BottomNavigation';

const customFont = localFont({
  src: '../fonts/FOT-Rodin Pro B.otf',
  display: 'swap',
  variable: '--font-custom'
});

export default function Home() {
  const [cursorPosition, setCursorPosition] = useState({ x: -100, y: -100 }); 
  const [isPointerVisible, setIsPointerVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setCursorPosition({ x: event.clientX, y: event.clientY });
    };

    const handleMouseEnter = () => {
      setIsPointerVisible(true);
    };

    const handleMouseLeave = () => {
      setIsPointerVisible(false);
    };

    // Add event listeners
    document.documentElement.addEventListener('mousemove', handleMouseMove);
    document.documentElement.addEventListener('mouseenter', handleMouseEnter);
    document.documentElement.addEventListener('mouseleave', handleMouseLeave);

    // Clean up event listeners on component unmount
    return () => {
      document.documentElement.removeEventListener('mousemove', handleMouseMove);
      document.documentElement.removeEventListener('mouseenter', handleMouseEnter);
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <>
      {isPointerVisible && (
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
          }}
        />
      )}
      <div className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="flex flex-col items-center justify-center mt-20">
          <div className="flex items-center mt-4">
            <FaExclamationTriangle className="h-8 w-8 mr-2" />
            <h1 className={`text-4xl ${customFont.className}`}>Sebastian Garcia&apos;s Portfolio</h1>
          </div>
          <div className="text-center mt-20 mb-10">
            <p className="text-lg mb-2">Lorem Ipsum whatever</p>
            <p className="text-xl mb-2">This site is still under construction!</p>
            <p className="text-lg">Check in frequently for updates.</p>
          </div>
          <div className="text-center mb-12">
            <p className="text-sm text-gray-500">Share the website link:</p>
            <a
              href="https://sebastiangarcia.dev"
              className="text-2xl text-blue-500 hover:text-blue-700 transition-colors font-medium"
              target="_blank"
              rel="noopener noreferrer"
            >
              sebastiangarcia.dev
            </a>
          </div>
          <BottomNavigation />
        </div>
      </div>
    </>
  );
}
