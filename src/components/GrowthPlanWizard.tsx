'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface WizardData {
  email: string;
  industry: string;
  subIndustry: string;
  stage: string;
  challenges: string[];
  goals: string[];
  budget: string;
  timeline: string;
}

const STEPS = [
  'Email',
  'Industry',
  'Stage',
  'Challenges',
  'Goals',
  'Budget & Timeline',
  'Review',
];

const INDUSTRIES = [
  { value: 'saas', label: 'SaaS', subs: ['B2B', 'B2C', 'Enterprise', 'Marketplace'] },
  { value: 'ecommerce', label: 'E-Commerce', subs: ['DTC', 'Marketplace', 'Subscription Box', 'Dropshipping'] },
  { value: 'healthcare', label: 'Healthcare', subs: ['Telehealth', 'Health Tech', 'Fitness', 'Mental Health'] },
  { value: 'fintech', label: 'FinTech', subs: ['Payments', 'Lending', 'Investment', 'Insurance'] },
  { value: 'education', label: 'Education', subs: ['EdTech', 'Corporate Training', 'Tutoring', 'LMS'] },
  { value: 'other', label: 'Other', subs: ['General', 'Custom'] },
];

const STAGES = [
  { value: 'idea', label: 'Just an idea', desc: 'Validating the concept' },
  { value: 'mvp', label: 'MVP built', desc: 'Early users testing' },
  { value: 'traction', label: 'Some traction', desc: 'Growing user base' },
  { value: 'scaling', label: 'Scaling', desc: 'Optimizing for growth' },
];

const COMMON_CHALLENGES = [
  'User acquisition',
  'Technical architecture',
  'Design / UX',
  'Funding / runway',
  'Team building',
  'Product-market fit',
  'Competition',
  'Compliance / security',
];

const COMMON_GOALS = [
  'Launch MVP in 30 days',
  'Grow to 1,000 users',
  'Achieve $10K MRR',
  'Raise seed funding',
  'Expand to new markets',
  'Build mobile app',
  'Improve retention',
  'Automate operations',
];

