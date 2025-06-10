import Image from "next/image";
import "./globals.css";
import { FaExclamationTriangle } from "react-icons/fa";
import localFont from 'next/font/local';

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
          <h1 className={`text-4xl ${customFont.className}`}>Sebastian Garcia's Portfolio</h1>
        </div>
      </div>
    </div>
  );
}
