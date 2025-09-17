'use client';

import { useState } from 'react';
import Image from 'next/image'; 

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="w-full gradient-secondary px-6 py-6 lg:px-12 shadow-elegant backdrop-blur-sm sticky top-0 z-50 animate-fade-in">
      <div className="max-w-8xl mx-auto flex items-center justify-between">
        {/* Logo */}
           <div className="flex items-center animate-slide-in-left pl-8">
              <div className="w-10 h-10 relative mr-8">
              <Image
                  src="/logo.png" // Add your actual image here
                alt="LOGO"
                fill
                className="object-cover"
                priority
              />
            </div>
           <span className="text-black font-bold text-xl tracking-tight">Verbaflow LLC</span>
          </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-12">
          <div className="relative group">
            <button className="flex items-center space-x-1 text-black hover:text-gray-700 font-medium">
              <span>Services</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
          <a href="#about" className="text-black hover:text-gray-700 font-medium">About</a>
          <a href="#blog" className="text-black hover:text-gray-700 font-medium">Blog</a>
          <div className="relative group">
            <button className="flex items-center space-x-1 text-black hover:text-gray-700 font-medium">
              <span>Support</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>

        {/* CTA Button */}
        <div className="hidden lg:block animate-slide-in-right">
          <button className="gradient-primary text-black font-semibold px-8 py-3 rounded-xl shadow-hover hover:shadow-glow transition-all duration-300 transform hover:scale-105">
            Get started
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="lg:hidden flex items-center justify-center w-8 h-8"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden mt-4 pb-4">
          <div className="flex flex-col space-y-4">
            <button className="text-left text-black hover:text-gray-700 font-medium">Services</button>
            <a href="#about" className="text-black hover:text-gray-700 font-medium">About</a>
            <a href="#blog" className="text-black hover:text-gray-700 font-medium">Blog</a>
            <button className="text-left text-black hover:text-gray-700 font-medium">Support</button>
            <button className="bg-[#A5D6A7] hover:bg-[#8BC34A] text-black font-medium px-6 py-2 rounded-lg transition-colors w-fit">
              Get started
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
