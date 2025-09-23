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

  return (
    <nav className="w-full gradient-secondary px-6 py-6 lg:px-12 shadow-elegant backdrop-blur-sm sticky top-0 z-50 animate-fade-in">
      <div className="max-w-8xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center animate-slide-in-left pl-2">
          <div className="w-10 h-10 relative mr-2">
            <Image
              src="/logo.png"
              alt="LOGO"
              fill
              className="object-cover"
              priority
            />
          </div>
          <span className="text-black font-bold text-xl tracking-tight">Verbaflow LLC</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-12 ml-auto mr-12">
          {/* Services Dropdown */}
          <div 
            className="relative group"
            onMouseEnter={() => setIsServicesOpen(true)}
            onMouseLeave={() => setIsServicesOpen(false)}
          >
            <button className="flex items-center space-x-1 text-black hover:text-white font-medium transition-all duration-300 px-4 py-2 rounded-full hover:bg-[#9ecd9d]">
              <span>Services</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
              {/* Dropdown Menu */}
              {isServicesOpen && (
                <div className={`absolute left-0 top-full bg-white rounded-xl shadow-xl border border-gray-100 py-4 z-50 ${
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
                          className="block px-4 py-3 text-gray-700 hover:bg-[#9ecd9d] hover:text-white transition-colors duration-200 border-l-4 border-transparent hover:border-[#9ecd9d] rounded-lg"
                        >
                          <span className="font-medium">{service.title}</span>
                        </a>
                      ))}
                    </div>
                  ) : (
                    <div className="px-4 py-3 text-gray-500 text-sm">
                      No services available
                    </div>
                  )}
                </div>
              )}
          </div>

          <a href="#about" className="text-black hover:text-white font-medium transition-all duration-300 relative px-4 py-2 rounded-full hover:bg-[#9ecd9d]">
            About
          </a>
          
          <a href="#blog" className="text-black hover:text-white font-medium transition-all duration-300 relative px-4 py-2 rounded-full hover:bg-[#9ecd9d]">
            Blog
          </a>
          
          <a href="#contact" className="text-black hover:text-white font-medium transition-all duration-300 relative px-4 py-2 rounded-full hover:bg-[#9ecd9d]">
            Contact
          </a>
        </div>

        {/* CTA Button */}
        <div className="hidden lg:block animate-slide-in-right">
          <button className="gradient-primary text-black font-semibold px-8 py-3 rounded-xl shadow-hover hover:shadow-glow transition-all duration-300 transform hover:scale-105">
            Get started
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="lg:hidden flex items-center justify-center w-8 h-8"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden mt-4 pb-4">
          <div className="flex flex-col space-y-4">
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
            <button className="bg-[#A5D6A7] hover:bg-[#8BC34A] text-black font-medium px-6 py-2 rounded-lg transition-colors w-fit">
              Get started
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
