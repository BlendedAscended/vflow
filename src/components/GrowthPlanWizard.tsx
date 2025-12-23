'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Define the structure of our wizard data
interface WizardData {
    industry: string;
    stage: string;
    challenges: string[];
    goals: string[];
    teamSize: string;
    budget: string;
    timeline: string;
    email: string;
    name: string;
    subNiches: string[];
}

const initialData: WizardData = {
    industry: '',
    stage: '',
    challenges: [],
    goals: [],
    teamSize: '',
    budget: '',
    timeline: '',
    email: '',
    name: '',
    subNiches: []
};

const constructionSubServices = [
    'Roofing',
    'Plumbing',
    'HVAC',
    'Electrical',
    'Landscaping',
    'General Contracting',
    'Remodeling',
    'Painting',
    'Flooring',
    'Other'
];

const industries = [
    { id: 'retail', label: 'Retail & E-commerce', icon: '🛍️' },
    { id: 'service', label: 'Service Business', icon: '🔧' },
    { id: 'healthcare', label: 'Healthcare & Wellness', icon: '⚕️' },
    { id: 'tech', label: 'Technology & SaaS', icon: '💻' },
    { id: 'realestate', label: 'Real Estate', icon: '🏠' },
    { id: 'construction', label: 'Construction', icon: '🏗️' }
];

const stages = [
    { id: 'idea', label: 'Idea Phase', description: 'Just getting started' },
    { id: 'startup', label: 'Startup', description: 'Early traction, < $100k rev' },
    { id: 'scaling', label: 'Scaling', description: 'Growing fast, > $100k rev' },
    { id: 'established', label: 'Established', description: 'Optimizing operations' }
];

const challengesList = [
    'Lead Generation',
    'Sales Conversion',
    'Operational Efficiency',
    'Hiring & Team',
    'Technology & Automation',
    'Brand Awareness'
];

const teamSizes = [
    { id: '1', label: 'Just me (Solopreneur)' },
    { id: '2-5', label: '2-5 Employees' },
    { id: '6-20', label: '6-20 Employees' },
    { id: '20+', label: '20+ Employees' }
];

const budgets = [
    { id: 'low', label: 'Under $1k/mo' },
    { id: 'medium', label: '$1k - $5k/mo' },
    { id: 'high', label: '$5k - $10k/mo' },
    { id: 'enterprise', label: '$10k+/mo' }
];

const timelines = [
    { id: 'asap', label: 'ASAP (This month)' },
    { id: 'short', label: '3-6 Months' },
    { id: 'long', label: '12 Months+' }
];

