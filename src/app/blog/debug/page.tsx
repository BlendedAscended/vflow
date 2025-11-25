import { client } from '../../../sanity/lib/client';
import Link from 'next/link';

interface DebugBlog {
  _id: string;
  title: string;
  slug: { current: string };
  published: boolean;
  publishedAt: string;
  categories: string[];
  author: {
    name: string;
  };
}

const BlogDebugPage = async () => {
  try {
    // Fetch all blog posts to see their structure
    const query = `*[_type == "blog"] {
      _id,
      title,
      slug,
      published,
      publishedAt,
      categories,
      author-> {
        name
      }
    }`;

    const blogs: DebugBlog[] = await client.fetch(query);

    return (
      <div className="min-h-screen bg-[var(--background)] py-20">
        <div className="max-w-6xl mx-auto px-6 lg:px-12">
          <div className="bg-[var(--card-background)] rounded-3xl p-8 shadow-elegant border border-[var(--border)]">
            <h1 className="text-4xl font-bold text-[var(--card-foreground)] mb-8">
              Blog Debug Information
            </h1>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-[var(--card-foreground)] mb-4">
                Total Blog Posts: {blogs.length}
              </h2>

              {blogs.length === 0 ? (
                <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
                  <p className="font-semibold">No blog posts found in Sanity!</p>
                  <p className="mt-2">Create blog posts in your Sanity Studio first.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {blogs.map((blog, index) => (
                    <div key={blog._id} className="bg-[var(--section-bg-1)] p-6 rounded-2xl border border-[var(--border)]">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-semibold text-[var(--text-primary)] flex-1">
                          {index + 1}. {blog.title}
                        </h3>
                        <div className="flex gap-2">
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${blog.published
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                            }`}>
                            {blog.published ? 'Published' : 'Draft'}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <strong className="text-[var(--text-primary)]">ID:</strong>
                          <p className="text-[var(--muted-foreground)] break-all">{blog._id}</p>
                        </div>

                        <div>
                          <strong className="text-[var(--text-primary)]">Slug:</strong>
                          <p className="text-[var(--muted-foreground)] break-all">
                            {blog.slug?.current || '❌ No slug set'}
                          </p>
                        </div>

                        <div>
                          <strong className="text-[var(--text-primary)]">Author:</strong>
                          <p className="text-[var(--muted-foreground)]">
                            {blog.author?.name || 'No author'}
                          </p>
                        </div>

                        <div>
                          <strong className="text-[var(--text-primary)]">Categories:</strong>
                          <p className="text-[var(--muted-foreground)]">
                            {blog.categories?.join(', ') || 'No categories'}
                          </p>
                        </div>

                        <div>
                          <strong className="text-[var(--text-primary)]">Published Date:</strong>
                          <p className="text-[var(--muted-foreground)]">
                            {blog.publishedAt ? new Date(blog.publishedAt).toLocaleDateString() : 'No date'}
                          </p>
                        </div>

                        <div>
                          <strong className="text-[var(--text-primary)]">URL:</strong>
                          <p className="text-[var(--muted-foreground)] break-all">
                            {blog.slug?.current ? (
                              <Link
                                href={`/blog/${blog.slug.current}`}
                                className="text-[var(--accent)] hover:underline"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                /blog/{blog.slug.current}
                              </Link>
                            ) : (
                              '❌ Cannot create URL - no slug'
                            )}
                          </p>
                        </div>
                      </div>

                      {blog.slug?.current && (
                        <div className="mt-4 pt-4 border-t border-[var(--border)]">
                          <Link
                            href={`/blog/${blog.slug.current}`}
                            className="inline-flex items-center bg-[var(--accent)] text-[var(--accent-foreground)] font-bold px-6 py-3 rounded-full transition-all duration-300 transform hover:scale-105"
                          >
                            Test This Blog Post
                            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </Link>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
              <h3 className="font-semibold mb-2">How to Fix Blog Post Issues:</h3>
              <ol className="list-decimal list-inside space-y-1">
                <li><strong>Missing Slugs:</strong> Go to Sanity Studio, edit each blog post, and set a proper slug (e.g., &quot;my-first-blog&quot;)</li>
                <li><strong>Not Published:</strong> Set the &quot;Published&quot; field to &quot;true&quot; in Sanity Studio</li>
                <li><strong>Missing Author:</strong> Create an author in Sanity Studio and assign it to blog posts</li>
                <li><strong>Missing Categories:</strong> Add categories like &quot;AI&quot;, &quot;Business&quot;, &quot;Tech&quot; to your blog posts</li>
              </ol>
            </div>

            <div className="mt-8 flex gap-4">
              <Link
                href="/blog"
                className="bg-[var(--accent)] text-[var(--accent-foreground)] font-bold px-6 py-3 rounded-full transition-all duration-300 transform hover:scale-105"
              >
                Back to Blog
              </Link>
              <Link
                href="/studio"
                className="border-2 border-[var(--accent)] text-[var(--accent)] font-bold px-6 py-3 rounded-full hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)] transition-all duration-300"
              >
                Open Sanity Studio
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-4">Debug Error</h1>
          <p className="text-[var(--muted-foreground)] mb-8">Failed to fetch blog data from Sanity.</p>
          <p className="text-red-500">Error: {error instanceof Error ? error.message : 'Unknown error'}</p>
        </div>
      </div>
    );
  }
};

export default BlogDebugPage;
