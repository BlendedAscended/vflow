"use client";

import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { useLocationValue } from './LocationContext';

const HeroSection = () => {
  const [isMuted, setIsMuted] = useState(true);
  // at top of component state
  const { location } = useLocationValue();
  const videoRef = useRef<HTMLVideoElement>(null);

  // Location is now resolved in LocationProvider

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.7;
    }
  }, []);

  // Geolocation moved to provider

  return (
    <section className="w-full bg-[var(--section-bg-1)] text-[var(--text-primary)] py-2 lg:py-10 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-100/20 to-blue-100/20"></div>
      <div className="absolute top-10 right-10 w-72 h-72 bg-gradient-to-br from-green-200/30 to-blue-200/30 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full blur-3xl animate-pulse-slow"></div>
      
      {/* Theme toggle removed here; sticky desktop toggle is rendered globally */}

      <div className="max-w-8xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-4 items-center">
          {/* Left Column - Content */}
          <div className="space-y-2 animate-slide-in-left">
            <div className="space-y-6">
              <h1 className="text-3xl lg:text-5xl xl:text-6xl font-extrabold text-black leading-tight">
              Connect With More of Your Best Customers{' '}
                <span className="gradient-text animate-pulse-medium">Automate Your Business Growth</span>
             </h1>
              
              <div className="space-y-3">
                <div className="inline-block">
                  <p className="text-[#2c2c2c] font-bold text-sm uppercase tracking-wider bg-[#BEE3BA] px-3 py-3 rounded-md border border-blue-200">
                  We Serve clients in {location}
                  </p>
                </div>
                <p className="text-[#2c2c2c] text-xl lg:text-2xl leading-relaxed max-w-3xl font-medium">
                We unify your entire customer journey on one intelligent platform. Every stage, from marketing to operations, is engineered to make you the premier choice for customers.              </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-8 pt-1">
              <button className="gradient-primary text-black font-bold px-10 py-4 rounded-2xl shadow-hover hover:shadow-glow transition-all duration-300 transform hover:scale-105 text-lg">
                Get my growth plan
              </button>
              <button className="gradient-dark border border-white/30 hover:border-[#bee3ba] text-[#bee3ba] shadow-hover hover:shadow-glow font-semibold px-10 py-4 rounded-2xl transition-all duration-300 hover:bg-white/20 transform hover:scale-105 backdrop-blur-sm text-lg">
                See services
              </button>
            </div>
          </div>

          {/* Right Column - Video */}
          <div className="relative animate-slide-in-right group">
            {/* Video Container with Background Integration */}
            <div className="aspect-video bg-gradient-to-br from-white/10 via-green-50/30 to-blue-50/20 rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-700 backdrop-blur-sm border border-white/20">
              <video
                ref={videoRef}
                src="/hero-video.mp4"
                autoPlay
                loop
                muted={isMuted}
                playsInline
                className="w-full h-full object-cover rounded-3xl mix-blend-multiply opacity-90 hover:opacity-100 transition-opacity duration-500"
                onLoadedData={() => {
                  if (videoRef.current) {
                    videoRef.current.playbackRate = 0.7;
                  }
                }}
              />
              
              {/* Video Overlay for Better Integration */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-green-100/10 rounded-3xl pointer-events-none"></div>
              
              {/* Sound Control Button */}
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="absolute bottom-4 right-4 bg-white/90 hover:bg-white backdrop-blur-sm rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 group-hover:opacity-100 opacity-70"
                aria-label={isMuted ? 'Unmute video' : 'Mute video'}
              >
                {isMuted ? (
                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 14.142M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                )}
              </button>
              
      
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
