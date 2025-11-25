'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PortableText } from '@portabletext/react';

// Sample blog post data for testing
const sampleBlogPost = {
  _id: 'test-blog',
  title: 'Getting Started with AI in Business: A Complete Guide',
  slug: { current: 'test-blog' },
  excerpt: 'Learn how to implement AI solutions in your business with practical examples and real-world case studies.',
  content: [
    {
      _type: 'block',
      style: 'h2',
      children: [{ text: 'Introduction to AI in Business' }]
    },
    {
      _type: 'block',
      style: 'normal',
      children: [{ text: 'Artificial Intelligence (AI) is transforming how businesses operate, compete, and grow. From automating routine tasks to providing deep insights from data, AI is becoming an essential tool for modern enterprises.' }]
    },
    {
      _type: 'block',
      style: 'h3',
      children: [{ text: 'Key Benefits of AI Implementation' }]
    },
    {
      _type: 'block',
      style: 'normal',
      children: [{ text: '1. Enhanced Efficiency: AI automates repetitive tasks, allowing employees to focus on strategic initiatives.' }]
    },
    {
      _type: 'block',
      style: 'normal',
      children: [{ text: '2. Data-Driven Insights: Machine learning algorithms analyze vast amounts of data to uncover patterns and trends.' }]
    },
    {
      _type: 'block',
      style: 'normal',
      children: [{ text: '3. Improved Customer Experience: AI-powered chatbots and personalization engines create better customer interactions.' }]
    },
    {
      _type: 'block',
      style: 'h3',
      children: [{ text: 'Real-World Applications' }]
    },
    {
      _type: 'block',
      style: 'normal',
      children: [{ text: 'Companies across industries are leveraging AI for various applications. Healthcare organizations use AI for diagnostic assistance, financial institutions employ it for fraud detection, and retail companies utilize it for inventory management and customer service.' }]
    },
    {
      _type: 'block',
      style: 'blockquote',
      children: [{ text: 'The companies that will thrive in the next decade are those that successfully integrate AI into their core business processes.' }]
    },
    {
      _type: 'block',
      style: 'h3',
      children: [{ text: 'Getting Started with AI' }]
    },
    {
      _type: 'block',
      style: 'normal',
      children: [{ text: 'Implementing AI doesn\'t have to be overwhelming. Start with identifying specific pain points in your business that could benefit from automation or data analysis. Consider partnering with AI experts who can guide you through the process and help you choose the right solutions for your needs.' }]
    }
  ],
  featuredImage: {
    asset: {
      url: '/hero-image.png'
    },
    alt: 'AI and Business Technology'
  },
  categories: ['AI', 'Business', 'Technology'],
  publishedAt: '2024-01-15T10:00:00Z',
  readingTime: 5,
  author: {
    name: 'Sandeep Kumar',
    image: {
      asset: {
        url: '/logo.png'
      }
    },
    bio: 'AI and technology enthusiast with expertise in data science and business automation.'
  }
};

const TestBlogPost = () => {
  const [post] = useState(sampleBlogPost);

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

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 bg-[var(--section-bg-1)]">
        <div className="max-w-6xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-12">
            {/* Categories */}
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {post.categories.map((category) => (
                <span
                  key={category}
                  className="px-4 py-2 bg-[var(--accent)] text-[var(--accent-foreground)] text-sm font-semibold rounded-full"
                >
                  {category}
                </span>
              ))}
            </div>

            {/* Title */}
            <h1 className="text-4xl lg:text-6xl font-bold text-[var(--text-primary)] mb-8 leading-tight">
              {post.title}
            </h1>

            {/* Excerpt */}
            <p className="text-xl text-[var(--muted-foreground)] mb-8 max-w-4xl mx-auto">
              {post.excerpt}
            </p>

            {/* Meta Information */}
            <div className="flex flex-wrap justify-center items-center gap-6 text-[var(--muted-foreground)]">
              <div className="flex items-center gap-2">
                {post.author.image && (
                  <Image
                    src={post.author.image.asset.url}
                    alt={post.author.name}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                )}
                <span>By {post.author.name}</span>
              </div>
              <span>•</span>
              <span>{formatDate(post.publishedAt)}</span>
              <span>•</span>
              <span>{post.readingTime} min read</span>
            </div>
          </div>

          {/* Featured Image */}
          {post.featuredImage && (
            <div className="relative h-96 lg:h-[500px] rounded-3xl overflow-hidden shadow-elegant">
              <Image
                src={post.featuredImage.asset.url}
                alt={post.featuredImage.alt || post.title}
                fill
                className="object-cover"
              />
            </div>
          )}
        </div>
      </section>

      {/* Content Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 lg:px-12">
          <div className="prose prose-lg max-w-none">
            <PortableText value={post.content} components={components} />
          </div>
        </div>
      </section>

      {/* Author Section */}
      <section className="py-16 bg-[var(--section-bg-2)]">
        <div className="max-w-4xl mx-auto px-6 lg:px-12">
          <div className="bg-[var(--card-background)] rounded-3xl p-8 shadow-elegant border border-[var(--border)]">
            <div className="flex items-start gap-6">
              {post.author.image && (
                <Image
                  src={post.author.image.asset.url}
                  alt={post.author.name}
                  width={80}
                  height={80}
                  className="rounded-full flex-shrink-0"
                />
              )}
              <div>
                <h3 className="text-2xl font-bold text-[var(--card-foreground)] mb-2">
                  About {post.author.name}
                </h3>
                {post.author.bio && (
                  <p className="text-[var(--muted-foreground)] leading-relaxed">
                    {post.author.bio}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[var(--section-bg-1)]">
        <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-[var(--text-primary)] mb-8">
            Ready to implement AI in your business?
          </h2>
          <p className="text-xl text-[var(--muted-foreground)] mb-12">
            Let's discuss how AI can transform your business operations and drive growth.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              href="/blog"
              className="bg-[var(--accent)] text-[var(--accent-foreground)] font-bold px-10 py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-hover hover:shadow-glow"
            >
              Read More Articles
            </Link>
            <button className="border-2 border-[var(--accent)] text-[var(--accent)] font-bold px-10 py-4 rounded-full hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)] transition-all duration-300 transform hover:scale-105">
              Get Started
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TestBlogPost;
