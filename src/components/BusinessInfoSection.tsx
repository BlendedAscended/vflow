"use client"; // Marked as client component

import { useState, useRef, useEffect } from 'react';
import { useLocationValue } from './LocationContext'; // Import useLocationValue
import { submitContact } from '../app/actions/submitContact';

const BusinessInfoSection = () => {
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { location } = useLocationValue(); // Consume location from context

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.7;
    }
  }, []);

  return (
    <section id="about" className="w-full bg-[var(--section-bg-1)] text-[var(--text-primary)] py-16 lg:py-24">
      <div className="max-w-8xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-24 items-center">
          {/* Left Column - Video */}
          <div className="relative group">
            <div className="video-portal aspect-[4/3] bg-gradient-to-br from-white/10 via-green-50/30 to-blue-50/20 rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-700 backdrop-blur-sm border border-white/20">
              <video
                ref={videoRef}
                src="/bg-video-2.mp4"
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
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-green-100/10 rounded-2xl pointer-events-none"></div>

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

          {/* Right Column - Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h2 className="text-4xl lg:text-6xl font-extrabold text-[var(--text-primary)] leading-tight">
                Your operations, <span className="gradient-text">running on their own.</span>
              </h2>

              <div className="space-y-6">
                <div className="flex justify-start mb-6 pt-4">
                  <div
                    className="text-[var(--accent)] font-bold text-xl semibold leading-tight uppercase tracking-wider bg-[var(--accent)]/10 pl-10 pr-6 py-3 rounded-r-2xl w-fit"
                    style={{
                      clipPath: 'polygon(1.2rem 50%, 0 0, 100% 0, 100% 100%, 0 100%)'
                    }}
                  >
                    Agentic infrastructure for companies that build things.
                  </div>
                </div>
                {/* <div className="inline-block">
                  <p className="text-[var(--muted-foreground)] text-xl leading-relaxed bg-[var(--card-background)] px-8 py-6 rounded-2xl transition-all duration-300 hover:shadow-lg backdrop-blur-sm font-semibold">
                  Amplify Your Digital Footprint to Dominate {location}
                  </p>
                </div> */}
              </div>
            </div>

            <div className="bg-[var(--card-background)] rounded-3xl p-10 lg:p-12 shadow-elegant border border-[var(--border)] flex flex-col h-full">
              <h3 className="text-3xl font-bold text-[var(--card-foreground)] mb-6" style={{ marginTop: '-5%', marginBottom: '2%' }}>
                Map your first automated system.
              </h3>
              <p className="text-[var(--muted-foreground)] mr-6 mb-4 text-lg leading-tight flex-grow font-semibold">
                We scope, design, and ship production agentic systems for healthcare, nursing, finance, and trade operations
                across {location}. Drop your email — we&apos;ll outline your highest-ROI automation path before the first call.
              </p>

              <form action={async (formData) => {
                formData.append('name', 'Newsletter Subscriber');
                formData.append('subject', 'Newsletter Signup');
                await submitContact(formData);
                alert('Thank you! We\'ll send your system map shortly.');
              }} className="flex flex-col sm:flex-row gap-6 mt-8">
                <input
                  type="email"
                  name="email"
                  placeholder="Work email"
                  required
                  className="flex-1 px-6 py-4 border-2 border-[var(--border)] rounded-full focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)] transition-all duration-300 text-lg bg-[var(--card-background)] text-[var(--card-foreground)]"
                />
                <button type="submit" className="bg-[var(--accent)] text-[var(--accent-foreground)] font-bold px-10 py-4 rounded-full transition-all duration-300 transform hover:scale-105 whitespace-nowrap text-lg shadow-hover hover:shadow-glow">
                  Get my system map
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BusinessInfoSection;