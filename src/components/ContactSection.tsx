'use client';

import { useState } from 'react';
import { submitContact } from '../app/actions/submitContact';
import AnimatedHeadline from './ui/AnimatedHeadline';
import { useReveal } from '../hooks/useReveal';

const ContactSection = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ success: boolean; message: string } | null>(null);
  const formRef = useReveal<HTMLDivElement>(0.15);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus(null);
    const formData = new FormData(e.currentTarget);
    const result = await submitContact(formData);
    setIsSubmitting(false);
    setStatus(result);
    if (result.success) (e.target as HTMLFormElement).reset();
  };

  return (
    <section id="contact" className="vf-ambient w-full bg-[var(--section-bg-1)] text-[var(--text-primary)] py-16 lg:py-24 relative overflow-hidden">
      <div className="max-w-8xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">

          {/* Left Column */}
          <div className="space-y-8 animate-slide-in-left">
            <span className="vf-section-num">/ 05</span>
            <AnimatedHeadline className="text-4xl lg:text-6xl font-extrabold text-[var(--text-primary)] mb-8 leading-tight">
              Connect with our experts
            </AnimatedHeadline>
            <p className="text-[var(--muted-foreground)] text-xl leading-relaxed">
              Ready to grow your business online? Reach out for website design, marketing, AI Solutions, and IT consulting.
              Our team is here to streamline your operations and boost your digital presence.
            </p>
          </div>

          {/* Right Column — Contact Form */}
          <div
            ref={formRef}
            className="vf-reveal bg-[var(--card-background)] rounded-3xl p-12 shadow-elegant hover:shadow-glow transition-all duration-500 border border-[var(--border)]"
          >
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <input
                  type="text"
                  name="name"
                  placeholder="Your name"
                  className="w-full px-6 py-4 border-2 border-[var(--border)] rounded-full focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)] transition-all duration-300 text-lg bg-[var(--card-background)] text-[var(--card-foreground)]"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--muted-foreground)] mb-2">EMAIL ADDRESS</label>
                <input
                  type="email"
                  name="email"
                  placeholder="email@website.com"
                  className="w-full px-6 py-4 border-2 border-[var(--border)] rounded-full focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)] transition-all duration-300 text-lg bg-[var(--card-background)] text-[var(--card-foreground)]"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--muted-foreground)] mb-2">YOUR MESSAGE</label>
                <textarea
                  name="message"
                  placeholder="Type your message..."
                  rows={6}
                  className="w-full px-4 py-3 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent resize-none bg-[var(--card-background)] text-[var(--card-foreground)]"
                  required
                  disabled={isSubmitting}
                />
              </div>

              {status && (
                <div className={`p-4 rounded-lg ${status.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {status.message}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="vf-btn-magnetic w-full bg-[var(--accent)] text-[var(--accent-foreground)] font-bold py-4 px-8 rounded-full shadow-hover hover:shadow-glow transition-all duration-300 transform hover:scale-105 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Sending...' : <>Submit <span className="vf-arrow">→</span></>}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
