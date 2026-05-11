import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';

export default async function PlanPreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const plan = await prisma.growthPlan.findUnique({
    where: { id },
    select: { wireframeUrl: true, status: true, paidAt: true },
  });

  if (!plan || !plan.wireframeUrl) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Navigation />

      <main className="pt-32 pb-20 px-6 lg:px-12">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl lg:text-3xl font-extrabold text-[var(--text-primary)] mb-1">
                Wireframe Preview
              </h1>
              <p className="text-[var(--muted-foreground)] text-sm">
                AI-generated wireframe for your growth plan
              </p>
            </div>
            <div className="flex items-center gap-3">
              <a
                href={plan.wireframeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg text-sm font-medium border border-[var(--border)] text-[var(--text-primary)] hover:border-[var(--accent)]/50 transition-colors"
              >
                View Full Screen
              </a>
              {!plan.paidAt && (
                <a
                  href="/growth-plan"
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-[var(--accent)] hover:opacity-90 transition-opacity"
                >
                  Move Forward — $19
                </a>
              )}
              {plan.paidAt && (
                <a
                  href="https://calendly.com/verbaflow"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-[var(--accent)] hover:opacity-90 transition-opacity"
                >
                  Book a Call
                </a>
              )}
            </div>
          </div>

          {/* Wireframe iframe */}
          <div className="rounded-xl border border-[var(--border)] overflow-hidden bg-white" style={{ minHeight: '70vh' }}>
            <iframe
              src={plan.wireframeUrl}
              className="w-full border-0"
              style={{ height: '70vh' }}
              title="Wireframe Preview"
              sandbox="allow-scripts allow-same-origin"
            />
          </div>

          {/* Bottom CTA */}
          <div className="mt-8 p-6 rounded-xl border border-[var(--border)] bg-[var(--background)] text-center">
            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">
              Like what you see?
            </h3>
            <p className="text-[var(--muted-foreground)] mb-4">
              Unlock the full wireframe, tech stack details, and implementation plan for just $19.
            </p>
            {!plan.paidAt ? (
              <a
                href="/growth-plan"
                className="inline-block px-8 py-3 rounded-lg font-semibold text-white bg-[var(--accent)] hover:opacity-90 transition-opacity"
              >
                Move Forward — $19
              </a>
            ) : (
              <a
                href="https://calendly.com/verbaflow"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-8 py-3 rounded-lg font-semibold text-white bg-[var(--accent)] hover:opacity-90 transition-opacity"
              >
                Move Forward — Book a Call
              </a>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
