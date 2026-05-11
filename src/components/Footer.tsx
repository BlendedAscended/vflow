'use client';

import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useVapi } from './VapiContext';

const Footer = () => {
  const pathname = usePathname();
  const { toggleCall, isSessionActive } = useVapi();
  const isHome = pathname === '/';
  const hasContactSection = isHome || pathname === '/about' || pathname === '/blog' || pathname.startsWith('/services/');

  const navigationLinks = [
    { name: 'About', href: '/about' },
    { name: 'Services', href: '/services' },
    { name: 'Blog', href: '/blog' },
    { name: 'FAQ', href: '/blog/faq' },
    { name: 'Contact', href: hasContactSection ? '#contact' : '/#contact' },
    { name: 'Support', href: '#support' },

    { name: 'Call Us', href: '#', isButton: true, onClick: toggleCall }
  ];

  const socialLinks = [
    {
      name: 'LinkedIn',
      href: '#',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      name: 'Twitter',
      href: '#',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
        </svg>
      )
    },
    {
      name: 'Facebook',
      href: '#',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M20 10C20 4.477 15.523 0 10 0S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      name: 'Instagram',
      href: '#',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      name: 'YouTube',
      href: '#',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" clipRule="evenodd" />
        </svg>
      )
    }
  ];

  return (
    <footer className="w-full bg-[var(--surface-100)] text-[var(--green-500)] py-20 lg:py-24 relative overflow-hidden">
      {/* Next background pattern with conditional opacity */}
      <div
        className="pointer-events-none absolute inset-0 opacity-65 dark:opacity-35"
        style={{
          backgroundImage: 'url(/bg-section-next.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      <div className="absolute top-6 right-12 w-64 h-64 bg-[var(--green-500)]/15 rounded-full blur-3xl"></div>
      <div className="absolute bottom-6 left-12 w-80 h-80 bg-[var(--green-500)]/10 rounded-full blur-3xl"></div>

      <div className="max-w-8xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-12 lg:space-y-0 lg:space-x-16">
          {/* Logo and Company Name */}
          <div className="flex items-center space-x-4 animate-fade-in tile-in bento-tile depth-sm !p-6">
            <div className="w-16 h-12 relative">
              <Image
                src="/logo.png"
                alt="Verbaflow LLC Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div>
              <h3 className="text-[var(--green-500)] font-bold text-2xl tracking-tight">VERBAFLOW</h3>
              <p className="text-[var(--text-90)] text-lg font-medium">LLC</p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-wrap gap-10 lg:gap-16 tile-in bento-tile depth-sm !p-6">
            {navigationLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                onClick={() => {
                  if (link.isButton) {
                    link.onClick();
                  }
                }}
                className={`micro-lift ${link.isButton
                  ? `bg-[var(--accent)] text-[var(--accent-foreground)] px-6 py-2.5 rounded-full hover:shadow-glow hover:scale-105 transition-all duration-300 text-sm font-bold ${isSessionActive ? 'animate-pulse bg-red-500' : ''}`
                  : "text-[var(--text-90)] hover:opacity-90 transition-colors text-sm font-medium micro-lift"
                  }`}
              >
                {link.isButton && isSessionActive ? 'End Call' : link.name}
              </a>
            ))}
          </div>

          {/* Social Media Icons */}
          <div className="flex space-x-8 tile-in bento-tile depth-sm !p-6">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.href}
                className={`micro-lift hover:opacity-90 transition-colors ${social.name === 'LinkedIn' ? 'text-[#0A66C2]' :
                  social.name === 'Twitter' ? 'text-[#1DA1F2]' :
                    social.name === 'Facebook' ? 'text-[#1877F2]' :
                      social.name === 'Instagram' ? 'text-[#E4405F]' :
                        social.name === 'YouTube' ? 'text-[#FF0000]' :
                          'text-[var(--text-90)]'
                  }`}
                aria-label={social.name}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-16 pt-10 border-t border-[var(--border-80)] text-center tile-in bento-tile depth-sm !p-6">
          <p className="text-[var(--text-90)] text-lg">
            © 2024 Verbaflow LLC. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
