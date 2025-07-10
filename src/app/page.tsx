"use client"; // This directive is necessary for using hooks like useState and useRef

import { useState, useRef, useEffect } from 'react';
import "./globals.css";
import { FaExclamationTriangle } from "react-icons/fa";
import { CursorArrowIcon } from '@radix-ui/react-icons';
import localFont from 'next/font/local';
import BottomNavigation from './components/BottomNavigation';
import CustomCursor from './components/CustomCursor';

const customFont = localFont({
  src: '../fonts/FOT-Rodin Pro B.otf',
  display: 'swap',
  variable: '--font-custom'
});

export default function Home() {
  const [isFadingOut, setIsFadingOut] = useState(false); // State to control the fade
  const [showNewContent, setShowNewContent] = useState(false); // State to show new content
  const [isNavbarVisible, setIsNavbarVisible] = useState(false); // State to show navbar
  const [isScrolled, setIsScrolled] = useState(false); // State to track scroll
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set()); // Track visible sections
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const [imageScale, setImageScale] = useState(1);
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set());
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Function to handle the click and start the fade-out
  const handlePageClick = () => {
    // Play the audio
    if (audioRef.current) {
      audioRef.current.play();
    }
    
    // Start fade out
    setIsFadingOut(true);
    
    // After fade out completes, show new content and navbar
    setTimeout(() => {
      setShowNewContent(true);
      setIsNavbarVisible(true);
    }, 1000); // Match the transition duration
  };

  // Optimized scroll detection and section visibility
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          setIsScrolled(scrollY > 100);

          // Only check visibility if we have visible sections
          if (showNewContent) {
            const sections = ['welcome', 'about', 'skills', 'projects', 'contact'];
            const newVisibleSections = new Set<string>();

            sections.forEach(sectionId => {
              const element = document.getElementById(sectionId);
              if (element) {
                const rect = element.getBoundingClientRect();
                const isVisible = rect.top < window.innerHeight * 0.8 && rect.bottom > 0;
                if (isVisible) {
                  newVisibleSections.add(sectionId);
                }
              }
            });

            setVisibleSections(newVisibleSections);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    if (showNewContent) {
      window.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll(); // Check initial state
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [showNewContent]);

  return (
    <>
      {/* Audio element */}
      <audio ref={audioRef} src="/audio_button-select.mp3" preload="auto" />
      
      {/* Custom Cursor */}
      <CustomCursor />
      
      {/* CRT Effects - only show when new content is visible */}
      {showNewContent && (
        <>
          <div className="crt-vignette"></div>
          <div className="crt-curvature"></div>
          <div className="crt-scanlines-page"></div>
        </>
      )}
      
      {/* Initial content */}
      {!showNewContent && (
        <div
          onClick={handlePageClick}
          className={`transition-opacity duration-1000 ${isFadingOut ? 'opacity-0' : 'opacity-100'}`}
        >
          <div className="flex min-h-screen flex-col items-center justify-between p-24">
            <div className="flex flex-col items-center justify-center mt-20">
              <div className="flex items-center mt-4">
                <FaExclamationTriangle className="h-14 w-14 mr-2" />
                <h1 className={`text-5xl ${customFont.className}`}>Sebastian Garcia&apos;s Portfolio</h1>
              </div>
              <div className="text-center mt-20 mb-10">
                <p className="text-3xl mb-2">Hi I&apos;m Seba!</p>
                <p className="text-3xl mb-2 p-4">I&apos;m a CS major at UCF!</p>
                <p className="text-3xl">Let me know any thoughts about the site.</p>
              </div>
              <div className="text-center mb-12">
                <p className="text-sm text-gray-500">Share the website link:</p>
                <a
                  href="https://sebastiangarcia.dev"
                  className="text-2xl text-white hover:text-blue-700 transition-colors font-medium"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  sebastiangarcia.dev
                </a>
              </div>
              <div className="flex flex-row items-center justify-center text-4xl animate-[pulse_2s_ease-in-out_infinite] opacity-20 hover:opacity-100 transition-opacity duration-300">
                <p className="mr-2">Click</p>
                <CursorArrowIcon className="h-8 w-8 mx-2" />
                <p className="ml-2">anywhere to continue.</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* New content that fades in */}
      {showNewContent && (
        <div className="animate-fade-in bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200">
          {/* Welcome Section */}
          <section 
            id="welcome" 
            className={`min-h-screen flex flex-col items-center justify-center p-12 transition-all duration-1000 ${
              visibleSections.has('welcome') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <div className="flex flex-col items-center justify-center">
              <div className="flex items-center mt-4">
                <FaExclamationTriangle className="h-14 w-14 mr-2 text-blue-600" />
                <h1 className={`text-5xl ${customFont.className} text-blue-600`}>Welcome to My Portfolio!</h1>
              </div>
                                            <div className="text-center mb-12">
                <p className="text-sm text-gray-600 mb-4 p-4">Click on the boxes to navigate to the different sections:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
                  <button 
                    onClick={() => {
                      if (audioRef.current) {
                        audioRef.current.currentTime = 0;
                        audioRef.current.play().catch(error => console.log('Audio play failed:', error));
                      }
                      document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="aero-card p-6 hover:scale-105 transition-all duration-300 cursor-pointer w-full text-left"
                  >
                    <div className="relative z-10">
                      <h3 className="text-xl font-bold mb-2 text-blue-600">About Me</h3>
                      <p className="text-gray-700">Learn more about who I am</p>
                    </div>
                  </button>
                  <button 
                    onClick={() => {
                      if (audioRef.current) {
                        audioRef.current.currentTime = 0;
                        audioRef.current.play().catch(error => console.log('Audio play failed:', error));
                      }
                      document.getElementById('skills')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="aero-card p-6 hover:scale-105 transition-all duration-300 cursor-pointer w-full text-left"
                  >
                    <div className="relative z-10">
                      <h3 className="text-xl font-bold mb-2 text-blue-600">Skills & Expertise</h3>
                      <p className="text-gray-700">View my technical skills and technologies</p>
                    </div>
                  </button>
                  <button 
                    onClick={() => {
                      if (audioRef.current) {
                        audioRef.current.currentTime = 0;
                        audioRef.current.play().catch(error => console.log('Audio play failed:', error));
                      }
                      document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="aero-card p-6 hover:scale-105 transition-all duration-300 cursor-pointer w-full text-left"
                  >
                    <div className="relative z-10">
                      <h3 className="text-xl font-bold mb-2 text-blue-600">Featured Projects</h3>
                      <p className="text-gray-700">Explore my latest work and creations</p>
                    </div>
                  </button>
                  <button 
                    onClick={() => {
                      if (audioRef.current) {
                        audioRef.current.currentTime = 0;
                        audioRef.current.play().catch(error => console.log('Audio play failed:', error));
                      }
                      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="aero-card p-6 hover:scale-105 transition-all duration-300 cursor-pointer w-full text-left"
                  >
                    <div className="relative z-10">
                      <h3 className="text-xl font-bold mb-2 text-blue-600">Get In Touch</h3>
                      <p className="text-gray-700">Connect with me and start a conversation</p>
                    </div>
                  </button>
                </div>
                
                {/* Social and Resume Buttons */}
                <div className="flex flex-wrap justify-center gap-4 mt-8">
                  <button 
                    onClick={() => {
                      if (audioRef.current) {
                        audioRef.current.currentTime = 0;
                        audioRef.current.play().catch(error => console.log('Audio play failed:', error));
                      }
                      window.open('https://github.com/powdermilkjuno', '_blank', 'noopener,noreferrer');
                    }}
                    className="aero-card p-4 hover:scale-105 transition-all duration-300 cursor-pointer"
                  >
                    <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  <button 
                    onClick={() => {
                      if (audioRef.current) {
                        audioRef.current.currentTime = 0;
                        audioRef.current.play().catch(error => console.log('Audio play failed:', error));
                      }
                      window.open('https://www.linkedin.com/in/sebastian-gdev/', '_blank', 'noopener,noreferrer');
                    }}
                    className="aero-card p-4 hover:scale-105 transition-all duration-300 cursor-pointer"
                  >
                    <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  <button 
                    onClick={() => {
                      if (audioRef.current) {
                        audioRef.current.currentTime = 0;
                        audioRef.current.play().catch(error => console.log('Audio play failed:', error));
                      }
                      window.open('/sebastiangarcia-resume.pdf', '_blank', 'noopener,noreferrer');
                    }}
                    className="aero-card p-4 hover:scale-105 transition-all duration-300 cursor-pointer"
                  >
                    <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* About Me Section */}
          <section 
            id="about" 
            className={`min-h-screen flex flex-col items-center justify-center p-12 transition-all duration-1000 ${
              visibleSections.has('about') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <div className="text-center">
              <h2 className={`text-4xl ${customFont.className} text-blue-600 mb-8`}>About Me</h2>
              <div className="flex flex-col lg:flex-row items-center justify-center gap-12 max-w-6xl">
                {/* CRT Frame with Picture */}
                <div className="relative">
                  <div className="crt-tv bg-black p-6 rounded-3xl border-4 border-gray-800 hover:border-blue-500 transition-colors shadow-2xl relative overflow-hidden transform rotate-3">
                    <div className="crt-screen bg-gray-900 rounded-2xl p-3 relative">
                      <div className="crt-static absolute inset-0 opacity-20"></div>
                      <div className="crt-scanlines absolute inset-0"></div>
                      <div className="relative z-10 flex items-center justify-center">
                        {/* Sebastian's picture */}
                        <img 
                          src="/sebapicture.jpg" 
                          alt="Sebastian Garcia" 
                          className="max-w-full max-h-full object-contain rounded-sm border-2 border-blue-400 transition-all duration-300 hover:border-blue-300 hover:shadow-2xl cursor-pointer"
                          style={{
                            transform: `scale(${imageScale}) translate(${mouseX * 0.02}px, ${mouseY * 0.02}px)`,
                          }}
                          onMouseMove={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            const x = e.clientX - rect.left - rect.width / 2;
                            const y = e.clientY - rect.top - rect.height / 2;
                            setMouseX(x);
                            setMouseY(y);
                          }}
                          onMouseLeave={() => {
                            setMouseX(0);
                            setMouseY(0);
                          }}
                          onClick={() => {
                            setImageScale(imageScale === 1 ? 1.5 : 1);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  {/* Sebamii circle outside the frame */}
                  <div className="absolute -bottom-8 -right-8 z-20 w-24 h-24 bg-white rounded-full border-4 border-blue-500 shadow-lg flex items-center justify-center">
                    <img 
                      src="/sebamii.png" 
                      alt="Sebamii" 
                      className="w-20 h-20 object-contain rounded-full"
                    />
                  </div>
                </div>
                
                {/* About Me Content */}
                <div className="aero-card p-8 max-w-lg">
                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold mb-6 text-blue-600">Who I Am</h3>
                    <div className="space-y-4 text-gray-700 text-left">
                      <p>
                        Hi! I&apos;m Sebastian Garcia, a passionate full-stack developer with a love for creating 
                        beautiful, functional, and user-friendly applications. I enjoy turning complex problems 
                        into simple, elegant solutions.
                      </p>
                      <p>
                        With a background in both frontend and backend development, I specialize in modern 
                        web technologies and love experimenting with new frameworks and tools. When I&apos;m not 
                        coding, you can find me exploring new technologies, contributing to open-source 
                        projects, or sharing knowledge with the developer community.
                      </p>
                      <p>
                        I believe in writing clean, maintainable code and creating experiences that users 
                        love to interact with. Every project is an opportunity to learn something new and 
                        push the boundaries of what&apos;s possible on the web.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Skills Section */}
          <section 
            id="skills" 
            className={`min-h-screen flex flex-col items-center justify-center p-12 aero-section transition-all duration-1000 ${
              visibleSections.has('skills') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <div className="text-center">
              <h2 className={`text-4xl ${customFont.className} text-blue-600 mb-8`}>My Skills</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl">
                <div className="aero-card p-6 hover:scale-105 transition-all duration-300">
                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold mb-4 text-blue-600">Frontend</h3>
                    <ul className="text-gray-700 space-y-2">
                      <li>React & Next.js</li>
                      <li>TypeScript</li>
                      <li>Tailwind CSS</li>
                      <li>JavaScript</li>
                    </ul>
                  </div>
                </div>
                <div className="aero-card p-6 hover:scale-105 transition-all duration-300">
                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold mb-4 text-blue-600">Backend</h3>
                    <ul className="text-gray-700 space-y-2">
                      <li>Node.js</li>
                      <li>Python</li>
                      <li>SQL</li>
                      <li>MongoDB</li>
                    </ul>
                  </div>
                </div>
                <div className="aero-card p-6 hover:scale-105 transition-all duration-300">
                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold mb-4 text-blue-600">Design</h3>
                    <ul className="text-gray-700 space-y-2">
                      <li>Figma</li>
                      <li>Character Design</li>
                      <li>Concept Art</li>
                      <li>UI/UX Design</li>
                    </ul>
                  </div>
                </div>
                <div className="aero-card p-6 hover:scale-105 transition-all duration-300">
                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold mb-4 text-blue-600">Tools</h3>
                    <ul className="text-gray-700 space-y-2">
                      <li>Git & GitHub</li>
                      <li>Node.js</li>
                      <li>AWS</li>
                      <li>VS Code</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Projects Section */}
          <section 
            id="projects" 
            className={`min-h-screen flex flex-col items-center justify-center p-12 transition-all duration-1000 ${
              visibleSections.has('projects') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <div className="text-center">
              <h2 className={`text-4xl ${customFont.className} text-blue-600 mb-8`}>Featured Projects</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl">
                {/* Project cards with uniform sizing */}
                <div className="flex flex-col h-80">
                  <div 
                    className={`crt-tv bg-black p-6 rounded-lg border-4 border-gray-800 hover:border-blue-500 transition-all duration-500 shadow-2xl relative overflow-hidden cursor-pointer flex-1 ${
                      flippedCards.has('pallit') ? 'flipped' : ''
                    }`}
                    onClick={() => {
                      if (audioRef.current) {
                        audioRef.current.currentTime = 0;
                        audioRef.current.play().catch(error => console.log('Audio play failed:', error));
                      }
                      const newFlipped = new Set(flippedCards);
                      if (newFlipped.has('pallit')) {
                        newFlipped.delete('pallit');
                      } else {
                        newFlipped.add('pallit');
                      }
                      setFlippedCards(newFlipped);
                    }}
                    style={{
                      transformStyle: 'preserve-3d',
                      transform: flippedCards.has('pallit') ? 'rotateY(180deg)' : 'rotateY(0deg)',
                    }}
                  >
                    <div className="crt-screen bg-gray-900 rounded-sm p-4 mb-4 relative h-full">
                      <div className="crt-static absolute inset-0 opacity-20"></div>
                      <div className="crt-scanlines absolute inset-0"></div>
                      <div className="relative z-10 h-full flex flex-col">
                        {!flippedCards.has('pallit') ? (
                          <>
                            <h3 className="text-xl font-bold mb-4 text-blue-400 font-mono">Pallit</h3>
                            <p className="text-gray-300 mb-4 text-sm flex-1">A collaborative palette creation and sharing platform for designers and artists. This project would assist with frontend development skills.</p>
                            <div className="flex flex-wrap gap-2 mt-auto">
                              <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded font-mono">React</span>
                              <span className="px-2 py-1 bg-blue-700 text-white text-xs rounded font-mono">Node.js</span>
                              <span className="px-2 py-1 bg-blue-500 text-white text-xs rounded font-mono">TypeScript</span>
                            </div>
                          </>
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <img 
                              src="/pallitlogo.svg" 
                              alt="Pallit Logo" 
                              className="w-32 h-32 object-contain transition-transform duration-500"
                              style={{
                                transform: flippedCards.has('pallit') ? 'rotateY(180deg)' : 'rotateY(0deg)',
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col h-80">
                  <div 
                    className={`crt-tv bg-black p-6 rounded-lg border-4 border-gray-800 hover:border-blue-500 transition-all duration-500 shadow-2xl relative overflow-hidden cursor-pointer flex-1 ${
                      flippedCards.has('taskflow') ? 'flipped' : ''
                    }`}
                    onClick={() => {
                      if (audioRef.current) {
                        audioRef.current.currentTime = 0;
                        audioRef.current.play().catch(error => console.log('Audio play failed:', error));
                      }
                      const newFlipped = new Set(flippedCards);
                      if (newFlipped.has('taskflow')) {
                        newFlipped.delete('taskflow');
                      } else {
                        newFlipped.add('taskflow');
                      }
                      setFlippedCards(newFlipped);
                    }}
                    style={{
                      transformStyle: 'preserve-3d',
                      transform: flippedCards.has('taskflow') ? 'rotateY(180deg)' : 'rotateY(0deg)',
                    }}
                  >
                    <div className="crt-screen bg-gray-900 rounded-sm p-4 mb-4 relative h-full">
                      <div className="crt-static absolute inset-0 opacity-20"></div>
                      <div className="crt-scanlines absolute inset-0"></div>
                      <div className="relative z-10 h-full flex flex-col">
                        {!flippedCards.has('taskflow') ? (
                          <>
                            <h3 className="text-xl font-bold mb-4 text-blue-400 font-mono">Last Meal Protocol Club</h3>
                            <p className="text-gray-300 mb-4 text-sm flex-1">A tamagotchi-style calorie counter with social integration and friend features. Track your meals, maintain your virtual pet, and connect with friends.</p>
                            <div className="flex flex-wrap gap-2 mt-auto">
                              <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded font-mono">Next.js</span>
                              <span className="px-2 py-1 bg-blue-700 text-white text-xs rounded font-mono">TypeScript</span>
                              <span className="px-2 py-1 bg-blue-500 text-white text-xs rounded font-mono">Supabase</span>
                              <span className="px-2 py-1 bg-blue-400 text-white text-xs rounded font-mono">shadcn</span>
                            </div>
                          </>
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <img 
                              src="/egg.svg" 
                              alt="Last Meal Protocol Club Logo" 
                              className="w-32 h-32 object-contain transition-transform duration-500"
                              style={{
                                transform: flippedCards.has('taskflow') ? 'rotateY(180deg)' : 'rotateY(0deg)',
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col h-80">
                  <div 
                    className={`crt-tv bg-black p-6 rounded-lg border-4 border-gray-800 hover:border-blue-500 transition-all duration-500 shadow-2xl relative overflow-hidden cursor-pointer flex-1 ${
                      flippedCards.has('portfolio') ? 'flipped' : ''
                    }`}
                    onClick={() => {
                      if (audioRef.current) {
                        audioRef.current.currentTime = 0;
                        audioRef.current.play().catch(error => console.log('Audio play failed:', error));
                      }
                      const newFlipped = new Set(flippedCards);
                      if (newFlipped.has('portfolio')) {
                        newFlipped.delete('portfolio');
                      } else {
                        newFlipped.add('portfolio');
                      }
                      setFlippedCards(newFlipped);
                    }}
                    style={{
                      transformStyle: 'preserve-3d',
                      transform: flippedCards.has('portfolio') ? 'rotateY(180deg)' : 'rotateY(0deg)',
                    }}
                  >
                    <div className="crt-screen bg-gray-900 rounded-sm p-4 mb-4 relative h-full">
                      <div className="crt-static absolute inset-0 opacity-20"></div>
                      <div className="crt-scanlines absolute inset-0"></div>
                      <div className="relative z-10 h-full flex flex-col">
                        {!flippedCards.has('portfolio') ? (
                          <>
                            <h3 className="text-xl font-bold mb-4 text-blue-400 font-mono">Portfolio Site</h3>
                            <p className="text-gray-300 mb-4 text-sm flex-1">This very website! Built with Next.js and inspired by the Wii&apos;s design language and the nostalgic technology of the 2000s era.</p>
                            <div className="flex flex-wrap gap-2 mt-auto">
                              <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded font-mono">Next.js</span>
                              <span className="px-2 py-1 bg-blue-700 text-white text-xs rounded font-mono">Tailwind</span>
                              <span className="px-2 py-1 bg-blue-500 text-white text-xs rounded font-mono">Framer Motion</span>
                            </div>
                          </>
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <img 
                              src="/owltuah.jpg" 
                              alt="Portfolio Logo" 
                              className="w-32 h-32 object-contain transition-transform duration-500 rounded-lg"
                              style={{
                                transform: flippedCards.has('portfolio') ? 'rotateY(180deg)' : 'rotateY(0deg)',
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col h-80">
                  <div 
                    className={`crt-tv bg-black p-6 rounded-lg border-4 border-gray-800 hover:border-blue-500 transition-all duration-500 shadow-2xl relative overflow-hidden cursor-pointer flex-1 ${
                      flippedCards.has('codeconnections') ? 'flipped' : ''
                    }`}
                    onClick={() => {
                      if (audioRef.current) {
                        audioRef.current.currentTime = 0;
                        audioRef.current.play().catch(error => console.log('Audio play failed:', error));
                      }
                      const newFlipped = new Set(flippedCards);
                      if (newFlipped.has('codeconnections')) {
                        newFlipped.delete('codeconnections');
                      } else {
                        newFlipped.add('codeconnections');
                      }
                      setFlippedCards(newFlipped);
                    }}
                    style={{
                      transformStyle: 'preserve-3d',
                      transform: flippedCards.has('codeconnections') ? 'rotateY(180deg)' : 'rotateY(0deg)',
                    }}
                  >
                    <div className="crt-screen bg-gray-900 rounded-sm p-4 mb-4 relative h-full">
                      <div className="crt-static absolute inset-0 opacity-20"></div>
                      <div className="crt-scanlines absolute inset-0"></div>
                      <div className="relative z-10 h-full flex flex-col">
                        {!flippedCards.has('codeconnections') ? (
                          <>
                            <h3 className="text-xl font-bold mb-4 text-blue-400 font-mono">Code Connections</h3>
                            <p className="text-gray-300 mb-4 text-sm flex-1">A social media app for Florida programmers to form teams and ask questions about hackathons. Connect with local developers and build amazing projects together.</p>
                            <div className="flex flex-wrap gap-2 mt-auto">
                              <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded font-mono">React</span>
                              <span className="px-2 py-1 bg-blue-700 text-white text-xs rounded font-mono">Python</span>
                              <span className="px-2 py-1 bg-blue-500 text-white text-xs rounded font-mono">Firebase</span>
                            </div>
                          </>
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <svg 
                              className="w-32 h-32 transition-transform duration-500"
                              style={{
                                transform: flippedCards.has('codeconnections') ? 'rotateY(180deg)' : 'rotateY(0deg)',
                              }}
                              viewBox="0 0 100 100"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <polygon 
                                points="50,10 90,90 10,90" 
                                fill="#FFD700" 
                                stroke="#DAA520" 
                                strokeWidth="2"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Contact Section */}
          <section 
            id="contact" 
            className={`min-h-screen flex flex-col items-center justify-center p-12 aero-section transition-all duration-1000 ${
              visibleSections.has('contact') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <div className="text-center">
              <h2 className={`text-4xl ${customFont.className} text-blue-600 mb-8`}>Get In Touch</h2>
              <div className="max-w-2xl mx-auto">
                <p className="text-xl text-gray-700 mb-8">I&apos;m always interested in new opportunities and exciting projects!</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="aero-card p-6 hover:scale-105 transition-all duration-300">
                    <div className="relative z-10">
                      <h3 className="text-xl font-bold mb-4 text-blue-600">Contact Info</h3>
                      <div className="space-y-2 text-gray-700">
                        <p className="flex items-center gap-2">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                          </svg>
                          sg09262004@gmail.com
                        </p>
                        <p className="flex items-center gap-2">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                          </svg>
                          se932535@ucf.edu
                        </p>
                        <p className="flex items-center gap-2">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                          Orlando, FL
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="aero-card p-6 hover:scale-105 transition-all duration-300">
                    <div className="relative z-10">
                      <h3 className="text-xl font-bold mb-4 text-blue-600">Social Links</h3>
                      <div className="space-y-2">
                        <a 
                          href="https://www.linkedin.com/in/sebastian-gdev/" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                          </svg>
                          LinkedIn
                        </a>
                        <a 
                          href="https://github.com/powdermilkjuno" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-gray-700 hover:text-blue-700 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                          </svg>
                          GitHub
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
      
      {/* Navigation Bar - only show when new content is visible */}
      {showNewContent && <BottomNavigation isVisible={isNavbarVisible} isScrolled={isScrolled} />}
    </>
  );
}
