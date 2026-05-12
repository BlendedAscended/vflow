"use client";

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

const AIToolsSection = () => {
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.7;
    }
  }, []);

  return (
    <section id="projects" className="w-full bg-[var(--section-bg-1)] text-[var(--text-primary)] py-16 lg:py-24">
      <div className="max-w-8xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-24 items-center">
          {/* Left Column - Content */}
          <div className="space-y-12">
            <div className="space-y-8">
              <h2 className="text-4xl lg:text-6xl font-extrabold text-[var(--text-primary)] leading-tight">
                <span className="gradient-text">Agents that work</span> while your team sleeps.
              </h2>

              <p className="text-[var(--muted-foreground)] text-xl leading-relaxed">
                Multi-agent systems for scheduling, intake, dispatch, and compliance — built for
                healthcare networks, nursing operations, fintech teams, and trade service companies.
                Not demos. Production infrastructure.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-8">
              <Link href="/agency" className="bg-[var(--accent)] text-[var(--accent-foreground)] font-bold px-10 py-4 rounded-full shadow-hover hover:shadow-glow transition-all duration-300 transform hover:scale-105 text-lg text-center">
                See live systems
              </Link>
              <Link href="/services" className="bg-[var(--card-background)] border border-[var(--border)] hover:border-[var(--accent)] text-[var(--text-primary)] font-semibold px-10 py-4 rounded-full transition-all duration-300 hover:bg-[var(--card-background)]/20 backdrop-blur-sm text-lg text-center">
                How we build
              </Link>
            </div>
          </div>

          {/* Right Column - Video */}
          <div className="relative group">
            <div className="video-portal aspect-[4/3] bg-gradient-to-br from-white/10 via-blue-50/30 to-purple-50/20 rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-700 backdrop-blur-sm border border-white/20">
              <video
                ref={videoRef}
                src="/bg-video-section.mp4"
                autoPlay
                loop
                muted={isMuted}
                playsInline
                className="w-full h-full object-cover rounded-2xl mix-blend-multiply opacity-90 hover:opacity-100 transition-opacity duration-500"
                onLoadedData={() => {
                  if (videoRef.current) {
                    videoRef.current.playbackRate = 0.7;
                  }
                }}
              />

              {/* Video Overlay for Better Integration */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-blue-100/10 rounded-2xl pointer-events-none"></div>

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

export default AIToolsSection;
