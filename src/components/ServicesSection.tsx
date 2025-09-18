// TypeScript interface for service data
interface Service {
  _id: string;
  title: string;
  description: string;
  icon?: string;
  price?: string;
  features?: string[];
  ctaText?: string;
  ctaLink?: string;
  featured?: boolean;
  active?: boolean;
}

interface ServicesSectionProps {
  services?: Service[];
}

// Icon components based on service type
const getServiceIcon = (iconType?: string) => {
  const iconClass = "w-8 h-8 text-white";
  
  switch (iconType) {
    case 'website':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      );
    case 'marketing':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      );
    case 'ai':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      );
    case 'cloud':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      );
    case 'analytics':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      );
    case 'support':
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      );
    default:
      return (
        <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      );
  }
};

const ServicesSection = ({ services }: ServicesSectionProps) => {
  // Fallback data if no services are passed
  const defaultServices: Service[] = [
    {
      _id: "fallback-1",
      title: "Website & app development",
      description: "Launch a custom website or app to reach more customers and grow your online presence.",
      icon: "website"
    },
    {
      _id: "fallback-2",
      title: "Marketing & social campaigns",
      description: "Drive leads with SEO, social media, and targeted campaigns tailored for your business.",
      icon: "marketing"
    },
    {
      _id: "fallback-3",
      title: "AI assistants & automation",
      description: "Automate scheduling and support with AI tools for better efficiency and customer service.",
      icon: "ai"
    },
    {
      _id: "fallback-4",
      title: "Cloud, IT & compliance",
      description: "Secure cloud migration and compliance for HIPAA, SOC, and industry standards.",
      icon: "cloud"
    }
  ];

  // Always show default services, plus any additional services from Sanity
  const displayServices = [...defaultServices, ...(services || [])];

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
          {displayServices.map((service, index) => (
            <div 
              key={service._id} 
              className={`bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-3xl p-10 lg:p-12 shadow-hover hover:shadow-glow border transition-all duration-500 transform hover:scale-105 animate-fade-in-up ${
                service.featured 
                  ? 'border-green-500/50 hover:border-green-400/70' 
                  : 'border-gray-700/50 hover:border-green-500/30'
              }`}
              style={{animationDelay: `${index * 0.1}s`}}
            >
              <div className="space-y-8">
                <div className={`w-24 h-24 bg-gradient-to-br rounded-3xl flex items-center justify-center shadow-glow animate-pulse-slow ${
                  service.featured 
                    ? 'from-green-400 to-blue-400' 
                    : 'from-green-500 to-blue-500'
                }`}>
                  {getServiceIcon(service.icon)}
                </div>
                <div className="space-y-6">
                  <div className="flex items-start justify-between">
                    <h3 className="text-2xl lg:text-3xl font-bold text-white leading-tight flex-1">
                      {service.title}
                    </h3>
                    {service.price && (
                      <span className="text-green-400 font-semibold text-lg whitespace-nowrap ml-4">
                        {service.price}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-300 text-lg lg:text-xl leading-relaxed">
                    {service.description}
                  </p>
                  
                  {service.features && service.features.length > 0 && (
                    <ul className="space-y-2">
                      {service.features.slice(0, 3).map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-gray-400">
                          <svg className="w-4 h-4 text-green-400 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  )}
                  
                  {service.ctaText && (
                    <div className="pt-4">
                      <a
                        href={service.ctaLink || '#contact'}
                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold rounded-xl hover:from-green-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                      >
                        {service.ctaText}
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </a>
                    </div>
                  )}
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
