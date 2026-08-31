"use client";

import { useState, useEffect, useCallback } from 'react';
import "./globals.css";
import { FaExclamationTriangle } from "react-icons/fa";
import { CursorArrowIcon } from '@radix-ui/react-icons';
import localFont from 'next/font/local';
import AboutPhoto from './components/AboutPhoto';
import BottomNavigation from './components/BottomNavigation';
import OptimizedImage from './components/OptimizedImage';
import ProjectChannel from './components/ProjectChannel';
import SectionScroller from './components/SectionScroller';
import WiiChannel from './components/WiiChannel';
import { projects } from './data/projects';
import { useWiiSounds } from './lib/useWiiSounds';

const customFont = localFont({
  src: '../fonts/FOT-Rodin Pro B.otf',
  display: 'swap',
  variable: '--font-custom'
});

type IconProps = { className?: string };

const GithubIcon = ({ className = 'h-9 w-9' }: IconProps) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
    <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
  </svg>
);

const LinkedInIcon = ({ className = 'h-9 w-9' }: IconProps) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
    <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
  </svg>
);

const ResumeIcon = ({ className = 'h-9 w-9' }: IconProps) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
  </svg>
);

const MailIcon = ({ className = 'h-5 w-5' }: IconProps) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
  </svg>
);

const NAV_CHANNELS = [
  { id: 'about', title: 'About Me', blurb: 'Learn more about who I am' },
  { id: 'skills', title: 'Skills', blurb: 'Technologies I build with' },
  { id: 'projects', title: 'Projects', blurb: 'Explore my latest work' },
  { id: 'contact', title: 'Contact', blurb: 'Start a conversation' },
];

const SOCIAL_LINKS = [
  { label: 'GitHub', href: 'https://github.com/powdermilkjuno', Icon: GithubIcon },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/sebastian-gdev/', Icon: LinkedInIcon },
  { label: 'Resume', href: '/sebastiangarcia-resume.pdf', Icon: ResumeIcon },
];

const SKILL_CHANNELS = [
  { title: 'Frontend', items: ['React & Next.js', 'TypeScript', 'Tailwind CSS', 'JavaScript'] },
  { title: 'Backend', items: ['Node.js', 'Python', 'SQL', 'MongoDB'] },
  { title: 'Design', items: ['Figma', 'Character Design', 'Concept Art', 'UI/UX Design'] },
  { title: 'Tools', items: ['Git & GitHub', 'Docker', 'AWS', 'VS Code'] },
];

