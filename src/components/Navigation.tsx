'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { client } from '../sanity/lib/client';

// TypeScript interface for navigation services
interface NavigationService {
  title: string;
  slug: string;
  active?: boolean;           // Add this line
  showInNavigation?: boolean; // Add this line
}



const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [services, setServices] = useState<NavigationService[]>([]);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === '/';
  const isAgency = pathname === '/agency';
  // Pages that have their own contact section
  const hasContactSection = isHome || pathname === '/about' || pathname === '/blog' || pathname.startsWith('/services/');

  // Scroll listener for agency transparent nav
  useEffect(() => {
    if (!isAgency) return;
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isAgency]);

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

        // Show only Sanity services
        setServices(filteredServices);
      } catch (error) {
        console.error('Error fetching navigation services:', error);
        console.error('Full error details:', error);
        // Use empty array when Sanity fails
        setServices([]);
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
    } catch { }
  }, []);

  const toggleTheme = () => {
    const nextIsDark = !isDark;
    setIsDark(nextIsDark);
    const root = document.documentElement;
    root.classList.remove('theme-light', 'theme-dark');
    root.classList.add(`theme-${nextIsDark ? 'dark' : 'light'}`);
    try { localStorage.setItem('theme', nextIsDark ? 'dark' : 'light'); } catch { }
  };

  return (
    <nav
      className={`w-full px-4 lg:px-8 py-2 sticky top-0 z-50 animate-fade-in transition-all duration-300 ${
        isAgency
          ? scrolled
            ? 'bg-[rgba(250,250,248,0.9)] backdrop-blur-md'
            : 'bg-transparent'
          : 'bg-[var(--surface-70)] backdrop-blur-xl'
      }`}
      style={isAgency ? { color: '#111111' } : { color: 'var(--text-primary)' }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Floating pill container — transparent on /agency */}
        <div className={`flex items-center justify-between px-8 py-4 mx-auto max-w-4xl ${
          isAgency
            ? 'bg-transparent border-transparent'
            : 'bento-tile depth-sm bg-[var(--surface-80)] border border-[var(--border-80)] rounded-full shadow-elegant'
        }`}>
          {/* Logo */}
          <Link href="/" className="flex items-center animate-slide-in-left pl-1">
            <div className="w-8 h-8 relative mr-2">
              <Image
                src="/logo.png"
                alt="LOGO"
                fill
                className="object-cover"
                priority
              />
            </div>
            <span className={`font-bold text-xl tracking-tight ${isAgency ? 'text-[#111111]' : 'text-[var(--muted-foreground)]'}`}>Verbaflow LLC</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-3">
            {/* Services Dropdown */}
            <div
              className="relative group"
              onMouseEnter={() => setIsServicesOpen(true)}
              onMouseLeave={() => setIsServicesOpen(false)}
            >
              <button className={`flex items-center space-x-1 font-medium transition-all duration-300 px-3 py-1.5 rounded-full ${
                isAgency
                  ? 'text-[#111111] hover:text-[#6B7280] hover:bg-[#E5E5E0]'
                  : 'text-[var(--text-100)] hover:text-[var(--ink-100)] hover:bg-[var(--green-100)]'
              }`}>
                <span>Services</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {isServicesOpen && (
                <div className={`absolute left-0 top-full bento-tile depth-md bg-[var(--surface-80)] rounded-3xl shadow-xl border border-[var(--border-80)] py-4 z-50 ${services.length <= 6 ? 'w-96' :
                  services.length <= 12 ? 'w-[32rem]' :
                    'w-[56rem]'
                  }`}>
                  {services.length > 0 ? (
                    <div className={`grid gap-1 px-4 ${services.length <= 6 ? 'grid-cols-1' :
                      services.length <= 12 ? 'grid-cols-2' :
                        'grid-cols-3'
                      }`}>
                      {services.map((service) => (
                        <a
                          key={service.slug}
                          href={`/services/${service.slug}`}
                          className="block px-4 py-3 text-[var(--card-foreground)] hover:bg-[var(--green-100)] hover:text-[var(--ink-100)] transition-colors duration-200 rounded-2xl"
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

            {[
              { href: '/virtual-office', label: 'Virtual Office' },
              { href: '/agency', label: 'Agency' },
              { href: '/about', label: 'About' },
              { href: '/blog', label: 'Blog' },
              { href: hasContactSection ? '#contact' : '/#contact', label: 'Contact' },
            ].map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`font-medium transition-all duration-300 relative px-3 py-1.5 rounded-full ${
                  isAgency
                    ? 'text-[#111111] hover:text-[#6B7280] hover:bg-[#E5E5E0]'
                    : 'text-[var(--text-100)] hover:text-[var(--ink-100)] hover:bg-[var(--green-100)]'
                }`}
              >
                {link.label}
              </Link>
            ))}


          </div>

          {/* CTA Button */}
          <div className="hidden lg:flex items-center animate-slide-in-right">
            <Link href="/growth-plan" className={`font-bold px-6 py-3 rounded-full transition-all duration-300 transform hover:scale-105 micro-lift ${
              isAgency
                ? 'bg-[#111111] text-white hover:bg-[#333333]'
                : 'bg-[var(--accent)] text-[var(--accent-foreground)] shadow-hover hover:shadow-glow'
            }`}>
              Get started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden flex items-center justify-center w-8 h-8 rounded-full bg-[var(--surface-80)] border border-[var(--border-80)]"
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
          <div className="flex flex-col space-y-4 bento-tile depth-lg bg-[var(--surface-80)] rounded-3xl p-6 border border-[var(--border-80)] shadow-xl">
            {/* Mobile theme toggle (visible here only on small screens) */}
            <button
              aria-label="Toggle theme"
              aria-pressed={isDark}
              onClick={toggleTheme}
              className="self-start flex items-center justify-center w-10 h-10 rounded-full border border-[var(--border-80)] bg-[var(--surface-70)] hover:bg-[var(--green-100)] transition-colors"
            >
              {isDark ? (
                <svg className="h-5 w-5 text-[var(--text-100)]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" strokeWidth="1.5" />
                </svg>
              ) : (
                <svg className="h-5 w-5 text-[var(--text-100)]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="12" cy="12" r="4" strokeWidth="1.5" />
                  <path d="M12 2v2m0 16v2m10-10h-2M4 12H2m15.364-7.364l-1.414 1.414M8.05 16.95l-1.414 1.414m12.728 0l-1.414-1.414M8.05 7.05L6.636 5.636" strokeWidth="1.5" />
                </svg>
              )}
            </button>
            {/* Mobile Services */}
            <div>
              <button
                onClick={() => setIsServicesOpen(!isServicesOpen)}
                className="text-left text-[var(--text-100)] hover:text-[var(--ink-100)] font-medium w-full flex items-center justify-between py-2 px-3 rounded-2xl hover:bg-[var(--green-100)] transition-all duration-300"
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
                      className="block text-[var(--text-accent)] hover:text-[var(--ink-100)] py-2 px-3 rounded-2xl hover:bg-[var(--green-100)] transition-all duration-300"
                    >
                      {service.title}
                    </a>
                  ))}
                </div>
              )}
            </div>

            <Link href="/virtual-office" className="text-[var(--text-100)] hover:text-[var(--ink-100)] font-medium py-2 px-3 rounded-2xl hover:bg-[var(--green-100)] transition-all duration-300">Virtual Office</Link>
            <Link href="/agency" className="text-[var(--text-100)] hover:text-[var(--ink-100)] font-medium py-2 px-3 rounded-2xl hover:bg-[var(--green-100)] transition-all duration-300">Agency</Link>
            <Link href="/about" className="text-[var(--text-100)] hover:text-[var(--ink-100)] font-medium py-2 px-3 rounded-2xl hover:bg-[var(--green-100)] transition-all duration-300">About</Link>
            <Link href="/blog" className="text-[var(--text-100)] hover:text-[var(--ink-100)] font-medium py-2 px-3 rounded-2xl hover:bg-[var(--green-100)] transition-all duration-300">Blog</Link>
            <Link href={hasContactSection ? "#contact" : "/#contact"} className="text-[var(--text-100)] hover:text-[var(--ink-100)] font-medium py-2 px-3 rounded-2xl hover:bg-[var(--green-100)] transition-all duration-300">Contact</Link>

            <button className="text-left text-[var(--text-100)] hover:text-[var(--ink-100)] font-medium py-2 px-3 rounded-2xl hover:bg-[var(--green-100)] transition-all duration-300">Support</button>
            <Link href="/growth-plan" className="bg-[var(--accent)] text-[var(--accent-foreground)] font-bold px-6 py-3 rounded-full transition-all duration-300 transform hover:scale-105 shadow-hover hover:shadow-glow micro-lift w-fit">
              Get started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;