export default function GrowthPlanWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState<WizardData>({
    email: '',
    industry: '',
    subIndustry: '',
    stage: '',
    challenges: [],
    goals: [],
    budget: '',
    timeline: '',
  });

  const updateField = useCallback(
    <K extends keyof WizardData>(key: K, value: WizardData[K]) => {
      setData((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const toggleItem = useCallback(
    (key: 'challenges' | 'goals', item: string) => {
      setData((prev) => {
        const arr = prev[key];
        return {
          ...prev,
          [key]: arr.includes(item)
            ? arr.filter((i) => i !== item)
            : [...arr, item],
        };
      });
    },
    [],
  );

  const canProceed = (): boolean => {
    switch (step) {
      case 0:
        return data.email.includes('@');
      case 1:
        return data.industry !== '' && data.subIndustry !== '';
      case 2:
        return data.stage !== '';
      case 3:
        return data.challenges.length > 0;
      case 4:
        return data.goals.length > 0;
      case 5:
        return data.budget !== '' && data.timeline !== '';
      case 6:
        return true;
      default:
        return false;
    }
  };

  const handleNext = async () => {
    if (step === 0) {
      try {
        setLoading(true);
        setError('');
        const res = await fetch('/api/growth-plan/start', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: data.email }),
        });
        if (!res.ok) throw new Error('Failed to start wizard');
        setStep(1);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
      } finally {
        setLoading(false);
      }
    } else if (step < 6) {
      setStep(step + 1);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await fetch('/api/growth-plan/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.email,
          industry: data.industry,
          subIndustry: data.subIndustry,
          stage: data.stage,
          challenges: data.challenges,
          goals: data.goals,
          budget: data.budget,
          timeline: data.timeline,
        }),
      });
      if (!res.ok) throw new Error('Failed to submit plan');
      const result = await res.json();
      router.push(`/plan/${result.plan_id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const selectedIndustry = INDUSTRIES.find((i) => i.value === data.industry);

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[var(--muted-foreground)] mb-2"
              >
                Your email address
              </label>
              <input
                id="email"
                type="email"
                value={data.email}
                onChange={(e) => updateField('email', e.target.value)}
                placeholder="you@company.com"
                className="w-full px-4 py-3 rounded-lg border border-[var(--border)] bg-[var(--background)] text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
                autoFocus
              />
            </div>
            <p className="text-xs text-[var(--muted-foreground)]">
              We will send your wireframe preview to this email.
            </p>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[var(--muted-foreground)] mb-2">
                Industry
              </label>
              <div className="grid grid-cols-2 gap-3">
                {INDUSTRIES.map((ind) => (
                  <button
                    key={ind.value}
                    type="button"
                    onClick={() => {
                      updateField('industry', ind.value);
                      updateField('subIndustry', '');
                    }}
                    className={`px-4 py-3 rounded-lg border text-sm font-medium transition ${
                      data.industry === ind.value
                        ? 'border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]'
                        : 'border-[var(--border)] hover:border-[var(--accent)]/50'
                    }`}
                  >
                    {ind.label}
                  </button>
                ))}
              </div>
            </div>
            {selectedIndustry && (
              <div>
                <label className="block text-sm font-medium text-[var(--muted-foreground)] mb-2">
                  Sub-industry
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {selectedIndustry.subs.map((sub) => (
                    <button
                      key={sub}
                      type="button"
                      onClick={() => updateField('subIndustry', sub)}
                      className={`px-4 py-3 rounded-lg border text-sm font-medium transition ${
                        data.subIndustry === sub
                          ? 'border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]'
                          : 'border-[var(--border)] hover:border-[var(--accent)]/50'
                      }`}
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-[var(--muted-foreground)] mb-2">
              What stage is your business?
            </label>
            {STAGES.map((s) => (
              <button
                key={s.value}
                type="button"
                onClick={() => updateField('stage', s.value)}
                className={`w-full text-left px-4 py-3 rounded-lg border transition ${
                  data.stage === s.value
                    ? 'border-[var(--accent)] bg-[var(--accent)]/10'
                    : 'border-[var(--border)] hover:border-[var(--accent)]/50'
                }`}
              >
                <div className="font-medium text-[var(--text-primary)]">
                  {s.label}
                </div>
                <div className="text-xs text-[var(--muted-foreground)]">
                  {s.desc}
                </div>
              </button>
            ))}
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-[var(--muted-foreground)] mb-2">
              What challenges are you facing?{' '}
              <span className="text-[var(--muted-foreground)]/60">
                (select all that apply)
              </span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {COMMON_CHALLENGES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => toggleItem('challenges', c)}
                  className={`px-4 py-3 rounded-lg border text-sm font-medium transition ${
                    data.challenges.includes(c)
                      ? 'border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]'
                      : 'border-[var(--border)] hover:border-[var(--accent)]/50'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
            {data.challenges.length === 0 && (
              <p className="text-xs text-[var(--muted-foreground)]">
                Select at least one challenge.
              </p>
            )}
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-[var(--muted-foreground)] mb-2">
              What are your goals?{' '}
              <span className="text-[var(--muted-foreground)]/60">
                (select all that apply)
              </span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {COMMON_GOALS.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => toggleItem('goals', g)}
                  className={`px-4 py-3 rounded-lg border text-sm font-medium transition ${
                    data.goals.includes(g)
                      ? 'border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]'
                      : 'border-[var(--border)] hover:border-[var(--accent)]/50'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
            {data.goals.length === 0 && (
              <p className="text-xs text-[var(--muted-foreground)]">
                Select at least one goal.
              </p>
            )}
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[var(--muted-foreground)] mb-2">
                Monthly budget for growth
              </label>
              <div className="grid grid-cols-3 gap-3">
                {['Under $500', '$500-$2K', '$2K-$5K', '$5K-$10K', '$10K+'].map(
                  (b) => (
                    <button
                      key={b}
                      type="button"
                      onClick={() => updateField('budget', b)}
                      className={`px-3 py-3 rounded-lg border text-xs font-medium transition ${
                        data.budget === b
                          ? 'border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]'
                          : 'border-[var(--border)] hover:border-[var(--accent)]/50'
                      }`}
                    >
                      {b}
                    </button>
                  ),
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--muted-foreground)] mb-2">
                Target timeline
              </label>
              <div className="grid grid-cols-3 gap-3">
                {['ASAP', '1-3 months', '3-6 months', '6+ months', 'Flexible'].map(
                  (t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => updateField('timeline', t)}
                      className={`px-3 py-3 rounded-lg border text-xs font-medium transition ${
                        data.timeline === t
                          ? 'border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]'
                          : 'border-[var(--border)] hover:border-[var(--accent)]/50'
                      }`}
                    >
                      {t}
                    </button>
                  ),
                )}
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">
              Review your inputs
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-[var(--border)]">
                <span className="text-[var(--muted-foreground)]">Email</span>
                <span className="font-medium">{data.email}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[var(--border)]">
                <span className="text-[var(--muted-foreground)]">Industry</span>
                <span className="font-medium">
                  {data.industry} / {data.subIndustry}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-[var(--border)]">
                <span className="text-[var(--muted-foreground)]">Stage</span>
                <span className="font-medium">
                  {STAGES.find((s) => s.value === data.stage)?.label}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-[var(--border)]">
                <span className="text-[var(--muted-foreground)]">Challenges</span>
                <span className="font-medium">{data.challenges.length} selected</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[var(--border)]">
                <span className="text-[var(--muted-foreground)]">Goals</span>
                <span className="font-medium">{data.goals.length} selected</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[var(--border)]">
                <span className="text-[var(--muted-foreground)]">Budget</span>
                <span className="font-medium">{data.budget}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-[var(--muted-foreground)]">Timeline</span>
                <span className="font-medium">{data.timeline}</span>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-[var(--card)] rounded-2xl border border-[var(--border)] shadow-xl overflow-hidden">
      {/* Progress bar */}
      <div className="h-1.5 bg-[var(--border)]">
        <div
          className="h-full bg-[var(--accent)] transition-all duration-300"
          style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
        />
      </div>

      {/* Step indicator */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wider">
            Step {step + 1} of {STEPS.length}
          </span>
          <span className="text-xs font-medium text-[var(--accent)]">
            {STEPS[step]}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 pb-6 min-h-[300px]">{renderStep()}</div>

      {/* Error */}
      {error && (
        <div className="px-6 pb-4">
          <p className="text-sm text-red-500">{error}</p>
        </div>
      )}

      {/* Actions */}
      <div className="px-6 py-4 bg-[var(--border)]/30 flex items-center justify-between">
        <button
          type="button"
          onClick={() => step > 0 && setStep(step - 1)}
          disabled={step === 0 || loading}
          className="px-4 py-2 text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--text-primary)] disabled:opacity-30 disabled:cursor-not-allowed transition"
        >
          Back
        </button>
        <button
          type="button"
          onClick={step === 6 ? handleSubmit : handleNext}
          disabled={!canProceed() || loading}
          className="px-6 py-2.5 rounded-lg text-sm font-semibold bg-[var(--accent)] text-[var(--background)] hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          {loading
            ? 'Processing...'
            : step === 6
              ? 'Submit Plan'
              : 'Continue'}
        </button>
      </div>
    </div>
  );
}
