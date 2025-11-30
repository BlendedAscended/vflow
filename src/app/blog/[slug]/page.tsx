import { client } from '../../../sanity/lib/client';
import ContactSection from '../../../components/ContactSection';
import Image from 'next/image';
import Link from 'next/link';
import { PortableText } from '@portabletext/react';

// TypeScript interfaces for blog post data
interface BlogPost {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt: string;
  content: unknown[];
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

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
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
    const postQuery = `
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

// Format date for display
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const BlogPostPage = async ({ params }: BlogPostPageProps) => {
  const { slug } = await params;

  try {
    // Fetch blog post
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

    return (
      <div className="min-h-screen bg-[var(--background)]">
        {/* Hero Section */}
        <section className="relative pt-16 !pb-0 lg:pt-24 lg:!pb-0 bg-[var(--section-bg-1)]">
          <div className="max-w-[90%] 2xl:max-w-[1600px] mx-auto px-6 lg:px-12">
            <div className="text-center !mb-6">
              {/* Breadcrumbs */}
              <nav className="flex justify-center items-center gap-2 text-sm text-[var(--muted-foreground)] mb-6 animate-fade-in">
                <Link href="/" className="hover:text-[var(--accent)] transition-colors">Home</Link>
                <span>/</span>
                <Link href="/blog" className="hover:text-[var(--accent)] transition-colors">Blog</Link>
                <span>/</span>
                <span className="text-[var(--text-primary)] truncate max-w-[200px]">{String(post.title || 'Post')}</span>
              </nav>

              {/* Categories */}
              <div className="flex flex-wrap justify-center gap-2 mb-6 animate-fade-in-up">
                {post.categories && Array.isArray(post.categories) ? (
                  post.categories.map((category, index) => {
                    const categoryText = String(category || '');
                    return (
                      <span
                        key={`${categoryText}-${index}`}
                        className="px-3 py-1 bg-[var(--accent)]/10 text-[var(--accent)] text-xs font-bold uppercase tracking-wider rounded-full border border-[var(--accent)]/20"
                      >
                        {categoryText}
                      </span>
                    );
                  })
                ) : (
                  <span className="px-3 py-1 bg-gray-200 text-gray-600 text-xs font-bold uppercase tracking-wider rounded-full">
                    No categories
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-4xl lg:text-6xl font-extrabold text-[var(--text-primary)] mb-6 leading-tight tracking-tight animate-fade-in-up">
                {String(post.title || 'Untitled')}
              </h1>

              {/* Excerpt */}
              <div className="text-xl text-[var(--muted-foreground)] mb-8 max-w-5xl mx-auto leading-relaxed animate-fade-in-up">
                {String(post.excerpt || 'No excerpt available')}
              </div>

              {/* Meta Information */}
              <div className="flex flex-wrap justify-center items-center gap-4 text-sm font-medium text-[var(--muted-foreground)] animate-fade-in-up">
                <div className="flex items-center gap-2 bg-[var(--card-background)] px-4 py-2 rounded-full border border-[var(--border)]">
                  {post.author?.image?.asset?.url && (
                    <Image
                      src={post.author.image.asset.url}
                      alt={String(post.author.name || 'Author')}
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                  )}
                  <span>{String(post.author?.name || 'Unknown Author')}</span>
                </div>
                <div className="flex items-center gap-4 bg-[var(--card-background)] px-4 py-2 rounded-full border border-[var(--border)]">
                  <span>{post.publishedAt ? formatDate(post.publishedAt) : 'No date'}</span>
                  <span className="w-1 h-1 bg-[var(--muted-foreground)] rounded-full"></span>
                  <span>{post.readingTime || 0} min read</span>
                </div>
              </div>
            </div>

            {/* Featured Image */}
            {post.featuredImage?.asset?.url && (
              <div className="relative h-64 lg:h-[400px] rounded-3xl overflow-hidden shadow-2xl border border-[var(--border)] animate-fade-in-up mb-8">
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
        <section className="!pt-4 pb-12 relative">
          <div className="max-w-[90%] 2xl:max-w-[1600px] mx-auto px-6 lg:px-12 relative">
            {/* Subtle border container */}
            <div className="relative">
              {/* Very subtle outer glow */}
              <div className="absolute -inset-0.5 bg-gradient-to-b from-[var(--accent)]/20 to-transparent rounded-2xl blur-sm opacity-50"></div>

              {/* Main content container */}
              <div className="relative bg-[var(--card-background)] rounded-2xl border border-[var(--border)] shadow-2xl overflow-hidden backdrop-blur-sm">
                {/* Calculator-like Header Bar */}
                <div className="h-2 bg-[var(--accent)]/20 w-full"></div>

                {/* Content area with enhanced styling */}
                <div className="px-8 py-10 lg:px-12 lg:py-14">
                  <div className="max-w-none text-[var(--text-primary)]/90">
                    {/* Render content blocks with premium styling */}
                    {Array.isArray(post.content) && post.content.length > 0 ? (
                      <div className="!space-y-8">
                        {post.content.map((block, index) => {
                          // Cast block to a usable type since we are using unknown
                          const typedBlock = block as {
                            _type: string;
                            children?: { text: string }[];
                            style?: string;
                            asset?: { url: string };
                            alt?: string;
                            caption?: string;
                          };

                          // Only render if block is valid
                          if (!typedBlock || typeof typedBlock !== 'object') {
                            return null;
                          }

                          // Handle different block types with subtle styling
                          if (typedBlock._type === 'block' && typedBlock.children && Array.isArray(typedBlock.children)) {
                            const blockText = typedBlock.children
                              .filter((child: unknown) => child && typeof child === 'object' && 'text' in child)
                              .map((child: unknown) => (child as { text: string }).text)
                              .join(' ');

                            if (blockText.trim()) {
                              const blockStyle = typedBlock.style || 'normal';
                              switch (blockStyle) {
                                case 'h1':
                                  return (
                                    <div key={index} className="relative">
                                      <div className="absolute -left-2 top-0 w-0.5 h-full bg-[var(--accent)] rounded-full"></div>
                                      <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-4 mt-8 leading-tight pl-4">
                                        {blockText}
                                      </h1>
                                    </div>
                                  );
                                case 'h2':
                                  return (
                                    <div key={index} className="relative mt-12 mb-6">
                                      <h2 className="text-3xl font-bold text-[var(--text-primary)] relative inline-block">
                                        {blockText}
                                        {/* Decorative underline */}
                                        <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-[var(--accent)] to-transparent rounded-full opacity-60"></div>
                                      </h2>
                                    </div>
                                  );
                                case 'h3':
                                  return (
                                    <h3 key={index} className="text-2xl font-bold text-[var(--text-primary)] mb-3 mt-6 relative">
                                      <span className="inline-block px-2 py-1 bg-[var(--accent)]/10 rounded border-l-2 border-[var(--accent)]">
                                        {blockText}
                                      </span>
                                    </h3>
                                  );
                                case 'h4':
                                  return (
                                    <h4 key={index} className="text-xl font-bold text-[var(--text-primary)] mb-2 mt-4 flex items-center">
                                      <div className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full mr-2"></div>
                                      {blockText}
                                    </h4>
                                  );
                                case 'blockquote':
                                  return (
                                    <div key={index} className="relative my-8">
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
                                    <div key={index} className="text-[var(--text-primary)] leading-loose text-lg">
                                      {(() => {
                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                        const portableTextValue = [typedBlock] as any;
                                        return (
                                          <PortableText
                                            value={portableTextValue}
                                            components={{
                                              block: {
                                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                                normal: ({ children }: any) => <div className="mb-0">{children}</div>
                                              }
                                            }}
                                          />
                                        );
                                      })()}
                                    </div>
                                  );
                              }
                            }
                          } else if (typedBlock._type === 'image' && typedBlock.asset?.url) {
                            return (
                              <div key={index} className="relative my-8">
                                <div className="bg-[var(--card-background)] rounded-lg border border-[var(--border)] p-3 shadow-sm">
                                  <Image
                                    src={typedBlock.asset.url}
                                    alt={typedBlock.alt || 'Blog Image'}
                                    width={800}
                                    height={400}
                                    className="rounded-lg w-full h-auto"
                                  />
                                  {typedBlock.caption && (
                                    <p className="text-center text-[var(--muted-foreground)] text-sm mt-2 italic bg-[var(--section-bg-1)] rounded px-3 py-2">
                                      {typedBlock.caption}
                                    </p>
                                  )}
                                </div>
                              </div>
                            );
                          }

                          // Fallback for unknown types (Hybrid Strategy)
                          // This catches new block types (like YouTube) that we haven't manually handled
                          return (
                            <div key={index} className="my-8">
                              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                              <PortableText value={[typedBlock] as any} />
                            </div>
                          );
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
        {/* CTA Section */}
        <ContactSection />
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