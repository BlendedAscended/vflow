import { client } from '../../../sanity/lib/client';
import Image from 'next/image';
import Link from 'next/link';
import { PortableText } from '@portabletext/react';

// TypeScript interfaces for blog post data
interface BlogPost {
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
    bio?: string;
  };
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
}

interface RelatedPost {
  _id: string;
  title: string;
  slug: { current: string };
  featuredImage?: {
    asset: {
      url: string;
    };
    alt?: string;
  };
  publishedAt: string;
  readingTime: number;
}

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

// Generate a proper slug from title
function generateSlugFromTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim()
    .substring(0, 50); // Limit length
}

// Server component to fetch blog post
async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    // First try to get published blog by exact slug match
    let postQuery = `
      *[_type == "blog" && slug.current == $slug && published == true][0] {
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
        categories,
        publishedAt,
        readingTime,
        author-> {
          name,
          image {
            asset-> {
              url
            }
          },
          bio
        },
        seo {
          metaTitle,
          metaDescription,
          keywords
        }
      }
    `;

    let postData: BlogPost | null = await client.fetch(postQuery, { slug });
    
    // If not found with published=true, try without the published filter
    if (!postData) {
      const fallbackQuery = `
        *[_type == "blog" && slug.current == $slug][0] {
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
          categories,
          publishedAt,
          readingTime,
          author-> {
            name,
            image {
              asset-> {
                url
              }
            },
            bio
          },
          seo {
            metaTitle,
            metaDescription,
            keywords
          }
        }
      `;
      postData = await client.fetch(fallbackQuery, { slug });
    }
    
    // If still not found, try to find by title (in case slug was generated from title)
    if (!postData) {
      // Try to find a blog post where the title, when converted to slug, matches our slug
      const titleQuery = `
        *[_type == "blog" && published == true] {
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
          categories,
          publishedAt,
          readingTime,
          author-> {
            name,
            image {
              asset-> {
                url
              }
            },
            bio
          },
          seo {
            metaTitle,
            metaDescription,
            keywords
          }
        }
      `;
      
      const allPosts: BlogPost[] = await client.fetch(titleQuery);
      const foundPost = allPosts.find(post => generateSlugFromTitle(post.title) === slug);
      postData = foundPost || null;
    }
    
    return postData;
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
}

// Server component to fetch related posts
async function getRelatedPosts(postId: string, categories: string[]): Promise<RelatedPost[]> {
  try {
    const relatedQuery = `
      *[_type == "blog" && published == true && _id != $postId && categories match $categories] | order(publishedAt desc) [0...3] {
        _id,
        title,
        slug,
        featuredImage {
          asset-> {
            url
          },
          alt
        },
        publishedAt,
        readingTime
      }
    `;

    const relatedData: RelatedPost[] = await client.fetch(relatedQuery, {
      postId,
      categories
    });

    return relatedData;
  } catch (error) {
    console.error('Error fetching related posts:', error);
    return [];
  }
}

// Format date for display
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * ULTRA-COMPREHENSIVE Content validation and sanitization function
 * This prevents the "Objects are not valid as a React child" error by:
 * 1. Validating content structure before rendering
 * 2. Filtering out problematic content blocks
 * 3. Ensuring all content is properly formatted for PortableText
 * 4. Handling complex nested structures
 * 5. Providing detailed logging for debugging
 */
