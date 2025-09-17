const ServicesSection = () => {
  const services = [
    {
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      title: "Website & app development",
      description: "Launch a custom website or app to reach more customers and grow your online presence."
    },
    {
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ),
      title: "Marketing & social campaigns",
      description: "Drive leads with SEO, social media, and targeted campaigns tailored for your business."
    },
    {
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      title: "AI assistants & automation",
      description: "Automate scheduling and support with AI tools for better efficiency and customer service."
    },
    {
      icon: (
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
      title: "Cloud, IT & compliance",
      description: "Secure cloud migration and compliance for HIPAA, SOC, and industry standards."
    }
  ];

  return (
    <section className="w-full gradient-dark py-24 lg:py-40 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-900/50 to-black/50"></div>
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-full blur-3xl"></div>
      
      <div className="max-w-8xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="text-center mb-24 animate-fade-in-up">
          <div className="inline-block mb-6">
            <p className="text-green-400 text-sm font-bold uppercase tracking-wider bg-green-900/30 px-6 py-3 rounded-full border border-green-500/30">
              ⚡ BUSINESS GROWTH MADE SIMPLE
            </p>
          </div>
          <h2 className="text-4xl lg:text-6xl font-extrabold text-white mb-8 leading-tight">
            Smarter solutions for <span className="gradient-text">local success</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">
          {services.map((service, index) => (
            <div 
              key={index} 
              className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-3xl p-10 lg:p-12 shadow-hover hover:shadow-glow border border-gray-700/50 hover:border-green-500/30 transition-all duration-500 transform hover:scale-105 animate-fade-in-up"
              style={{animationDelay: `${index * 0.1}s`}}
            >
              <div className="space-y-8">
                <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-blue-500 rounded-3xl flex items-center justify-center shadow-glow animate-pulse-slow">
                  {service.icon}
                </div>
                <div className="space-y-6">
                  <h3 className="text-2xl lg:text-3xl font-bold text-white leading-tight">
                    {service.title}
                  </h3>
                  <p className="text-gray-300 text-lg lg:text-xl leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
