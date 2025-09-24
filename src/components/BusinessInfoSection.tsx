"use client"; // Marked as client component

import { useLocationValue } from './LocationContext'; // Import useLocationValue

const BusinessInfoSection = () => {
  const { location } = useLocationValue(); // Consume location from context

  return (
    <section className="w-full bg-[var(--section-bg-1)] text-[var(--text-primary)] py-16 lg:py-24">
      <div className="max-w-8xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-24 items-center">
          {/* Left Column - Image */}
          <div className="relative">
            <div className="aspect-[4/3] bg-[var(--muted-background)] rounded-2xl overflow-hidden">
              {/* Placeholder for business team image */}
              <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                <div className="text-center text-[var(--muted-foreground)]">
                  <div className="w-24 h-24 mx-auto mb-4 bg-[var(--card-background)] rounded-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-[var(--muted-foreground)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <p className="text-sm leading-tight">Business Team Image</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h2 className="text-4xl lg:text-6xl font-extrabold text-[var(--text-primary)] leading-tight">
              Future-Proofing Your  <span className="gradient-text">Brand, Today.</span>
              </h2>
              
              <div className="space-y-6">
                <div className="flex justify-start mb-6">
                  <div className="text-[var(--text-primary)] font-bold text-lg leading-tight uppercase tracking-wider bg-[var(--accent)] px-8 py-4 rounded-full border border-[var(--accent)]">
                  Intelligent Strategies for Market Dominance.
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
              <h3 className="text-3xl font-bold text-[var(--card-foreground)] mb-6" style={{marginTop: '-5%', marginBottom: '2%'}}>
                Unleash Exponential Online Opportunity
              </h3>
              <p className="text-[var(--muted-foreground)] mr-6 mb-4 text-lg leading-tight flex-grow font-semibold">
                Get a custom website, marketing, and AI-powered tools to boost your leads and automate your workflow.
                Serving {location} businesses with expert digital solutions.
              </p>

              <form className="flex flex-col sm:flex-row gap-6 mt-8">
                <input
                  type="email"
                  placeholder="Email"
                  className="flex-1 px-6 py-4 border-2 border-[var(--border)] rounded-full focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)] transition-all duration-300 text-lg bg-[var(--card-background)] text-[var(--card-foreground)]"
                />
                <button className="bg-[var(--accent)] text-[var(--accent-foreground)] font-bold px-10 py-4 rounded-full transition-all duration-300 transform hover:scale-105 whitespace-nowrap text-lg shadow-hover hover:shadow-glow">
                  Submit
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