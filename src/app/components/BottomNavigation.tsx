'use client';
import React from 'react';
import { HomeIcon } from '@radix-ui/react-icons';
import { CursorArrowIcon } from '@radix-ui/react-icons';

interface BottomNavigationProps {
  isVisible: boolean;
  isScrolled: boolean;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({ isVisible, isScrolled }) => {
  const playClickSound = () => {
    const audio = new Audio('/audio_button-select.mp3');
    audio.play().catch(error => console.log('Audio play failed:', error));
  };

  const scrollToSection = (sectionId: string) => {
    playClickSound();
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!isVisible) {
    return (
      <div className="flex flex-row items-center justify-center text-4xl yx-12 animate-[pulse_2s_ease-in-out_infinite] opacity-20 hover:opacity-100">
        <p className="mr-2">Click</p>
        <CursorArrowIcon className="h-8 w-8 mx-2 hover:text-gray-400 transition-colors" />
        <p className="ml-2">anywhere to continue.</p>
      </div>
    );
  }

  return (
    <nav className={`fixed right-4 top-1/2 transform -translate-y-1/2 aero-navbar rounded-lg z-50 transition-all duration-300 ${
      isScrolled ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
    }`}>
      <div className="flex flex-col items-center space-y-6 py-6 px-3">
        <button
          onClick={() => {
            playClickSound();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex flex-col items-center text-gray-700 hover:text-blue-600 transition-colors duration-200 group"
          title="Go to top"
        >
          <HomeIcon className="h-5 w-5" />
          <div className="w-0 group-hover:w-full h-0.5 bg-blue-600 transition-all duration-200"></div>
        </button>
        
        <button
          onClick={() => scrollToSection('about')}
          className="flex flex-col items-center text-gray-700 hover:text-blue-600 transition-colors duration-200 group"
        >
          <span className="text-sm font-medium">About</span>
          <div className="w-0 group-hover:w-full h-0.5 bg-blue-600 transition-all duration-200"></div>
        </button>
        
        <button
          onClick={() => scrollToSection('skills')}
          className="flex flex-col items-center text-gray-700 hover:text-blue-600 transition-colors duration-200 group"
        >
          <span className="text-sm font-medium">Skills</span>
          <div className="w-0 group-hover:w-full h-0.5 bg-blue-600 transition-all duration-200"></div>
        </button>
        
        <button
          onClick={() => scrollToSection('projects')}
          className="flex flex-col items-center text-gray-700 hover:text-blue-600 transition-colors duration-200 group"
        >
          <span className="text-sm font-medium">Projects</span>
          <div className="w-0 group-hover:w-full h-0.5 bg-blue-600 transition-all duration-200"></div>
        </button>
        
        <button
          onClick={() => scrollToSection('contact')}
          className="flex flex-col items-center text-gray-700 hover:text-blue-600 transition-colors duration-200 group"
        >
          <span className="text-sm font-medium">Contact</span>
          <div className="w-0 group-hover:w-full h-0.5 bg-blue-600 transition-all duration-200"></div>
        </button>
      </div>
    </nav>
  );
};

export default BottomNavigation;