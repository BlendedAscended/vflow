import { client } from '../../../sanity/lib/client';
import Image from 'next/image';
import Link from 'next/link';

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
                          } else if (typedBlock._type === 'image' && typedBlock.asset?.url) {
                            return (
                              <div key={index} className="relative my-6">
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