export default function GrowthPlanWizard() {
    const [step, setStep] = useState(0);
    const [data, setData] = useState<WizardData>(initialData);

    useEffect(() => {
        const stored = localStorage.getItem('vflow_growth_plan_partial');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                setData(prev => ({
                    ...prev,
                    subNiches: parsed.goals || [],
                    // Map the free text details to 'goals' since it is sent to API but unused in Wizard UI
                    goals: parsed.details ? [parsed.details] : []
                }));
                // Optional: Clear it so it doesn't persist forever, or keep it? 
                // Better to clear to avoid confusion on refresh if they want to start over.
                localStorage.removeItem('vflow_growth_plan_partial');
            } catch (e) {
                console.error('Failed to parse stored growth plan data', e);
            }
        }
    }, []);

    const [isGenerating, setIsGenerating] = useState(false);

    interface GrowthPlan {
        executive_summary: string;
        phases: {
            title: string;
            duration: string;
            actions: string[];
        }[];
        recommended_services: string[];
        estimated_investment: string;
    }

    const [generatedPlan, setGeneratedPlan] = useState<GrowthPlan | null>(null);

    const totalSteps = 7;

    const handleNext = () => {
        console.log(`📍 handleNext called. Current step: ${step}, totalSteps: ${totalSteps}`);
        // Step 4 is the last form step (Timeline & Contact), so we need to generate the plan
        if (step < 4) {
            console.log('→ Moving to next step (not final)');
            setStep(step + 1);
        } else {
            console.log('→ Final step! Calling generatePlan()');
            setStep(step + 1); // Move to step 5 (loading/results)
            generatePlan();
        }
    };

    const handleBack = () => {
        if (step > 0) {
            setStep(step - 1);
        }
    };

    const updateData = (field: keyof WizardData, value: WizardData[keyof WizardData]) => {
        setData(prev => ({ ...prev, [field]: value }));
    };

    const toggleChallenge = (challenge: string) => {
        const current = data.challenges;
        if (current.includes(challenge)) {
            updateData('challenges', current.filter(c => c !== challenge));
        } else {
            updateData('challenges', [...current, challenge]);
        }
    };

    const toggleSubNiche = (niche: string) => {
        const current = data.subNiches;
        if (current.includes(niche)) {
            updateData('subNiches', current.filter(n => n !== niche));
        } else {
            updateData('subNiches', [...current, niche]);
        }
    };

    const generatePlan = async () => {
        console.log('🚀 generatePlan called with data:', data);
        setIsGenerating(true);
        try {
            console.log('→ Sending request to /api/generate-strategy...');
            const response = await fetch('/api/generate-strategy', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            console.log('→ Response received. Status:', response.status, 'OK:', response.ok);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('✗ API returned error:', errorText);
                alert(`Error: ${response.status} - ${errorText}`);
                throw new Error('Failed to generate plan');
            }

            const result = await response.json();
            console.log('✓ Plan generated successfully:', result);
            setGeneratedPlan(result.plan);
        } catch (error) {
            console.error('✗✗✗ Error generating plan:', error);
            alert(`Failed to generate plan: ${error instanceof Error ? error.message : 'Unknown error'}`);
            // We don't set a string error message here anymore since the type is GrowthPlan
            // You might want to handle error state separately
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto bg-[var(--card-background)] rounded-3xl shadow-elegant border border-[var(--border)] overflow-hidden min-h-[600px] flex flex-col">
            {/* Progress Bar */}
            <div className="w-full h-2 bg-[var(--section-bg-1)]">
                <motion.div
                    className="h-full bg-[var(--accent)]"
                    initial={{ width: 0 }}
                    animate={{ width: `${((step + 1) / totalSteps) * 100}%` }}
                    transition={{ duration: 0.5 }}
                />
            </div>

            <div className="flex-1 p-8 lg:p-12 flex flex-col">
                <AnimatePresence mode="wait">
                    {step === 0 && (
                        <motion.div
                            key="step0"
                            className="flex-1 flex flex-col"
                        >
                            <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-2">What industry are you in?</h2>
                            <p className="text-[var(--muted-foreground)] mb-8">This helps us tailor the strategy to your market.</p>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {industries.map((ind) => (
                                    <button
                                        key={ind.id}
                                        onClick={() => {
                                            updateData('industry', ind.id);
                                            handleNext();
                                        }}
                                        className={`p-6 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center justify-center gap-3 hover:scale-105 ${data.industry === ind.id
                                            ? 'border-[var(--accent)] bg-[var(--accent)]/10'
                                            : 'border-[var(--border)] hover:border-[var(--accent)]'
                                            }`}
                                    >
                                        <span className="text-4xl">{ind.icon}</span>
                                        <span className="font-semibold text-[var(--text-primary)]">{ind.label}</span>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="flex-1 flex flex-col"
                        >
                            <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-2">
                                {data.industry === 'construction' ? 'What services do you offer?' : 'Specific Focus'}
                            </h2>
                            <p className="text-[var(--muted-foreground)] mb-8">
                                {data.industry === 'construction'
                                    ? 'Select all that apply (Multi-select)'
                                    : 'Tell us more about your specific niche (e.g., Pediatric Dentistry)'}
                            </p>

                            {data.industry === 'construction' ? (
                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    {constructionSubServices.map((service) => (
                                        <button
                                            key={service}
                                            onClick={() => toggleSubNiche(service)}
                                            className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${data.subNiches.includes(service)
                                                ? 'border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--text-primary)]'
                                                : 'border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--accent)]'
                                                }`}
                                        >
                                            {service}
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="mb-8">
                                    <input
                                        type="text"
                                        value={data.subNiches[0] || ''}
                                        onChange={(e) => updateData('subNiches', [e.target.value])}
                                        className="w-full px-4 py-3 rounded-xl border-2 border-[var(--border)] bg-[var(--background)] text-[var(--text-primary)] focus:border-[var(--accent)] outline-none transition-colors"
                                        placeholder="e.g. Pediatric Dentistry, Commercial Real Estate, etc."
                                    />
                                </div>
                            )}

                            <button
                                onClick={handleNext}
                                disabled={data.subNiches.length === 0}
                                className="self-end bg-[var(--accent)] text-[var(--accent-foreground)] font-bold px-8 py-3 rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-glow transition-all"
                            >
                                Continue
                            </button>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="flex-1 flex flex-col"
                        >
                            <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Current Business Stage</h2>
                            <p className="text-[var(--muted-foreground)] mb-8">Where are you currently at in your journey?</p>

                            <div className="space-y-4">
                                {stages.map((stg) => (
                                    <button
                                        key={stg.id}
                                        onClick={() => {
                                            updateData('stage', stg.id);
                                            handleNext();
                                        }}
                                        className={`w-full p-6 rounded-2xl border-2 transition-all duration-300 flex items-center justify-between hover:scale-[1.01] ${data.stage === stg.id
                                            ? 'border-[var(--accent)] bg-[var(--accent)]/10'
                                            : 'border-[var(--border)] hover:border-[var(--accent)]'
                                            }`}
                                    >
                                        <div className="text-left">
                                            <h3 className="text-xl font-bold text-[var(--text-primary)]">{stg.label}</h3>
                                            <p className="text-[var(--muted-foreground)]">{stg.description}</p>
                                        </div>
                                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${data.stage === stg.id ? 'border-[var(--accent)]' : 'border-[var(--muted-foreground)]'
                                            }`}>
                                            {data.stage === stg.id && <div className="w-3 h-3 rounded-full bg-[var(--accent)]" />}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="flex-1 flex flex-col"
                        >
                            <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Top Challenges</h2>
                            <p className="text-[var(--muted-foreground)] mb-8">Select all that apply (Multi-select)</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                                {challengesList.map((challenge) => (
                                    <button
                                        key={challenge}
                                        onClick={() => toggleChallenge(challenge)}
                                        className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${data.challenges.includes(challenge)
                                            ? 'border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--text-primary)]'
                                            : 'border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--accent)]'
                                            }`}
                                    >
                                        {challenge}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={handleNext}
                                disabled={data.challenges.length === 0}
                                className="self-end bg-[var(--accent)] text-[var(--accent-foreground)] font-bold px-8 py-3 rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-glow transition-all"
                            >
                                Continue
                            </button>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="flex-1 flex flex-col"
                        >
                            <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Team & Resources</h2>
                            <p className="text-[var(--muted-foreground)] mb-8">Help us understand your capacity.</p>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-[var(--text-primary)] font-semibold mb-3">Team Size</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {teamSizes.map((size) => (
                                            <button
                                                key={size.id}
                                                onClick={() => updateData('teamSize', size.id)}
                                                className={`p-3 rounded-xl border-2 transition-all duration-300 ${data.teamSize === size.id
                                                    ? 'border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--text-primary)]'
                                                    : 'border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--accent)]'
                                                    }`}
                                            >
                                                {size.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[var(--text-primary)] font-semibold mb-3">Monthly Budget for Growth</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {budgets.map((budget) => (
                                            <button
                                                key={budget.id}
                                                onClick={() => updateData('budget', budget.id)}
                                                className={`p-3 rounded-xl border-2 transition-all duration-300 ${data.budget === budget.id
                                                    ? 'border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--text-primary)]'
                                                    : 'border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--accent)]'
                                                    }`}
                                            >
                                                {budget.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    onClick={handleNext}
                                    disabled={!data.teamSize || !data.budget}
                                    className="self-end bg-[var(--accent)] text-[var(--accent-foreground)] font-bold px-8 py-3 rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-glow transition-all w-full mt-4"
                                >
                                    Continue
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {step === 4 && (
                        <motion.div
                            key="step4"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="flex-1 flex flex-col"
                        >
                            <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Timeline & Contact</h2>
                            <p className="text-[var(--muted-foreground)] mb-8">When are you looking to execute?</p>

                            <div className="space-y-6 max-w-md mx-auto w-full">
                                <div>
                                    <label className="block text-[var(--text-primary)] font-semibold mb-3">Timeline</label>
                                    <div className="grid grid-cols-3 gap-3 mb-6">
                                        {timelines.map((time) => (
                                            <button
                                                key={time.id}
                                                onClick={() => updateData('timeline', time.id)}
                                                className={`p-2 text-sm rounded-xl border-2 transition-all duration-300 ${data.timeline === time.id
                                                    ? 'border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--text-primary)]'
                                                    : 'border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--accent)]'
                                                    }`}
                                            >
                                                {time.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[var(--text-primary)] font-semibold mb-2">Name</label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => updateData('name', e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border-2 border-[var(--border)] bg-[var(--background)] text-[var(--text-primary)] focus:border-[var(--accent)] outline-none transition-colors"
                                        placeholder="Your Name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[var(--text-primary)] font-semibold mb-2">Email</label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => updateData('email', e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl border-2 border-[var(--border)] bg-[var(--background)] text-[var(--text-primary)] focus:border-[var(--accent)] outline-none transition-colors"
                                        placeholder="your@email.com"
                                    />
                                </div>

                                <button
                                    onClick={handleNext}
                                    disabled={!data.name || !data.email || !data.timeline}
                                    className="w-full bg-[var(--accent)] text-[var(--accent-foreground)] font-bold px-8 py-4 rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-glow transition-all mt-4"
                                >
                                    Generate My Growth Plan
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {step === 5 && (
                        <motion.div
                            key="step5"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex-1 flex flex-col items-center justify-center text-center w-full"
                        >
                            {isGenerating ? (
                                <div className="space-y-6 py-12">
                                    <div className="w-20 h-20 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin mx-auto" />
                                    <h2 className="text-2xl font-bold text-[var(--text-primary)]">Analyzing your business profile...</h2>
                                    <p className="text-[var(--muted-foreground)]">Our AI is crafting your custom strategy.</p>
                                </div>
                            ) : generatedPlan ? (
                                <div className="space-y-8 w-full text-left">
                                    <div className="text-center space-y-4">
                                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto text-3xl">
                                            ✅
                                        </div>
                                        <h2 className="text-3xl font-bold text-[var(--text-primary)]">Your Growth Strategy</h2>
                                        <p className="text-[var(--muted-foreground)]">
                                            A tailored plan for your {data.industry} business.
                                        </p>
                                    </div>

                                    <div className="bg-[var(--section-bg-1)] p-6 lg:p-8 rounded-2xl border border-[var(--border)] space-y-8">

                                        {/* Executive Summary */}
                                        <div className="bg-[var(--card-background)] p-6 rounded-xl border border-[var(--border)] shadow-sm">
                                            <h3 className="text-xl font-bold text-[var(--accent)] mb-3 flex items-center gap-2">
                                                <span>🚀</span> Executive Summary
                                            </h3>
                                            <p className="text-[var(--text-secondary)] leading-relaxed text-lg">
                                                {generatedPlan.executive_summary}
                                            </p>
                                        </div>

                                        {/* Phases */}
                                        <div className="space-y-6">
                                            <h3 className="text-2xl font-bold text-[var(--text-primary)] border-b border-[var(--border)] pb-2">Action Plan</h3>
                                            <div className="relative space-y-8 pl-4 lg:pl-0">
                                                {/* Vertical Line for Desktop */}
                                                <div className="hidden lg:block absolute left-[19px] top-4 bottom-4 w-0.5 bg-[var(--border)]" />

                                                {generatedPlan.phases.map((phase, idx) => (
                                                    <div key={idx} className="relative lg:pl-12">
                                                        {/* Timeline Dot */}
                                                        <div className="hidden lg:flex absolute left-0 top-0 w-10 h-10 rounded-full bg-[var(--card-background)] border-2 border-[var(--accent)] items-center justify-center z-10">
                                                            <span className="text-[var(--accent)] font-bold">{idx + 1}</span>
                                                        </div>

                                                        <div className="bg-[var(--card-background)] p-6 rounded-xl border border-[var(--border)] hover:border-[var(--accent)] transition-colors duration-300">
                                                            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-2">
                                                                <h4 className="text-xl font-bold text-[var(--text-primary)]">{phase.title}</h4>
                                                                <span className="inline-block bg-[var(--accent)]/10 text-[var(--accent)] px-3 py-1 rounded-full text-sm font-semibold whitespace-nowrap w-fit">
                                                                    ⏱️ {phase.duration}
                                                                </span>
                                                            </div>
                                                            <ul className="space-y-3">
                                                                {phase.actions.map((action, i) => (
                                                                    <li key={i} className="flex items-start gap-3 text-[var(--text-secondary)]">
                                                                        <span className="text-[var(--accent)] mt-1.5">•</span>
                                                                        <span>{action}</span>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Services & Investment */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                                            <div className="bg-[var(--card-background)] p-6 rounded-xl border border-[var(--border)]">
                                                <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                                                    <span>🛠️</span> Recommended Services
                                                </h3>
                                                <div className="flex flex-wrap gap-2">
                                                    {generatedPlan.recommended_services.map((service, idx) => (
                                                        <span key={idx} className="text-sm bg-[var(--section-bg-2)] text-[var(--text-primary)] border border-[var(--border)] px-3 py-1.5 rounded-full font-medium">
                                                            {service}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="bg-[var(--card-background)] p-6 rounded-xl border border-[var(--border)]">
                                                <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2 flex items-center gap-2">
                                                    <span>💰</span> Estimated Investment
                                                </h3>
                                                <p className="text-3xl font-bold text-[var(--accent)] mb-1">
                                                    {generatedPlan.estimated_investment}
                                                </p>
                                                <p className="text-sm text-[var(--muted-foreground)]">Monthly estimate based on recommended services.</p>
                                            </div>
                                        </div>

                                    </div>

                                    <div className="text-center">
                                        <p className="text-sm text-[var(--muted-foreground)] mb-4">
                                            Sent to <strong>{data.email}</strong>
                                        </p>
                                        <button
                                            onClick={() => window.location.reload()}
                                            className="text-[var(--accent)] font-semibold hover:underline"
                                        >
                                            Start Over
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center space-y-4">
                                    <p className="text-red-500">Something went wrong. Please try again.</p>
                                    <button onClick={() => setStep(0)} className="text-[var(--accent)] underline">Restart</button>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Navigation Buttons (Back) */}
            {step > 0 && step < 6 && !isGenerating && (
                <div className="p-6 border-t border-[var(--border)] flex justify-start">
                    <button
                        onClick={handleBack}
                        className="text-[var(--muted-foreground)] hover:text-[var(--text-primary)] font-medium flex items-center gap-2 transition-colors"
                    >
                        ← Back
                    </button>
                </div>
            )}
        </div>
    );
}
