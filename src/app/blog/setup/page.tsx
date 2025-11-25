'use client';

import { useState, useEffect } from 'react';
import { client } from '../../../sanity/lib/client';
import Link from 'next/link';

interface SetupBlog {
  _id: string;
  title: string;
  slug: { current: string };
  published: boolean;
}

const BlogSetupPage = () => {
  const [blogs, setBlogs] = useState<SetupBlog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkBlogs = async () => {
      try {
        // Check if there are any blogs in Sanity
        const query = `*[_type == "blog"]`;
        const blogsData: SetupBlog[] = await client.fetch(query);
        setBlogs(blogsData);
        setLoading(false);
      } catch (error) {
        console.error('Error checking blogs:', error);
        setError('Failed to connect to Sanity');
        setLoading(false);
      }
    };

    checkBlogs();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="text-[var(--text-primary)] text-xl">Checking Sanity connection...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] py-20">
      <div className="max-w-4xl mx-auto px-6 lg:px-12">
        <div className="bg-[var(--card-background)] rounded-3xl p-8 shadow-elegant border border-[var(--border)]">
          <h1 className="text-4xl font-bold text-[var(--card-foreground)] mb-8">
            Blog Setup Status
          </h1>

          {error ? (
            <div className="text-red-500 mb-6">
              <h2 className="text-xl font-semibold mb-2">Connection Error</h2>
              <p>{error}</p>
              <p className="mt-2">Please check your Sanity configuration in the environment variables.</p>
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-semibold text-[var(--card-foreground)] mb-4">
                Sanity Connection: ✅ Connected
              </h2>

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-[var(--card-foreground)] mb-2">
                  Blog Posts Found: {blogs.length}
                </h3>

                {blogs.length === 0 ? (
                  <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
                    <p className="font-semibold">No blog posts found in Sanity!</p>
                    <p className="mt-2">This is why you&apos;re getting &quot;Post Not Found&quot; errors.</p>
                  </div>
                ) : (
                  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                    <p className="font-semibold">Blog posts found!</p>
                    <p className="mt-2">Your blog system should be working.</p>
                  </div>
                )}
              </div>

              {blogs.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-[var(--card-foreground)] mb-3">
                    Available Blog Posts:
                  </h3>
                  <div className="space-y-2">
                    {blogs.map((blog) => (
                      <div key={blog._id} className="bg-[var(--section-bg-1)] p-4 rounded-lg">
                        <h4 className="font-semibold text-[var(--text-primary)]">{blog.title}</h4>
                        <p className="text-[var(--muted-foreground)] text-sm">
                          Slug: {blog.slug?.current || 'No slug'}
                        </p>
                        <p className="text-[var(--muted-foreground)] text-sm">
                          Published: {blog.published ? 'Yes' : 'No'}
                        </p>
                        {blog.slug?.current && (
                          <Link
                            href={`/blog/${blog.slug.current}`}
                            className="text-[var(--accent)] hover:underline"
                          >
                            View Blog Post →
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
                <h3 className="font-semibold mb-2">Next Steps:</h3>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Go to your Sanity Studio at <code>/studio</code></li>
                  <li>Create new &quot;Blog&quot; documents</li>
                  <li>Fill in all required fields (title, slug, content, etc.)</li>
                  <li>Set <code>published: true</code></li>
                  <li>Save and publish</li>
                  <li>Your blog posts will appear on <code>/blog</code></li>
                </ol>
              </div>

              <div className="mt-8 flex gap-4">
                <Link
                  href="/blog"
                  className="bg-[var(--accent)] text-[var(--accent-foreground)] font-bold px-6 py-3 rounded-full transition-all duration-300 transform hover:scale-105"
                >
                  Go to Blog
                </Link>
                <Link
                  href="/blog/test-blog"
                  className="border-2 border-[var(--accent)] text-[var(--accent)] font-bold px-6 py-3 rounded-full hover:bg-[var(--accent)] hover:text-[var(--accent-foreground)] transition-all duration-300"
                >
                  View Test Blog
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogSetupPage;
