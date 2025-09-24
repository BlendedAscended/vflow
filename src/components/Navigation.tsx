'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image'; 
import { client } from '../sanity/lib/client';

// TypeScript interface for navigation services
interface NavigationService {
  title: string;
  slug: string;
  active?: boolean;           // Add this line
  showInNavigation?: boolean; // Add this line
}

// Fallback navigation services that always show
const defaultNavigationServices: NavigationService[] = [
  { title: "Website Development", slug: "website-development" },
  { title: "Digital Marketing", slug: "digital-marketing" },
  { title: "AI Automation", slug: "ai-automation" },
  { title: "Cloud Solutions", slug: "cloud-solutions" }
];

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [services, setServices] = useState<NavigationService[]>([]);
  const [isServicesOpen, setIsServicesOpen] = useState(false);

  // Fetch services for navigation dropdown
  useEffect(() => {
    const fetchServices = async () => {
      try {
        console.log('Sanity config check:', {
          projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
          dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
          apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION
        });
        
        // Try a simpler query first
        const navigationServices: NavigationService[] = await client.fetch(`
          *[_type == "service"] {
            title,
            "slug": slug.current,
            active,
            showInNavigation
          }
        `);
        
        // Filter on client side for now
        const filteredServices = navigationServices.filter((service: NavigationService) => 
          service.active === true && service.showInNavigation === true
        );
        console.log('All services:', navigationServices);
        console.log('Filtered services:', filteredServices);
        
        // Always show default services plus any Sanity services
        const allServices = [...defaultNavigationServices, ...filteredServices];
        setServices(allServices);
      } catch (error) {
        console.error('Error fetching navigation services:', error);
        console.error('Full error details:', error);
        // Use default services when Sanity fails
        setServices(defaultNavigationServices);
      }
    };

    fetchServices();
  }, []);

  // initialize theme from storage or media query
  useEffect(() => {
    try {
      const stored = localStorage.getItem('theme');
      let nextIsDark = false;
      if (stored === 'dark') nextIsDark = true;
      if (!stored) {
        nextIsDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
      setIsDark(nextIsDark);
      const root = document.documentElement;
      root.classList.remove('theme-light', 'theme-dark');
      root.classList.add(`theme-${nextIsDark ? 'dark' : 'light'}`);
    } catch {}
  }, []);

  const toggleTheme = () => {
    const nextIsDark = !isDark;
    setIsDark(nextIsDark);
    const root = document.documentElement;
    root.classList.remove('theme-light', 'theme-dark');
    root.classList.add(`theme-${nextIsDark ? 'dark' : 'light'}`);
    try { localStorage.setItem('theme', nextIsDark ? 'dark' : 'light'); } catch {}
  };

  return (
    <nav className="w-full px-4 lg:px-8 py-2 sticky top-0 z-50 backdrop-blur-md animate-fade-in bg-[var(--section-bg-1)] text-[var(--text-primary)]">
      <div className="max-w-6xl mx-auto">
        {/* Floating pill container */}
        <div className="flex items-center justify-between bg-[var(--card-background)] border border-[var(--border)] rounded-full shadow-elegant px-8 py-4 mx-auto max-w-4xl">
        {/* Logo */}
        <div className="flex items-center animate-slide-in-left pl-1">
          <div className="w-8 h-8 relative mr-2">
            <Image
              src="/logo.png"
              alt="LOGO"
              fill
              className="object-cover"
              priority
            />
          </div>
          <span className="text-[var(--muted-foreground)] font-bold text-xl tracking-tight">Verbaflow LLC</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-3">
          {/* Services Dropdown */}
          <div 
            className="relative group"
            onMouseEnter={() => setIsServicesOpen(true)}
            onMouseLeave={() => setIsServicesOpen(false)}
          >
            <button className="flex items-center space-x-1 text-[var(--text-primary)] hover:text-[var(--accent-foreground)] font-medium transition-all duration-300 px-3 py-1.5 rounded-full hover:bg-[var(--accent)]">
              <span>Services</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
              {/* Dropdown Menu */}
              {isServicesOpen && (
                <div className={`absolute left-0 top-full bg-[var(--card-background)] rounded-3xl shadow-xl border border-[var(--border)] py-4 z-50 ${
                  services.length <= 6 ? 'w-72' : 
                  services.length <= 12 ? 'w-96' : 
                  'w-[48rem]'
                }`}>
                  {services.length > 0 ? (
                    <div className={`grid gap-1 px-4 ${
                      services.length <= 6 ? 'grid-cols-1' :
                      services.length <= 12 ? 'grid-cols-2' :
                      'grid-cols-3'
                    }`}>
                      {services.map((service) => (
                        <a
                          key={service.slug}
                          href={`/services/${service.slug}`}
                          className="block px-4 py-3 text-[var(--card-foreground)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)] transition-colors duration-200 rounded-2xl"
                        >
                          <span className="font-medium">{service.title}</span>
                        </a>
                      ))}
                    </div>
                  ) : (
                    <div className="px-4 py-3 text-[var(--muted-foreground)] text-sm">
                      No services available
                    </div>
                  )}
                </div>
              )}
          </div>

          <a href="#about" className="text-[var(--text-primary)] hover:text-[var(--accent-foreground)] font-medium transition-all duration-300 relative px-3 py-1.5 rounded-full hover:bg-[var(--accent)]">
            About
          </a>
          
          <a href="#blog" className="text-[var(--text-primary)] hover:text-[var(--accent-foreground)] font-medium transition-all duration-300 relative px-3 py-1.5 rounded-full hover:bg-[var(--accent)]">
            Blog
          </a>
          
          <a href="#contact" className="text-[var(--text-primary)] hover:text-[var(--accent-foreground)] font-medium transition-all duration-300 relative px-3 py-1.5 rounded-full hover:bg-[var(--accent)]">
            Contact
          </a>
        </div>

        {/* CTA Button */}
        <div className="hidden lg:flex items-center animate-slide-in-right">
          <button className="bg-[var(--accent)] text-[var(--accent-foreground)] font-bold px-6 py-3 rounded-full shadow-hover hover:shadow-glow transition-all duration-300 transform hover:scale-105">
            Get started
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="lg:hidden flex items-center justify-center w-8 h-8 rounded-full bg-[var(--card-background)] border border-[var(--border)]"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden mt-4 pb-4">
          <div className="flex flex-col space-y-4">
            {/* Mobile theme toggle (visible here only on small screens) */}
            <button
              aria-label="Toggle theme"
              aria-pressed={isDark}
              onClick={toggleTheme}
              className="self-start flex items-center justify-center w-10 h-10 rounded-full border border-black/10 bg-white/70 hover:bg-white transition-colors"
            >
              {isDark ? (
                <svg className="h-5 w-5 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" strokeWidth="1.5"/>
                </svg>
              ) : (
                <svg className="h-5 w-5 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="4" strokeWidth="1.5"/>
                  <path d="M12 2v2m0 16v2m10-10h-2M4 12H2m15.364-7.364l-1.414 1.414M8.05 16.95l-1.414 1.414m12.728 0l-1.414-1.414M8.05 7.05L6.636 5.636" strokeWidth="1.5"/>
                </svg>
              )}
            </button>
            {/* Mobile Services */}
            <div>
              <button 
                onClick={() => setIsServicesOpen(!isServicesOpen)}
                className="text-left text-black hover:text-gray-700 font-medium w-full flex items-center justify-between"
              >
                <span>Services</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isServicesOpen && (
                <div className="mt-2 ml-4 space-y-2">
                  {services.map((service) => (
                    <a
                      key={service.slug}
                      href={`/services/${service.slug}`}
                      className="block text-gray-600 hover:text-gray-800 py-1"
                    >
                      {service.title}
                    </a>
                  ))}
                </div>
              )}
            </div>
            
            <a href="#about" className="text-black hover:text-gray-700 font-medium">About</a>
            <a href="#blog" className="text-black hover:text-gray-700 font-medium">Blog</a>
            <a href="#contact" className="text-black hover:text-gray-700 font-medium">Contact</a>
            <button className="text-left text-black hover:text-gray-700 font-medium">Support</button>
            <button className="gradient-primary text-black font-medium px-6 py-2 rounded-full transition-colors w-fit">
              Get started
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;