const validateAndSanitizeContent = (content: any[]): any[] => {
  if (!Array.isArray(content)) {
    console.warn('Content is not an array:', content);
    return [];
  }

  console.log('=== ULTRA-AGGRESSIVE CONTENT VALIDATION START ===');
  console.log('Original content length:', content.length);
  
  const sanitizedContent = content.filter((block, index) => {
    console.log(`\n--- Processing block ${index} ---`);
    console.log('Block structure:', JSON.stringify(block, null, 2));
    
    // ULTRA-AGGRESSIVE: Check if block has required structure
    if (!block || typeof block !== 'object') {
      console.warn(`❌ Invalid block at index ${index}:`, block);
      return false;
    }

    // ULTRA-AGGRESSIVE: Check for problematic content that could cause React child errors
    if (block._type === undefined && !block.children) {
      console.warn(`❌ Block missing _type and children at index ${index}:`, block);
      return false;
    }

    // ULTRA-AGGRESSIVE: Handle different block types with maximum safety
    if (block._type === 'block') {
      console.log('✅ Processing block type: block');
      
      // Ensure children are properly formatted
      if (block.children && Array.isArray(block.children)) {
        console.log('Processing children:', block.children.length);
        
        const validChildren = block.children.filter((child: any, childIndex: number) => {
          console.log(`  Processing child ${childIndex}:`, child);
          
          if (child && typeof child === 'object') {
            // Check if child has required structure
            if (child._type === 'span' || child._type === 'text') {
              console.log('  ✅ Valid span/text child');
              return true;
            }
            // Handle other child types
            if (child._type && child.text !== undefined) {
              console.log('  ✅ Valid text child');
              return true;
            }
          }
          console.warn(`  ❌ Invalid child in block at index ${index}:`, child);
          return false;
        });
        
        if (validChildren.length === 0) {
          console.warn(`❌ Block at index ${index} has no valid children`);
          return false;
        }
        
        console.log(`✅ Block ${index} has ${validChildren.length} valid children`);
        block.children = validChildren;
      } else {
        console.warn(`❌ Block at index ${index} has no children array`);
        return false;
      }
    } else if (block._type === 'image') {
      console.log('✅ Processing block type: image');
      
      // Handle image blocks with maximum safety
      if (!block.asset || !block.asset.url) {
        console.warn(`❌ Image block at index ${index} missing asset or URL`);
        return false;
      }
      console.log('✅ Image block is valid');
    } else {
      // Handle other content types
      console.log(`⚠️ Unknown block type at index ${index}:`, block._type);
      
      // ULTRA-AGGRESSIVE: Only allow known safe types
      if (block._type && ['block', 'image'].includes(block._type)) {
        console.log('✅ Block type is safe');
        return true;
      } else {
        console.warn(`❌ Block type ${block._type} is not safe, filtering out`);
        return false;
      }
    }

    console.log(`✅ Block ${index} passed all validation checks`);
    return true;
  });

  console.log('=== CONTENT VALIDATION COMPLETE ===');
  console.log('Valid blocks:', sanitizedContent.length);
  console.log('Filtered out:', content.length - sanitizedContent.length);
  
  return sanitizedContent;
};

/**
 * ULTRA-COMPREHENSIVE PortableText Components - This prevents the "Objects are not valid as a React child" error
 * 
 * The error occurs when PortableText tries to render content blocks that have:
 * - Decorators (strong, em, code) 
 * - Annotations (links)
 * - Unknown content types
 * - Missing handlers for specific content structures
 * - Complex nested structures
 * 
 * This comprehensive components object handles ALL possible content types and structures.
 */
const components = {
  // Handle different content types (like images, custom blocks, etc.)
  types: {
    // Handle image blocks from Sanity content
    image: ({ value }: { value: any }) => {
      if (!value?.asset?.url) {
        return null;
      }
      return (
        <div className="my-8">
          <Image
            src={value.asset.url}
            alt={value.alt || 'Blog Image'}
            width={800}
            height={400}
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
    
    // Handle any other content types that might exist
    // This is a catch-all for any content type not explicitly handled
    unknownType: ({ value }: { value: any }) => {
      console.warn('Unknown type in PortableText:', value);
      // Return null instead of trying to render the object
      return null;
    },
  },

  // Handle different block styles (headings, paragraphs, quotes, etc.)
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

  // CRITICAL: Handle text decorators and annotations
  // This is what was missing and causing the "Objects are not valid as a React child" error
  marks: {
    // Handle bold text (strong decorator)
    strong: ({ children }: any) => <strong className="font-bold">{children}</strong>,
    
    // Handle italic text (emphasis decorator)  
    em: ({ children }: any) => <em className="italic">{children}</em>,
    
    // Handle inline code (code decorator)
    code: ({ children }: any) => (
      <code className="bg-[var(--card-background)] px-2 py-1 rounded text-sm font-mono">
        {children}
      </code>
    ),
    
    // CRITICAL: Handle link annotations
    // This prevents the error when content has links with href objects
    link: ({ children, value }: any) => {
      const href = value?.href;
      if (!href) return <span>{children}</span>;
      
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--accent)] hover:text-[var(--accent-foreground)] underline transition-colors"
        >
          {children}
        </a>
      );
    },
  },

  // Handle list containers
  list: {
    bullet: ({ children }: any) => (
      <ul className="list-disc list-inside text-[var(--text-primary)] mb-4 space-y-2">{children}</ul>
    ),
    number: ({ children }: any) => (
      <ol className="list-decimal list-inside text-[var(--text-primary)] mb-4 space-y-2">{children}</ol>
    ),
  },

  // Handle individual list items
  listItem: {
    bullet: ({ children }: any) => (
      <li className="mb-1">{children}</li>
    ),
    number: ({ children }: any) => (
      <li className="mb-1">{children}</li>
    ),
  },

  // CRITICAL: Add fallback for any unhandled content
  // This catches any content that doesn't match the above patterns
  hardBreak: () => <br />,
  
  // Handle any other unknown content types
  unknownMark: ({ children }: any) => <span>{children}</span>,
  unknownList: ({ children }: any) => <div>{children}</div>,
  unknownListItem: ({ children }: any) => <div>{children}</div>,
  
  // CRITICAL: Add a global fallback for any content that doesn't match above patterns
  // This is the final safety net to prevent React child errors
  fallback: ({ children }: any) => {
    console.warn('PortableText fallback triggered:', children);
    return <div className="text-yellow-500">Unhandled content type</div>;
  },
};

