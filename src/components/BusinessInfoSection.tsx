"use client";
import { useLocationValue } from './LocationContext';

const BusinessInfoSection = () => {
  const { location } = useLocationValue();
  return (
    <section className="w-full bg-[var(--section-bg-1)] text-[var(--text-primary)] py-24 lg:py-40">
      <div className="max-w-8xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-24 items-center">
          {/* Left Column - Image */}
          <div className="relative">
            <div className="aspect-[4/3] bg-[var(--muted-background)] rounded-2xl overflow-hidden">
              {/* Placeholder for business team image */}
              <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <div className="w-24 h-24 mx-auto mb-4 bg-[var(--card-background)] rounded-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <p className="text-sm">Business Team Image</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="space-y-12">
            <div className="space-y-8">
              <h2 className="text-4xl lg:text-6xl font-extrabold text-[var(--text-primary)] leading-tight">
              Future-Proofing Your  <span className="gradient-text">Brand, Today.</span>
              </h2>
              
              <div className="space-y-6">
                <div className="inline-block">
                  <p className="text-[var(--text-secondary)] font-bold text-sm uppercase tracking-wider bg-[var(--muted-background)] px-6 py-3 rounded-full border border-[var(--border)]">
                  Transformative Solutions for Resilient Brands.
                  </p>
                </div>
                <p className="text-[var(--muted-foreground)] text-xl leading-relaxed">
                Amplify Your Digital Footprint to Dominate {location}.
                </p>
              </div>
            </div>

            <div className="bg-[var(--card-background)] rounded-3xl p-10 lg:p-12 shadow-elegant border border-[var(--border)]">
              <h3 className="text-3xl font-bold text-[var(--card-foreground)] mb-8">
              Unleash Exponential Online Opportunity
              </h3>
              <p className="text-[var(--muted-foreground)] mb-8 text-lg leading-relaxed">
              Go beyond a basic online presence. We build a single, intelligent marketing system that unifies all your channels to create a predictable flow of qualified customers.
              </p>
              
              <form className="flex flex-col sm:flex-row gap-6">
                <input
                  type="email"
                  placeholder="Email"
                  className="flex-1 px-6 py-4 border-2 border-[var(--border)] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)] transition-all duration-300 text-lg bg-[var(--card-background)] text-[var(--card-foreground)]"
                />
                <button className="bg-[var(--accent)] text-[var(--accent-foreground)] font-bold px-10 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 whitespace-nowrap text-lg shadow-hover hover:shadow-glow">
                  🚀 Submit
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
