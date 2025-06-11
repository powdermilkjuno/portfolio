'use client';
import React from 'react';
import { GitHubLogoIcon, LinkedInLogoIcon, FileIcon } from '@radix-ui/react-icons';

        const BottomNavigation: React.FC = () => {
            const playClickSound = () => {
                const audio = new Audio('/audio_button-select.mp3');
                audio.play().catch(error => console.log('Audio play failed:', error));
            };

            return (
                <div className="flex flex-row items-center justify-center text-lg animate-[pulse_2s_ease-in-out_infinite] opacity-20 hover:opacity-100">
                    <p className="mr-2">Press</p>
                    <a 
                        href="https://github.com/powdermilkjuno" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        aria-label="GitHub"
                        onClick={playClickSound}
                    >
                        <GitHubLogoIcon className="h-6 w-6 mx-2 hover:text-gray-400 transition-colors" />
                    </a>
                    <a 
                        href="https://www.linkedin.com/in/sebastian-gdev" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        aria-label="LinkedIn"
                        onClick={playClickSound}
                    >
                        <LinkedInLogoIcon className="h-6 w-6 mx-2 hover:text-gray-400 transition-colors" />
                    </a>
                    <a 
                        href="/sebastiangarciaresume.pdf" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        aria-label="Resume"
                        onClick={playClickSound}
                    >
                        <FileIcon className="h-6 w-6 mx-2 hover:text-gray-400 transition-colors" />
                    </a>
                    <p className="ml-2">to continue.</p>
                </div>
            );
        };

        export default BottomNavigation;