export default function Home() {
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [showNewContent, setShowNewContent] = useState(false);
  const [isNavbarVisible, setIsNavbarVisible] = useState(false);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());

  const playSound = useWiiSounds();

  const goToSection = useCallback(
    (sectionId: string) => {
      playSound('section');
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    },
    [playSound]
  );

  const openLink = useCallback(
    (href: string) => {
      playSound('select');
      window.open(href, '_blank', 'noopener,noreferrer');
    },
    [playSound]
  );

  const handlePageClick = () => {
    playSound('section');
    setIsFadingOut(true);

    setTimeout(() => {
      setShowNewContent(true);
      setIsNavbarVisible(true);
    }, 1000);
  };

  useEffect(() => {
    if (!showNewContent) return;

    const sections = ['welcome', 'about', 'skills', 'projects', 'contact'];
    const observer = new IntersectionObserver(
      (entries) => {
        setVisibleSections((previous) => {
          const next = new Set(previous);
          entries.forEach((entry) => {
            if (entry.isIntersecting) next.add(entry.target.id);
          });
          return next;
        });
      },
      { rootMargin: '0px 0px -20% 0px', threshold: 0.15 }
    );

    sections.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [showNewContent]);

  const sectionClass = (id: string, extra = '') =>
    `wii-section flex min-h-[88vh] flex-col items-center justify-center px-6 py-10 transition-[opacity,transform] duration-1000 ${extra} ${
      visibleSections.has(id) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
    }`;

  return (
    <>
      {/* Health-and-safety style splash, straight off a boot-up Wii */}
      {!showNewContent && (
        <div
          onClick={handlePageClick}
          className={`transition-opacity duration-1000 ${isFadingOut ? 'opacity-0' : 'opacity-100'}`}
        >
          <div className="flex min-h-screen flex-col items-center justify-center p-8">
            <div className="flex items-center gap-3">
              <FaExclamationTriangle className="h-12 w-12" />
              <h1 className={`text-4xl md:text-5xl ${customFont.className}`}>
                Sebastian Garcia&apos;s Portfolio
              </h1>
            </div>

            <div className="mt-16 space-y-3 text-center text-2xl md:text-3xl">
              <p>Hi I&apos;m Seba!</p>
              <p>I&apos;m a CS major at UCF!</p>
              <p>Let me know any thoughts about the site.</p>
            </div>

            <div className="mt-16 text-center">
              <p className="text-sm text-gray-500">Share the website link:</p>
              <a
                href="https://sebastiangarcia.dev"
                className="text-2xl font-medium text-white transition-colors hover:text-blue-400"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
              >
                sebastiangarcia.dev
              </a>
            </div>

            <div className="animate-glow-pulse mt-16 flex items-center text-3xl">
              <p className="mr-2">Click</p>
              <CursorArrowIcon className="mx-2 h-8 w-8" />
              <p className="ml-2">anywhere to continue.</p>
            </div>
          </div>
        </div>
      )}

      {showNewContent && <div className="wii-menu-bg" aria-hidden="true" />}

      {showNewContent && (
        <div className="animate-fade-in pb-28">
          {/* Wii Menu — the channel grid */}
          <section id="welcome" className={sectionClass('welcome')}>
            <h1 className={`text-4xl md:text-5xl ${customFont.className} text-center text-slate-700`}>
              Welcome to My Portfolio!
            </h1>
            <p className="mt-3 text-sm text-slate-500">
              Point at a channel to light it up, then click to tune in.
            </p>

            <div className="mt-12 grid w-full max-w-5xl grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
              {NAV_CHANNELS.map((channel) => (
                <div key={channel.id} className="aspect-[4/3]">
                  <WiiChannel
                    as="button"
                    screenClassName="wii-channel__screen--light flex flex-col items-center justify-center p-4 text-center"
                    onMouseEnter={() => playSound('hover')}
                    onClick={() => goToSection(channel.id)}
                  >
                    <h3 className={`text-xl text-blue-600 ${customFont.className}`}>
                      {channel.title}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">{channel.blurb}</p>
                  </WiiChannel>
                </div>
              ))}

              {/* Vacant slot, balancing the row on the widest layout */}
              <div className="hidden lg:block">
                <WiiChannel empty aria-hidden="true" />
              </div>

              {/* Everywhere else you can find me, on one wide channel */}
              <div className="col-span-2 aspect-[8/3]">
                <WiiChannel screenClassName="wii-channel__screen--light flex flex-col items-center justify-center gap-3 p-4">
                  <span className={`text-lg text-blue-600 ${customFont.className}`}>
                    Find Me Online
                  </span>
                  <div className="flex items-center gap-4">
                    {SOCIAL_LINKS.map(({ label, href, Icon }) => (
                      <button
                        key={label}
                        type="button"
                        title={label}
                        aria-label={label}
                        onMouseEnter={() => playSound('hover')}
                        onClick={() => openLink(href)}
                        className="wii-orb flex h-12 w-12 items-center justify-center"
                      >
                        <Icon className="h-5 w-5" />
                      </button>
                    ))}
                  </div>
                </WiiChannel>
              </div>

              <div className="hidden lg:block">
                <WiiChannel empty aria-hidden="true" />
              </div>
            </div>

            <SectionScroller
              targetId="about"
              label="About Me"
              onPoint={() => playSound('hover')}
              onActivate={() => playSound('section')}
            />
          </section>

          {/* About */}
          <section id="about" className={sectionClass('about')}>
            <h2 className={`text-4xl ${customFont.className} mb-10 text-slate-700`}>About Me</h2>

            <div className="flex max-w-6xl flex-col items-center justify-center gap-14 lg:flex-row">
              <div className="relative">
                <WiiChannel className="max-w-sm rotate-3" screenClassName="p-3">
                  <div className="relative z-10 flex items-center justify-center">
                    <AboutPhoto />
                  </div>
                </WiiChannel>

                <div className="absolute -bottom-8 -right-8 z-20 flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-white shadow-lg">
                  <OptimizedImage
                    src="/sebamii.png"
                    alt="Sebamii"
                    width={80}
                    height={80}
                    sizes="80px"
                    className="h-20 w-20 rounded-full object-contain"
                  />
                </div>
              </div>

              <WiiChannel
                className="max-w-lg"
                screenClassName="wii-channel__screen--light wii-channel__screen--padded"
              >
                <h3 className={`mb-5 text-2xl text-blue-600 ${customFont.className}`}>Who I Am</h3>
                <div className="space-y-4 text-left text-slate-600">
                  <p>
                    Hi! I&apos;m Sebastian Garcia, a passionate full-stack developer with a love for
                    creating beautiful, functional, and user-friendly applications. I enjoy turning
                    complex problems into simple, elegant solutions.
                  </p>
                  <p>
                    With a background in both frontend and backend development, I specialize in modern
                    web technologies and love experimenting with new frameworks and tools. When I&apos;m
                    not coding, you can find me exploring new technologies, contributing to open-source
                    projects, or sharing knowledge with the developer community.
                  </p>
                  <p>
                    I believe in writing clean, maintainable code and creating experiences that users
                    love to interact with. Every project is an opportunity to learn something new.
                  </p>
                </div>
              </WiiChannel>
            </div>

            <SectionScroller
              targetId="skills"
              label="Skills"
              onPoint={() => playSound('hover')}
              onActivate={() => playSound('section')}
            />
          </section>

          {/* Skills */}
          <section id="skills" className={sectionClass('skills', 'wii-section-tint')}>
            <h2 className={`text-4xl ${customFont.className} mb-10 text-slate-700`}>My Skills</h2>

            <div className="grid w-full max-w-6xl grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-4">
              {SKILL_CHANNELS.map((skill) => (
                <WiiChannel
                  key={skill.title}
                  screenClassName="wii-channel__screen--light wii-channel__screen--padded"
                >
                  <h3 className={`mb-4 text-2xl text-blue-600 ${customFont.className}`}>
                    {skill.title}
                  </h3>
                  <ul className="space-y-2 text-slate-600">
                    {skill.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </WiiChannel>
              ))}
            </div>

            <SectionScroller
              targetId="projects"
              label="Projects"
              onPoint={() => playSound('hover')}
              onActivate={() => playSound('section')}
            />
          </section>

          {/* Projects */}
          <section id="projects" className={sectionClass('projects')}>
            <h2 className={`text-4xl ${customFont.className} mb-3 text-slate-700`}>
              Featured Projects
            </h2>
            <p className="mb-10 text-sm text-slate-500">
              Hover a channel to read the details.
            </p>

            <div className="grid w-full max-w-6xl grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <ProjectChannel
                  key={project.id}
                  project={project}
                  onTune={() => playSound('hover')}
                />
              ))}
            </div>

            <SectionScroller
              targetId="contact"
              label="Get In Touch"
              onPoint={() => playSound('hover')}
              onActivate={() => playSound('section')}
            />
          </section>

          {/* Contact */}
          <section id="contact" className={sectionClass('contact', 'wii-section-tint')}>
            <h2 className={`text-4xl ${customFont.className} mb-4 text-slate-700`}>Get In Touch</h2>
            <p className="mb-10 text-lg text-slate-600">
              I&apos;m always interested in new opportunities and exciting projects!
            </p>

            <div className="grid w-full max-w-3xl grid-cols-1 gap-8 md:grid-cols-2">
              <WiiChannel screenClassName="wii-channel__screen--light wii-channel__screen--padded">
                <h3 className={`mb-4 text-xl text-blue-600 ${customFont.className}`}>Contact Info</h3>
                <div className="space-y-2 text-left text-slate-600">
                  <p className="flex items-center gap-2">
                    <MailIcon className="h-5 w-5 shrink-0 text-blue-500" />
                    sg09262004@gmail.com
                  </p>
                  <p className="flex items-center gap-2">
                    <MailIcon className="h-5 w-5 shrink-0 text-blue-500" />
                    se932535@ucf.edu
                  </p>
                  <p className="flex items-center gap-2">
                    <svg className="h-5 w-5 shrink-0 text-blue-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    Orlando, FL
                  </p>
                </div>
              </WiiChannel>

              <WiiChannel screenClassName="wii-channel__screen--light wii-channel__screen--padded">
                <h3 className={`mb-4 text-xl text-blue-600 ${customFont.className}`}>Social Links</h3>
                <div className="space-y-3 text-left">
                  {SOCIAL_LINKS.map(({ label, href, Icon }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => playSound('select')}
                      className="flex items-center gap-2 text-slate-600 transition-colors hover:text-blue-600"
                    >
                      <Icon className="h-5 w-5 shrink-0 text-blue-500" />
                      {label}
                    </a>
                  ))}
                </div>
              </WiiChannel>
            </div>
          </section>
        </div>
      )}

      {showNewContent && <BottomNavigation isVisible={isNavbarVisible} />}
    </>
  );
}
