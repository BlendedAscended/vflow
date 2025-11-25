'use client';

import { useState, useEffect, useRef } from 'react';
import { client } from '../../sanity/lib/client';
import Image from 'next/image';
import Link from 'next/link';

// TypeScript interfaces for blog data
interface BlogPost {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt: string;
  featuredImage?: {
    asset: {
      url: string;
    };
    alt?: string;
  };
  categories: string[];
  publishedAt: string;
  readingTime: number;
  author: {
    name: string;
    image?: {
      asset: {
        url: string;
      };
    };
  };
  featured: boolean;
}

interface CategoryFilter {
  name: string;
  value: string;
  count: number;
}

const BlogPage = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<CategoryFilter[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Fetch blogs from Sanity
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        // First try to get published blogs, then fallback to all blogs
        const query = `
          *[_type == "blog" && published == true] | order(publishedAt desc) {
            _id,
            title,
            slug,
            excerpt,
            featuredImage {
              asset-> {
                url
              },
              alt
            },
            categories,
            publishedAt,
            readingTime,
            author-> {
              name,
              image {
                asset-> {
                  url
                }
              }
            },
            featured
          }
        `;

        let blogsData: BlogPost[] = await client.fetch(query);

        // If no published blogs found, try getting all blogs
        if (blogsData.length === 0) {
          const fallbackQuery = `
            *[_type == "blog"] | order(publishedAt desc) {
              _id,
              title,
              slug,
              excerpt,
              featuredImage {
                asset-> {
                  url
                },
                alt
              },
              categories,
              publishedAt,
              readingTime,
              author-> {
                name,
                image {
                  asset-> {
                    url
                  }
                }
              },
              featured
            }
          `;
          blogsData = await client.fetch(fallbackQuery);
        }

        setBlogs(blogsData);
        setFilteredBlogs(blogsData);

        // Calculate category counts
        const categoryCounts: { [key: string]: number } = {};
        blogsData.forEach(blog => {
          blog.categories.forEach(category => {
            categoryCounts[category] = (categoryCounts[category] || 0) + 1;
          });
        });

        // Function to properly capitalize category names
        const capitalizeCategory = (category: string) => {
          const specialCases: { [key: string]: string } = {
            'ai': 'AI',
            'seo': 'SEO',
            'api': 'API',
            'rpa': 'RPA',
            'llm': 'LLM',
            'it': 'IT',
            'ml': 'ML',
            'nlp': 'NLP',
            'crm': 'CRM',
            'erp': 'ERP'
          };

          return specialCases[category.toLowerCase()] ||
            category.charAt(0).toUpperCase() + category.slice(1);
        };

        const categoryList: CategoryFilter[] = [
          { name: 'All', value: 'all', count: blogsData.length },
          ...Object.entries(categoryCounts).map(([value, count]) => ({
            name: capitalizeCategory(value),
            value,
            count
          }))
        ];

        setCategories(categoryList);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching blogs:', error);
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Filter blogs by category
  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredBlogs(blogs);
    } else {
      setFilteredBlogs(blogs.filter(blog =>
        blog.categories.includes(selectedCategory)
      ));
    }
  }, [selectedCategory, blogs]);

  // Auto-scroll horizontal section
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % Math.max(1, filteredBlogs.length));
    }, 5000);

    return () => clearInterval(interval);
  }, [filteredBlogs.length]);

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Generate a proper slug from title if slug is not available or is too long
  const generateSlug = (blog: BlogPost) => {
    // If slug exists and is reasonable length, use it
    if (blog.slug?.current && blog.slug.current.length < 50) {
      return blog.slug.current;
    }

    // Otherwise, generate a slug from the title
    return blog.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .trim()
      .substring(0, 50); // Limit length
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="text-[var(--text-primary)] text-xl">Loading blogs...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Parallax Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background with parallax effect */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/bg-section-gemini.png)',
            transform: 'translateZ(0)',
          }}
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-[var(--section-bg-1)]/80" />

        {/* Content */}
        <div className="relative z-10 text-center px-6 lg:px-12 max-w-6xl mx-auto">
          <h1 className="text-5xl lg:text-8xl font-extrabold text-[var(--text-primary)] mb-8 animate-fade-in-up">
            <span className="gradient-text">Insights</span> & <span className="gradient-text">Innovation</span>
          </h1>
          <p className="text-xl lg:text-2xl text-[var(--muted-foreground)] mb-12 max-w-4xl mx-auto animate-fade-in-up">
            Explore the latest in AI, technology, and business innovation.
            Weekly insights from the forefront of digital transformation.
          </p>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap justify-center gap-4 mb-8 animate-fade-in-up">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${selectedCategory === category.value
                  ? 'bg-[var(--accent)] text-[var(--accent-foreground)] shadow-glow'
                  : 'bg-[var(--card-background)] text-[var(--card-foreground)] hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)]'
                  }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Horizontal Scrolling Featured Section */}
      <section className="py-20 bg-[var(--section-bg-2)]">
        <div className="max-w-8xl mx-auto px-6 lg:px-12">
          <h2 className="text-4xl lg:text-6xl font-bold text-[var(--text-primary)] text-center mb-16">
            Featured <span className="gradient-text">Articles</span>
          </h2>

          <div className="relative">
            <div
              ref={scrollContainerRef}
              className="flex overflow-x-auto scrollbar-hide space-x-8 pb-4"
              style={{ scrollSnapType: 'x mandatory' }}
            >
              {filteredBlogs.map((blog, index) => (
                <div
                  key={blog._id}
                  className={`flex-shrink-0 w-96 bg-[var(--card-background)] rounded-3xl shadow-elegant border border-[var(--border)] overflow-hidden transition-all duration-500 ${index === currentIndex ? 'scale-105 shadow-glow' : 'hover:scale-102'
                    }`}
                  style={{ scrollSnapAlign: 'start' }}
                >
                  {blog.featuredImage?.asset?.url && (
                    <div className="relative h-48 w-full">
                      <Image
                        src={blog.featuredImage.asset.url}
                        alt={blog.featuredImage.alt || blog.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  <div className="p-8">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {blog.categories.map((category) => (
                        <span
                          key={category}
                          className="px-3 py-1 bg-[var(--accent)] text-[var(--accent-foreground)] text-sm font-semibold rounded-full"
                        >
                          {category}
                        </span>
                      ))}
                    </div>

                    <h3 className="text-xl font-bold text-[var(--card-foreground)] mb-3 line-clamp-2">
                      {blog.title}
                    </h3>

                    <p className="text-[var(--muted-foreground)] mb-4 line-clamp-3">
                      {blog.excerpt}
                    </p>

                    <div className="flex items-center justify-between text-sm text-[var(--muted-foreground)] mb-4">
                      <span>{formatDate(blog.publishedAt)}</span>
                      <span>{blog.readingTime} min read</span>
                    </div>

                    <Link
                      href={`/blog/${generateSlug(blog)}`}
                      className="inline-flex items-center text-[var(--accent)] font-semibold hover:text-[var(--accent-foreground)] transition-colors"
                    >
                      Read More
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation dots */}
            <div className="flex justify-center mt-8 space-x-2">
              {filteredBlogs.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentIndex
                    ? 'bg-[var(--accent)] scale-125'
                    : 'bg-[var(--border)] hover:bg-[var(--accent)]'
                    }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* All Blogs Grid Section */}
      <section className="py-20 bg-[var(--section-bg-1)]">
        <div className="max-w-8xl mx-auto px-6 lg:px-12">
          <h2 className="text-4xl lg:text-6xl font-bold text-[var(--text-primary)] text-center mb-16">
            All <span className="gradient-text">Articles</span>
          </h2>

          {filteredBlogs.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-[var(--muted-foreground)] mb-8">No articles found in this category.</p>
              <div className="space-y-4">
                <p className="text-[var(--muted-foreground)]">You can test the blog functionality with our sample post:</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/blog/test-blog"
                    className="inline-flex items-center bg-[var(--accent)] text-[var(--accent-foreground)] font-bold px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-hover hover:shadow-glow"
                  >
                    View Sample Blog Post
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                  <Link
                    href="/blog/setup"
                    className="inline-flex items-center border-2 border-[var(--accent)] text-[var(--accent)] font-bold px-8 py-4 rounded-full hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)] transition-all duration-300"
                  >
                    Check Blog Setup
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                  <Link
                    href="/blog/debug"
                    className="inline-flex items-center border-2 border-[var(--accent)] text-[var(--accent)] font-bold px-8 py-4 rounded-full hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)] transition-all duration-300"
                  >
                    Debug Blog Posts
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredBlogs.map((blog) => (
                <article
                  key={blog._id}
                  className="bg-[var(--card-background)] rounded-3xl shadow-elegant border border-[var(--border)] overflow-hidden hover:shadow-glow transition-all duration-300 transform hover:scale-105"
                >
                  {blog.featuredImage?.asset?.url && (
                    <div className="relative h-48 w-full">
                      <Image
                        src={blog.featuredImage.asset.url}
                        alt={blog.featuredImage.alt || blog.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  <div className="p-8">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {blog.categories.map((category) => (
                        <span
                          key={category}
                          className="px-3 py-1 bg-[var(--accent)] text-[var(--accent-foreground)] text-sm font-semibold rounded-full"
                        >
                          {category}
                        </span>
                      ))}
                    </div>

                    <h3 className="text-xl font-bold text-[var(--card-foreground)] mb-3 line-clamp-2">
                      {blog.title}
                    </h3>

                    <p className="text-[var(--muted-foreground)] mb-4 line-clamp-3">
                      {blog.excerpt}
                    </p>

                    <div className="flex items-center justify-between text-sm text-[var(--muted-foreground)] mb-4">
                      <span>{formatDate(blog.publishedAt)}</span>
                      <span>{blog.readingTime} min read</span>
                    </div>

                    <Link
                      href={`/blog/${generateSlug(blog)}`}
                      className="inline-flex items-center text-[var(--accent)] font-semibold hover:text-[var(--accent-foreground)] transition-colors"
                    >
                      Read More
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[var(--section-bg-2)]">
        <div className="max-w-6xl mx-auto px-6 lg:px-12 text-center">
          <h2 className="text-4xl lg:text-6xl font-bold text-[var(--text-primary)] mb-8">
            Ready to <span className="gradient-text">Collaborate?</span>
          </h2>
          <p className="text-xl text-[var(--muted-foreground)] mb-12 max-w-4xl mx-auto">
            Let&apos;s create research papers, insightful blogs, and spread the word about AI and technology.
            Join the conversation and be part of the future.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button className="bg-[var(--accent)] text-[var(--accent-foreground)] font-bold px-10 py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-hover hover:shadow-glow">
              Start Collaborating
            </button>
            <button className="border-2 border-[var(--accent)] text-[var(--accent)] font-bold px-10 py-4 rounded-full hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)] transition-all duration-300 transform hover:scale-105">
              Write Research Papers
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogPage;