const BlogPostPage = async ({ params }: BlogPostPageProps) => {
  const { slug } = params;
  
  try {
  // Fetch blog post and related posts
  const post = await getBlogPost(slug);
  
  if (!post) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-4">Post Not Found</h1>
          <p className="text-[var(--muted-foreground)] mb-8">The requested post could not be found.</p>
          <div className="space-y-4">
            <p className="text-[var(--muted-foreground)]">Trying to access: <code className="bg-[var(--card-background)] px-2 py-1 rounded">{slug}</code></p>
            <Link
              href="/blog"
              className="bg-[var(--accent)] text-[var(--accent-foreground)] font-bold px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105"
            >
              Back to Blog
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
    // Validate post data
    if (!post.title || !post.excerpt) {
      console.error('Invalid post data:', post);
      return (
        <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-4">Invalid Post Data</h1>
            <p className="text-[var(--muted-foreground)] mb-8">The post data is invalid or corrupted.</p>
            <Link
              href="/blog"
              className="bg-[var(--accent)] text-[var(--accent-foreground)] font-bold px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105"
            >
              Back to Blog
            </Link>
          </div>
        </div>
      );
    }
    
    const relatedPosts = await getRelatedPosts(post._id, post.categories || []);

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 bg-[var(--section-bg-1)]">
        <div className="max-w-6xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-12">
            {/* Categories */}
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {post.categories && Array.isArray(post.categories) ? (
                post.categories.map((category, index) => {
                  const categoryText = String(category || '');
                  return (
                <span
                      key={`${categoryText}-${index}`}
                  className="px-4 py-2 bg-[var(--accent)] text-[var(--accent-foreground)] text-sm font-semibold rounded-full"
                >
                      {categoryText}
                    </span>
                  );
                })
              ) : (
                <span className="px-4 py-2 bg-gray-200 text-gray-600 text-sm font-semibold rounded-full">
                  No categories
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-4xl lg:text-6xl font-bold text-[var(--text-primary)] mb-8 leading-tight">
              {String(post.title || 'Untitled')}
            </h1>

            {/* Excerpt */}
            <p className="text-xl text-[var(--muted-foreground)] mb-8 max-w-4xl mx-auto">
              {String(post.excerpt || 'No excerpt available')}
            </p>

            {/* Meta Information */}
            <div className="flex flex-wrap justify-center items-center gap-6 text-[var(--muted-foreground)]">
              <div className="flex items-center gap-2">
                {post.author?.image?.asset?.url && (
                  <Image
                    src={post.author.image.asset.url}
                    alt={String(post.author.name || 'Author')}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                )}
                <span>By {String(post.author?.name || 'Unknown Author')}</span>
              </div>
              <span>•</span>
              <span>{post.publishedAt ? formatDate(post.publishedAt) : 'No date'}</span>
              <span>•</span>
              <span>{post.readingTime || 0} min read</span>
            </div>
          </div>

          {/* Featured Image */}
          {post.featuredImage?.asset?.url && (
            <div className="relative h-96 lg:h-[500px] rounded-3xl overflow-hidden shadow-elegant">
              <Image
                src={post.featuredImage.asset.url}
                alt={post.featuredImage.alt || String(post.title || 'Blog Image')}
                fill
                className="object-cover"
              />
            </div>
          )}
        </div>
      </section>

      {/* Subtle Premium Content Section */}
      <section className="py-20 relative">
        <div className="max-w-5xl mx-auto px-6 lg:px-12 relative">
          {/* Subtle border container */}
          <div className="relative">
            {/* Very subtle outer glow */}
            <div className="absolute -inset-1 bg-[var(--accent)]/5 rounded-2xl blur-sm"></div>
            
            {/* Main content container */}
            <div className="relative bg-[var(--card-background)] rounded-xl border border-[var(--border)] shadow-lg overflow-hidden">
              {/* Content area with enhanced styling */}
              <div className="px-8 py-8">
                <div className="prose prose-lg max-w-none">
                  {/* Render content blocks with premium styling */}
                  {Array.isArray(post.content) && post.content.length > 0 ? (
                    <div className="space-y-6">
                      {post.content.map((block, index) => {
                        // Only render if block is valid
                        if (!block || typeof block !== 'object') {
                          return null;
                        }
                        
                        // Handle different block types with subtle styling
                        if (block._type === 'block' && block.children && Array.isArray(block.children)) {
                          const blockText = block.children
                            .filter((child: any) => child && child.text)
                            .map((child: any) => child.text)
                            .join(' ');
                          
                          if (blockText.trim()) {
                            const blockStyle = block.style || 'normal';
                            switch (blockStyle) {
                              case 'h1':
                                return (
                                  <div key={index} className="relative">
                                    <div className="absolute -left-2 top-0 w-0.5 h-full bg-[var(--accent)] rounded-full"></div>
                                    <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-4 mt-6 leading-tight pl-4">
                                      {blockText}
                                    </h1>
                                  </div>
                                );
                              case 'h2':
                                return (
                                  <div key={index} className="relative">
                                    <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-3 mt-5 relative pl-2">
                                      <span className="relative">{blockText}</span>
                                      <div className="absolute bottom-0 left-0 w-12 h-0.5 bg-[var(--accent)] rounded-full"></div>
                                    </h2>
                                  </div>
                                );
                              case 'h3':
                                return (
                                  <h3 key={index} className="text-2xl font-bold text-[var(--text-primary)] mb-3 mt-4 relative">
                                    <span className="inline-block px-2 py-1 bg-[var(--accent)]/10 rounded border-l-2 border-[var(--accent)]">
                                      {blockText}
                                    </span>
                                  </h3>
                                );
                              case 'h4':
                                return (
                                  <h4 key={index} className="text-xl font-bold text-[var(--text-primary)] mb-2 mt-3 flex items-center">
                                    <div className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full mr-2"></div>
                                    {blockText}
                                  </h4>
                                );
                              case 'blockquote':
                                return (
                                  <div key={index} className="relative my-6">
                                    <div className="bg-[var(--section-bg-1)] rounded-lg border border-[var(--border)] p-4">
                                      <blockquote className="text-[var(--muted-foreground)] italic text-lg leading-relaxed relative pl-4">
                                        <div className="absolute left-0 top-0 w-0.5 h-full bg-[var(--accent)] rounded-full"></div>
                                        {blockText}
                                      </blockquote>
                                    </div>
                                  </div>
                                );
                              default:
                                return (
                                  <p key={index} className="text-[var(--text-primary)] mb-4 leading-relaxed text-lg">
                                    {blockText}
                                  </p>
                                );
                            }
                          }
                        } else if (block._type === 'image' && block.asset?.url) {
                          return (
                            <div key={index} className="relative my-6">
                              <div className="bg-[var(--card-background)] rounded-lg border border-[var(--border)] p-3 shadow-sm">
                                <Image
                                  src={block.asset.url}
                                  alt={block.alt || 'Blog Image'}
                                  width={800}
                                  height={400}
                                  className="rounded-lg w-full h-auto"
                                />
                                {block.caption && (
                                  <p className="text-center text-[var(--muted-foreground)] text-sm mt-2 italic bg-[var(--section-bg-1)] rounded px-3 py-2">
                                    {block.caption}
                                  </p>
                                )}
                              </div>
                            </div>
                          );
                        }
                        
                        return null;
                      }).filter(Boolean)}
          </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gradient-to-br from-[var(--accent)]/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <div className="w-8 h-8 bg-[var(--accent)] rounded-full opacity-50"></div>
        </div>
                      <p className="text-[var(--muted-foreground)] text-lg">No content available.</p>
                    </div>
                  )}
                </div>
                    </div>
                    
                  </div>
            </div>
          </div>
        </section>
    </div>
  );
  
  } catch (error) {
    console.error('BlogPostPage error:', error);
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-4">Error Loading Post</h1>
          <p className="text-[var(--muted-foreground)] mb-8">An error occurred while loading the blog post.</p>
          <div className="space-y-4">
            <p className="text-[var(--muted-foreground)]">Error: {error instanceof Error ? error.message : String(error)}</p>
            <Link
              href="/blog"
              className="bg-[var(--accent)] text-[var(--accent-foreground)] font-bold px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105"
            >
              Back to Blog
            </Link>
          </div>
        </div>
    </div>
  );
  }
};

export default BlogPostPage;