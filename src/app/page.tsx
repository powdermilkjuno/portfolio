import "./globals.css";
import { FaExclamationTriangle } from "react-icons/fa";
import localFont from 'next/font/local';
import BottomNavigation from './components/BottomNavigation';

// Define your custom font
const customFont = localFont({
  src: '../fonts/FOT-Rodin Pro B.otf', // Adjust path to your font file
  display: 'swap',
  variable: '--font-custom'
});

export default function Home() {
  return (
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
  );
}
