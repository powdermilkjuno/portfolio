import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sebastian Garcia - Software Developer Portfolio", // Be more specific
  description:
    "The official portfolio for Sebastian Garcia, a full-stack software developer specializing in modern web technologies. View my projects and get in touch.", // Add keywords
  icons: {
    icon: "/owltuah.jpg", // This line sets the default favicon for browser tabs
    shortcut: "/owltuah.jpg", // Also for favicons, provides broader compatibility
    apple: "/owltuah.jpg",   // For Apple devices when added to home screen
  },
  openGraph: {
    title: "Sebastian Garcia - Portfolio",
    description: "Full Stack Developer Portfolio",
    url: "https://sebastiangarcia.dev",
    siteName: "Sebastian Garcia Portfolio",
    images: [
      {
        url: "/owltuah.jpg",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sebastian Garcia - Portfolio",
    description: "Full Stack Developer Portfolio",
    images: ["/owltuah.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
