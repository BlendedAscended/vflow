const AIToolsSection = () => {
  return (
    <section className="w-full bg-[var(--section-bg-1)] text-[var(--text-primary)] py-24 lg:py-40">
      <div className="max-w-8xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-24 items-center">
          {/* Left Column - Content */}
          <div className="space-y-12">
            <div className="space-y-8">
              <h2 className="text-4xl lg:text-6xl font-extrabold text-[var(--text-primary)] leading-tight">
                <span className="gradient-text">Intelligent Service. </span>Effortless Operations.
              </h2>
              
              <p className="text-[var(--muted-foreground)] text-xl leading-relaxed">
              From intelligent scheduling to seamless lead capture and responsive support, deploy AI designed to optimize every customer interaction for local Montgomery County businesses.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-8">
              <button className="bg-[var(--accent)] text-[var(--accent-foreground)] font-bold px-10 py-4 rounded-2xl shadow-hover hover:shadow-glow transition-all duration-300 transform hover:scale-105 text-lg">
                🚀 Get started
              </button>
              <button className="border border-[var(--border)] text-[var(--text-primary)] font-semibold px-10 py-4 rounded-2xl transition-all duration-300 hover:bg-[var(--muted-background)] text-lg">
                Learn more
              </button>
            </div>
          </div>

          {/* Right Column - Image */}
          <div className="relative">
            <div className="aspect-[4/3] bg-[var(--muted-background)] rounded-2xl overflow-hidden">
              {/* Placeholder for AI tools interface */}
              <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                <div className="text-center text-gray-600">
                  <div className="w-24 h-24 mx-auto mb-4 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium">AI Support Tools</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIToolsSection;
