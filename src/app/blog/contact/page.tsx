'use client';

import { useState, useEffect } from 'react';
import { client } from '../../../sanity/lib/client';
import { PortableText } from '@portabletext/react';
import Image from 'next/image';

import { submitContact } from '../../actions/submitContact';

// TypeScript interfaces for blog data
interface ContactBlog {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt: string;
  content: any[];
  featuredImage?: {
    asset: {
      url: string;
    };
    alt?: string;
  };
  publishedAt: string;
  readingTime: number;
  author: {
    name: string;
  };
}

interface ResumeCategory {
  title: string;
  description: string;
  skills: string[];
  icon: string;
}

const ContactBlogPage = () => {
  const [journeyBlog, setJourneyBlog] = useState<ContactBlog | null>(null);
  const [skillsBlog, setSkillsBlog] = useState<ContactBlog | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ success: boolean; message: string } | null>(null);

  // Resume categories for download
  const resumeCategories: ResumeCategory[] = [
    {
      title: 'Data Engineer',
      description: 'Specialized in building and maintaining data pipelines, ETL processes, and data infrastructure.',
      skills: ['Python', 'SQL', 'Apache Airflow', 'Docker', 'AWS', 'Spark', 'Kafka'],
      icon: '🔧'
    },
    {
      title: 'Data Scientist',
      description: 'Expert in machine learning, statistical analysis, and predictive modeling for business insights.',
      skills: ['Python', 'R', 'TensorFlow', 'PyTorch', 'Pandas', 'Scikit-learn', 'Jupyter'],
      icon: '📊'
    },
    {
      title: 'Data Analyst',
      description: 'Proficient in data visualization, business intelligence, and translating data into actionable insights.',
      skills: ['SQL', 'Tableau', 'Power BI', 'Excel', 'Python', 'Statistics', 'Business Intelligence'],
      icon: '📈'
    },
    {
      title: 'AI/ML Engineer',
      description: 'Focused on developing and deploying machine learning models and AI Solutions at scale.',
      skills: ['Python', 'TensorFlow', 'PyTorch', 'MLOps', 'Docker', 'Kubernetes', 'Cloud AI'],
      icon: '🤖'
    },
    {
      title: 'Full Stack Developer',
      description: 'Comprehensive development skills across frontend, backend, and database technologies.',
      skills: ['React', 'Node.js', 'Python', 'PostgreSQL', 'MongoDB', 'AWS', 'Docker'],
      icon: '💻'
    }
  ];

  // Fetch blog content
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        // Fetch journey blog
        const journeyQuery = `
          *[_type == "blog" && slug.current == "my-journey" && published == true][0] {
            _id,
            title,
            slug,
            excerpt,
            content,
            featuredImage {
              asset-> {
                url
              },
              alt
            },
            publishedAt,
            readingTime,
            author-> {
              name
            }
          }
        `;

        const journeyData: ContactBlog = await client.fetch(journeyQuery);
        setJourneyBlog(journeyData);

        // Fetch skills blog
        const skillsQuery = `
          *[_type == "blog" && slug.current == "my-skills-intentions" && published == true][0] {
            _id,
            title,
            slug,
            excerpt,
            content,
            featuredImage {
              asset-> {
                url
              },
              alt
            },
            publishedAt,
            readingTime,
            author-> {
              name
            }
          }
        `;

        const skillsData: ContactBlog = await client.fetch(skillsQuery);
        setSkillsBlog(skillsData);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching blog data:', error);
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // PortableText components for proper Sanity rich text rendering
  const components = {
    types: {
      image: ({ value }: { value: any }) => {
        if (!value?.asset?.url) {
          return null;
        }
        return (
          <div className="my-8">
            <img
              src={value.asset.url}
              alt={value.alt || 'Blog Image'}
              className="rounded-2xl shadow-elegant w-full h-auto"
            />
            {value.caption && (
              <p className="text-center text-[var(--muted-foreground)] text-sm mt-2 italic">
                {value.caption}
              </p>
            )}
          </div>
        );
      },
    },
    block: {
      h1: ({ children }: any) => (
        <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-6 mt-8">{children}</h1>
      ),
      h2: ({ children }: any) => (
        <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-5 mt-6">{children}</h2>
      ),
      h3: ({ children }: any) => (
        <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-4 mt-5">{children}</h3>
      ),
      h4: ({ children }: any) => (
        <h4 className="text-xl font-bold text-[var(--text-primary)] mb-3 mt-4">{children}</h4>
      ),
      normal: ({ children }: any) => (
        <p className="text-[var(--text-primary)] mb-4 leading-relaxed">{children}</p>
      ),
      blockquote: ({ children }: any) => (
        <blockquote className="border-l-4 border-[var(--accent)] pl-6 py-2 my-6 text-[var(--muted-foreground)] italic">
          {children}
        </blockquote>
      ),
    },
    list: {
      bullet: ({ children }: any) => (
        <ul className="list-disc list-inside text-[var(--text-primary)] mb-4 space-y-2">{children}</ul>
      ),
      number: ({ children }: any) => (
        <ol className="list-decimal list-inside text-[var(--text-primary)] mb-4 space-y-2">{children}</ol>
      ),
    },
    listItem: {
      bullet: ({ children }: any) => (
        <li className="mb-1">{children}</li>
      ),
      number: ({ children }: any) => (
        <li className="mb-1">{children}</li>
      ),
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="text-[var(--text-primary)] text-xl">Loading content...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 bg-[var(--section-bg-1)]">
        <div className="max-w-6xl mx-auto px-6 lg:px-12 text-center">
          <h1 className="text-5xl lg:text-8xl font-extrabold text-[var(--text-primary)] mb-8 animate-fade-in-up">
            <span className="gradient-text">My Journey</span> & <span className="gradient-text">Vision</span>
          </h1>
          <p className="text-xl lg:text-2xl text-[var(--muted-foreground)] mb-12 max-w-4xl mx-auto animate-fade-in-up">
            Learn about my journey in tech, current skills, and future intentions.
            Let's connect and collaborate on innovative projects.
          </p>
        </div>
      </section>

      {/* Journey Blog Section */}
      {journeyBlog && (
        <section className="py-20 bg-[var(--section-bg-2)]">
          <div className="max-w-4xl mx-auto px-6 lg:px-12">
            <div className="bg-[var(--card-background)] rounded-3xl p-8 lg:p-12 shadow-elegant border border-[var(--border)]">
              <div className="text-center mb-8">
                <h2 className="text-3xl lg:text-4xl font-bold text-[var(--card-foreground)] mb-4">
                  {journeyBlog.title}
                </h2>
                <p className="text-[var(--muted-foreground)] mb-4">
                  {journeyBlog.excerpt}
                </p>
                <div className="flex justify-center items-center gap-4 text-sm text-[var(--muted-foreground)]">
                  <span>By {journeyBlog.author.name}</span>
                  <span>•</span>
                  <span>{formatDate(journeyBlog.publishedAt)}</span>
                  <span>•</span>
                  <span>{journeyBlog.readingTime} min read</span>
                </div>
              </div>

              {journeyBlog.featuredImage?.asset?.url && (
                <div className="relative h-64 lg:h-96 rounded-2xl overflow-hidden mb-8">
                  <img
                    src={journeyBlog.featuredImage.asset.url}
                    alt={journeyBlog.featuredImage.alt || journeyBlog.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="prose prose-lg max-w-none">
                <PortableText value={journeyBlog.content} components={components} />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Skills Blog Section */}
      {skillsBlog && (
        <section className="py-20 bg-[var(--section-bg-1)]">
          <div className="max-w-4xl mx-auto px-6 lg:px-12">
            <div className="bg-[var(--card-background)] rounded-3xl p-8 lg:p-12 shadow-elegant border border-[var(--border)]">
              <div className="text-center mb-8">
                <h2 className="text-3xl lg:text-4xl font-bold text-[var(--card-foreground)] mb-4">
                  {skillsBlog.title}
                </h2>
                <p className="text-[var(--muted-foreground)] mb-4">
                  {skillsBlog.excerpt}
                </p>
                <div className="flex justify-center items-center gap-4 text-sm text-[var(--muted-foreground)]">
                  <span>By {skillsBlog.author.name}</span>
                  <span>•</span>
                  <span>{formatDate(skillsBlog.publishedAt)}</span>
                  <span>•</span>
                  <span>{skillsBlog.readingTime} min read</span>
                </div>
              </div>

              {skillsBlog.featuredImage?.asset?.url && (
                <div className="relative h-64 lg:h-96 rounded-2xl overflow-hidden mb-8">
                  <img
                    src={skillsBlog.featuredImage.asset.url}
                    alt={skillsBlog.featuredImage.alt || skillsBlog.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="prose prose-lg max-w-none">
                <PortableText value={skillsBlog.content} components={components} />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Resume Download Section */}
      <section className="py-20 bg-[var(--section-bg-2)]">
        <div className="max-w-6xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-6xl font-bold text-[var(--text-primary)] mb-8">
              Download My <span className="gradient-text">Resume</span>
            </h2>
            <p className="text-xl text-[var(--muted-foreground)] max-w-4xl mx-auto">
              Choose from different versions of my resume tailored to specific roles and expertise areas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {resumeCategories.map((category, index) => (
              <div
                key={index}
                className="bg-[var(--card-background)] rounded-3xl p-8 shadow-elegant border border-[var(--border)] hover:shadow-glow transition-all duration-300 transform hover:scale-105"
              >
                <div className="text-center mb-6">
                  <div className="text-4xl mb-4">{category.icon}</div>
                  <h3 className="text-xl font-bold text-[var(--card-foreground)] mb-2">
                    {category.title}
                  </h3>
                  <p className="text-[var(--muted-foreground)] text-sm">
                    {category.description}
                  </p>
                </div>

                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-[var(--card-foreground)] mb-3">
                    Key Skills:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {category.skills.map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="px-3 py-1 bg-[var(--accent)] text-[var(--accent-foreground)] text-xs font-semibold rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <button className="w-full bg-[var(--accent)] text-[var(--accent-foreground)] font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105 shadow-hover hover:shadow-glow">
                  Download Resume
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LinkedIn CTA Section */}
      <section className="py-20 bg-[var(--section-bg-1)]">
        <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-[var(--text-primary)] mb-8">
            Let's Connect on <span className="gradient-text">LinkedIn</span>
          </h2>
          <p className="text-xl text-[var(--muted-foreground)] mb-12">
            I'm always interested in connecting with fellow professionals, discussing new opportunities,
            and collaborating on innovative projects. Let's start a conversation!
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <a
              href="https://linkedin.com/in/your-profile"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#0077B5] text-white font-bold px-10 py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-hover hover:shadow-glow flex items-center justify-center gap-3"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
              </svg>
              Connect on LinkedIn
            </a>
            <button className="border-2 border-[var(--accent)] text-[var(--accent)] font-bold px-10 py-4 rounded-full hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)] transition-all duration-300 transform hover:scale-105">
              Send Email
            </button>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 bg-[var(--section-bg-2)]">
        <div className="max-w-4xl mx-auto px-6 lg:px-12">
          <div className="bg-[var(--card-background)] rounded-3xl p-8 lg:p-12 shadow-elegant border border-[var(--border)]">
            <div className="text-center mb-8">
              <h2 className="text-3xl lg:text-4xl font-bold text-[var(--card-foreground)] mb-4">
                Get in Touch
              </h2>
              <p className="text-[var(--muted-foreground)]">
                Have a project in mind? Let's discuss how we can work together to bring your ideas to life.
              </p>
            </div>

            <form onSubmit={async (e) => {
              e.preventDefault();
              setIsSubmitting(true);
              setStatus(null);

              const formData = new FormData(e.currentTarget);
              const result = await submitContact(formData);

              setIsSubmitting(false);
              setStatus(result);

              if (result.success) {
                (e.target as HTMLFormElement).reset();
              }
            }} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[var(--card-foreground)] font-semibold mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    className="w-full px-4 py-3 border-2 border-[var(--border)] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)] transition-all duration-300 bg-[var(--card-background)] text-[var(--card-foreground)]"
                    placeholder="Your name"
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block text-[var(--card-foreground)] font-semibold mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    className="w-full px-4 py-3 border-2 border-[var(--border)] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)] transition-all duration-300 bg-[var(--card-background)] text-[var(--card-foreground)]"
                    placeholder="your@email.com"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[var(--card-foreground)] font-semibold mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  className="w-full px-4 py-3 border-2 border-[var(--border)] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)] transition-all duration-300 bg-[var(--card-background)] text-[var(--card-foreground)]"
                  placeholder="What's this about?"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-[var(--card-foreground)] font-semibold mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  rows={6}
                  className="w-full px-4 py-3 border-2 border-[var(--border)] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-[var(--accent)] transition-all duration-300 bg-[var(--card-background)] text-[var(--card-foreground)] resize-none"
                  placeholder="Tell me about your project or idea..."
                  required
                  disabled={isSubmitting}
                />
              </div>

              {status && (
                <div className={`p-4 rounded-lg ${status.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {status.message}
                </div>
              )}

              <div className="text-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[var(--accent)] text-[var(--accent-foreground)] font-bold px-10 py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-hover hover:shadow-glow disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactBlogPage;
