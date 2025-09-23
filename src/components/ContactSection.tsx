'use client';

import { useState } from 'react';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
  };

  return (
    <section className="w-full bg-[var(--section-bg-1)] text-[var(--text-primary)] py-24 lg:py-40 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-10 left-10 w-64 h-64 bg-gradient-to-br from-green-300/20 to-blue-300/20 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-gradient-to-br from-purple-300/15 to-pink-300/15 rounded-full blur-3xl animate-pulse-slow"></div>
      
      <div className="max-w-8xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-24 items-start">
          {/* Left Column - Content */}
          <div className="space-y-8 animate-slide-in-left">
            <div>
              <h2 className="text-4xl lg:text-6xl font-extrabold text-[var(--text-primary)] mb-8 leading-tight">
                Connect with our <span className="gradient-text">experts</span>
              </h2>
              <p className="text-[var(--muted-foreground)] text-xl leading-relaxed">
                Ready to grow your business online? Reach out for website design, marketing, AI solutions, and IT 
                consulting. Our team is here to help you streamline operations and boost your digital presence.
              </p>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div className="bg-[var(--card-background)] rounded-3xl p-12 shadow-elegant hover:shadow-glow transition-all duration-500 border border-[var(--border)] animate-slide-in-right">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <input
                  type="text"
                  name="name"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-6 py-4 border-2 border-[var(--border)] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)] transition-all duration-300 text-lg bg-[var(--card-background)] text-[var(--card-foreground)]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--muted-foreground)] mb-2">
                  EMAIL ADDRESS
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="email@website.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-6 py-4 border-2 border-[var(--border)] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)] transition-all duration-300 text-lg bg-[var(--card-background)] text-[var(--card-foreground)]"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--muted-foreground)] mb-2">
                  YOUR MESSAGE
                </label>
                <textarea
                  name="message"
                  placeholder="Type your message..."
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  className="w-full px-4 py-3 border border-[var(--border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent resize-none bg-[var(--card-background)] text-[var(--card-foreground)]"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[var(--accent)] text-[var(--accent-foreground)] font-bold py-4 px-8 rounded-2xl shadow-hover hover:shadow-glow transition-all duration-300 transform hover:scale-105 text-lg"
              >
                🚀 Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
