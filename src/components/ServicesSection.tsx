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
      description: "Develop the central hub for your customer universe. A seamless website or app experience that forms the core of your brand's digital anatomy.",
      icon: "website"
    },
    {
      _id: "fallback-2",
      title: "Marketing & social campaigns",
      description: "Execute targeted marketing campaigns designed for maximum impact. We turn digital noise into measurable signals for business growth..",
      icon: "marketing"
    },
    {
      _id: "fallback-3",
      title: "AI assistants & automation",
      description: "Deploy an intelligent, autonomous workforce. AI assistants and automated workflows that handle routine tasks 24/7, freeing you to lead and innovate.",
      icon: "ai"
    },
    {
      _id: "fallback-4",
      title: "Cloud, IT & compliance",
      description: "Build the unbreachable foundation for your growth. A secure, compliant cloud architecture that ensures your entire digital ecosystem is stable, protected, and poised for scale.",
      icon: "cloud"
    }
  ];

  // Always show default services, plus any additional services from Sanity
  const displayServices = [...defaultServices, ...(services || [])];

  return (
    <section className="w-full bg-[var(--section-bg-2)] text-[var(--text-secondary)] py-16 lg:py-24 relative overflow-hidden">
      {/* Gemini background pattern */}
      <div 
        className="pointer-events-none absolute inset-0 opacity-65 dark:opacity-35"
        style={{
          backgroundImage: 'url(/bg-section-gemini.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      <div className="absolute top-10 right-16 w-64 h-64 bg-[var(--accent)]/15 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-10 left-16 w-72 h-72 bg-[var(--accent)]/10 rounded-full blur-3xl animate-pulse-slow"></div>
      
      <div className="max-w-8xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="inline-block mb-6 pt-4">
            <div className="text-[var(--section-bg-1)] text-sm font-bold uppercase tracking-wider bg-[var(--muted-foreground)] px-8 py-4 rounded-2xl border border-[var(--border)]">
              Where strategy, technology, and automation converge, predictable growth emerges.
            </div>
          </div>
          <h2 className="text-4xl lg:text-6xl font-extrabold text-[var(--text-secondary)] mb-8 leading-tight">
            Build a Smarter, <span className="gradient-text"> Stronger Brand.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:gap-4 max-w-6xl mx-auto items-start">
          {displayServices.map((service, index) => (
            <div 
              key={service._id} 
              className={`group rounded-3xl p-6 lg:p-8 relative border-2 transition-all duration-500 animate-fade-in-up will-change-transform ${
                index % 2 === 0
                  ? 'bg-[var(--section-bg-3)] text-[var(--text-secondary)] border-[var(--border)]'
                  : 'bg-[var(--section-bg-2)] text-[var(--text-secondary)] border-[var(--border)]'
              } hover:scale-[1.01] hover:border-[var(--accent)] hover:shadow-lg`}
              style={{animationDelay: `${index * 0.1}s`}}
            >
              <div className="space-y-6 relative">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-16 h-16 lg:w-20 lg:h-20 rounded-2xl flex items-center justify-center bg-[var(--accent)]`}>
                    {getServiceIcon(service.icon)}
                  </div>
                  {service.price && (
                    <span className="text-[var(--text-accent)] font-semibold text-lg whitespace-nowrap ml-4">
                      {service.price}
                    </span>
                  )}
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-2xl lg:text-3xl font-bold text-[var(--text-secondary)] leading-tight">
                    {service.title}
                  </h3>
                  
                  <p className="text-[var(--text-accent)] text-lg leading-relaxed">
                    {service.description}
                  </p>
                  
                  {service.features && service.features.length > 0 && (
                    <div className="space-y-2">
                      {service.features.slice(0, 3).map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-start space-x-3">
                          <svg className="w-5 h-5 text-[var(--accent)] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-[var(--text-accent)] text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {service.ctaText && (
                    <div className="pt-4">
                      <a
                        href={service.ctaLink || '#contact'}
                        className="inline-flex items-center px-6 py-3 rounded-2xl transition-all duration-300 transform bg-[var(--muted-foreground)] text-[var(--section-bg-1)] hover:scale-[1.03] hover:shadow-lg"
                      >
                        <span className="relative z-10">{service.ctaText}</span>
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