import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import PlanStatusClient from './PlanStatusClient';

const PIPELINE_STAGES = [
  { key: 'queued', label: 'Queued', icon: '📋' },
  { key: 'drafting', label: 'Drafting', icon: '✍️' },
  { key: 'designing', label: 'Designing', icon: '🎨' },
  { key: 'backend', label: 'Backend', icon: '⚙️' },
  { key: 'validating', label: 'Validating', icon: '✅' },
  { key: 'marketing', label: 'Marketing', icon: '📣' },
  { key: 'delivery', label: 'Delivery', icon: '📦' },
  { key: 'wireframe_ready', label: 'Wireframe Ready', icon: '🚀' },
];

const AGENT_LABELS: Record<string, string> = {
  architect: 'Architect',
  designer: 'Designer',
  backend: 'Backend Engineer',
  validator: 'Validator',
  marketing: 'Marketing Strategist',
  booking: 'Booking Agent',
};

export default async function PlanStatusPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const plan = await prisma.growthPlan.findUnique({
    where: { id },
    include: { agentRuns: true },
  });

  if (!plan) {
    notFound();
  }

  const currentStageIndex = PIPELINE_STAGES.findIndex(
    (s) => s.key === plan.status
  );

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Navigation />

      <main className="pt-32 pb-20 px-6 lg:px-12">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl lg:text-4xl font-extrabold text-[var(--text-primary)] mb-3">
              Your Growth Plan
            </h1>
            <p className="text-[var(--muted-foreground)] text-lg">
              Plan ID:{' '}
              <code className="text-xs px-2 py-1 rounded bg-[var(--border)]/30 font-mono">
                {id.slice(0, 8)}...
              </code>
            </p>
          </div>

          {/* Pipeline Progress */}
          <div className="mb-10 p-6 rounded-xl border border-[var(--border)] bg-[var(--background)]">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--muted-foreground)] mb-6">
              Pipeline Progress
            </h2>

            {/* Visual progress bar */}
            <div className="flex items-center gap-0 mb-6">
              {PIPELINE_STAGES.map((stage, i) => {
                const isActive = i <= currentStageIndex;
                const isCurrent = i === currentStageIndex;
                return (
                  <div key={stage.key} className="flex items-center flex-1">
                    <div className="flex flex-col items-center flex-1">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm border-2 transition-all ${
                          isCurrent
                            ? 'border-[var(--accent)] bg-[var(--accent)]/20 text-[var(--accent)] animate-pulse'
                            : isActive
                            ? 'border-[var(--accent)] bg-[var(--accent)] text-white'
                            : 'border-[var(--border)] text-[var(--muted-foreground)]/40'
                        }`}
                      >
                        {isActive ? stage.icon : stage.icon}
                      </div>
                      <span
                        className={`text-[10px] mt-1.5 font-medium hidden lg:block ${
                          isCurrent
                            ? 'text-[var(--accent)]'
                            : isActive
                            ? 'text-[var(--text-primary)]'
                            : 'text-[var(--muted-foreground)]/40'
                        }`}
                      >
                        {stage.label}
                      </span>
                    </div>
                    {i < PIPELINE_STAGES.length - 1 && (
                      <div
                        className={`flex-1 h-0.5 mx-0.5 ${
                          i < currentStageIndex
                            ? 'bg-[var(--accent)]'
                            : 'bg-[var(--border)]'
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Status text */}
            <div className="text-center">
              <span
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${
                  plan.status === 'wireframe_ready'
                    ? 'bg-green-500/10 text-green-400 border border-green-500/30'
                    : plan.status === 'failed'
                    ? 'bg-red-500/10 text-red-400 border border-red-500/30'
                    : 'bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/30'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    plan.status === 'wireframe_ready' ||
                    plan.status === 'paid' ||
                    plan.status === 'moved_forward'
                      ? 'bg-green-400'
                      : plan.status === 'failed'
                      ? 'bg-red-400'
                      : 'bg-[var(--accent)] animate-pulse'
                  }`}
                />
                {PIPELINE_STAGES[currentStageIndex]?.label ?? plan.status}
              </span>
            </div>
          </div>

          {/* Client-side polling section */}
          <PlanStatusClient planId={id} initialData={plan} />

          {/* Wireframe preview link (if ready) */}
          {plan.wireframeUrl && (
            <div className="mt-8 p-6 rounded-xl border border-[var(--accent)]/40 bg-[var(--accent)]/5">
              <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">
                Your Wireframe is Ready!
              </h3>
              <p className="text-[var(--muted-foreground)] mb-4">
                The AI architects have completed your custom growth plan
                wireframe.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={`/plan/${id}/preview`}
                  className="px-6 py-3 rounded-lg font-semibold text-center text-white bg-[var(--accent)] hover:opacity-90 transition-opacity"
                >
                  Preview Wireframe
                </a>
                {!plan.paidAt && (
                  <a
                    href="/growth-plan"
                    className="px-6 py-3 rounded-lg font-semibold text-center border border-[var(--border)] text-[var(--text-primary)] hover:border-[var(--accent)]/50 transition-colors"
                  >
                    Upgrade — $19
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Move Forward CTA (if paid) */}
          {plan.paidAt && (
            <div className="mt-8 p-6 rounded-xl border border-green-500/30 bg-green-500/5 text-center">
              <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">
                Plan Unlocked
              </h3>
              <p className="text-[var(--muted-foreground)] mb-4">
                Your full wireframe and tech stack are ready. Let&apos;s discuss
                your project with a real human.
              </p>
              <a
                href="https://calendly.com/verbaflow"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-8 py-3 rounded-lg font-semibold text-white bg-[var(--accent)] hover:opacity-90 transition-opacity"
              >
                Move Forward — Book a Call
              </a>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
