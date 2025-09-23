import Image from 'next/image';

const HeroSection = () => {
  return (
    <section className="w-full bg-gradient-to-br from-white via-gray-50 to-green-50 py-2 lg:py-10 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-100/20 to-blue-100/20"></div>
      <div className="absolute top-10 right-10 w-72 h-72 bg-gradient-to-br from-green-200/30 to-blue-200/30 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-gradient-to-br from-purple-200/20 to-pink-200/20 rounded-full blur-3xl animate-pulse-slow"></div>
      
      <div className="max-w-8xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:gap-4 items-center">
          {/* Left Column - Content */}
          <div className="space-y-2 animate-slide-in-left">
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-7xl xl:text-8xl font-extrabold text-black leading-tight">
                Grow your business with{' '}
                <span className="gradient-text animate-pulse-slow">AI</span>
              </h1>
              
              <div className="space-y-8">
                <div className="inline-block">
                  <p className="text-blue-600 font-bold text-sm uppercase tracking-wider bg-blue-50 px-6 py-3 rounded-full border border-blue-200">
                    ✨ SUBHEADING
                  </p>
                </div>
                <p className="text-gray-700 text-xl lg:text-2xl leading-relaxed max-w-3xl font-medium">
                  Modern websites, marketing, and AI solutions for local businesses. Streamline operations, 
                  boost leads, and automate your workflow with expert support in Montgomery County.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-8 pt-1">
              <button className="gradient-primary text-black font-bold px-10 py-4 rounded-2xl shadow-hover hover:shadow-glow transition-all duration-300 transform hover:scale-105 text-lg">
                🚀 Get started
              </button>
              <button className="gradient-dark border border-white/30 hover:border-[#bee3ba] text-[#bee3ba] shadow-hover hover:shadow-glow font-semibold px-10 py-4 rounded-2xl transition-all duration-300 hover:bg-white/20 transform hover:scale-105 backdrop-blur-sm text-lg">
                See services
              </button>
            </div>
          </div>

          {/* Right Column - Image */}
          <div className="relative animate-slide-in-right">
            <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl overflow-hidden shadow-elegant hover:shadow-glow transition-all duration-500 transform hover:scale-105">
              {/* Replace with actual hero image when available */}
              <Image
                src="/hero-image.png" // Add your actual image here
                alt="Business Growth"
                fill
                className="object-cover"
                priority
              />
              {/* Fallback placeholder (remove when you have real image) */}
              <div className="w-full h-full bg-gradient-to-br from-green-200/50 via-blue-200/50 to-purple-200/50 flex items-center justify-center animate-fade-in-up">
                <div className="text-center text-gray-600">
                  <div className="w-32 h-32 mx-auto mb-6 bg-white rounded-full flex items-center justify-center shadow-elegant animate-float">
                    <svg className="w-16 h-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <p className="text-lg font-semibold gradient-text">Business Growth Image</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
