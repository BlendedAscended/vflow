'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { industries, getIndustry } from '../data/industries';

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
    currentStack: string[];
    legacyPain: string;
    gbpPlaceId?: string;
    gbpName?: string;
    gbpAddress?: string;
    gbpCategories?: string[];
    gbpData?: any;
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
    subNiches: [],
    currentStack: [],
    legacyPain: '',
};

const stages = [
    { id: 'idea', label: 'Idea Phase', description: 'Just getting started' },
    { id: 'startup', label: 'Startup', description: 'Early traction, < $100k rev' },
    { id: 'scaling', label: 'Scaling', description: 'Growing fast, > $100k rev' },
    { id: 'established', label: 'Established', description: 'Optimizing operations' },
];

const challengesList = [
    'Lead Generation',
    'Sales Conversion',
    'Operational Efficiency',
    'Hiring & Team',
    'Replacing Legacy Software',
    'Compliance & Audits',
    'AI / Automation Strategy',
    'Brand Awareness',
];

const stackOptions = [
    'Spreadsheets / Manual',
    'Salesforce / HubSpot',
    'Custom in-house app',
    'Legacy on-prem system',
    'No software yet',
    'Shopify / WooCommerce',
    'QuickBooks / Xero',
    'Other',
];

const teamSizes = [
    { id: '1', label: 'Just me (Solopreneur)' },
    { id: '2-5', label: '2-5 Employees' },
    { id: '6-20', label: '6-20 Employees' },
    { id: '20+', label: '20+ Employees' },
];

const budgets = [
    { id: 'low', label: 'Under $1k' },
    { id: 'medium', label: '$1k - $5k' },
    { id: 'high', label: '$5k - $10k' },
    { id: 'enterprise', label: '$10k+' },
];

const timelines = [
    { id: 'asap', label: 'ASAP (This month)' },
    { id: 'short', label: '3-6 Months' },
    { id: 'long', label: '12 Months+' },
];

interface GrowthPlan {
    executive_summary: string;
    phases: { title: string; duration: string; actions: string[] }[];
    recommended_services: string[];
    estimated_investment: string;
    wireframe_url?: string;
    wireframe_html?: string;
    tech_stack?: { layer: string; tools: string[] }[];
}

interface PlaceSuggestion {
    placeId: string;
    text: string;
    structuredFormat?: { mainText: string; secondaryText: string };
}

function GbpStep({
    data,
    updateData,
    onNext,
    onSkip,
}: {
    data: WizardData;
    updateData: (field: keyof WizardData, value: any) => void;
    onNext: () => void;
    onSkip: () => void;
}) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<PlaceSuggestion[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selected, setSelected] = useState<PlaceSuggestion | null>(null);
    const [details, setDetails] = useState<any>(null);
    const [detailsLoading, setDetailsLoading] = useState(false);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const search = useCallback(async (q: string) => {
        if (!q || q.length < 3) {
            setResults([]);
            return;
        }
        setLoading(true);
        setError('');
        try {
            const res = await fetch(`/api/places/search?q=${encodeURIComponent(q)}`);
            const json = await res.json();
            if (!res.ok) throw new Error(json.error || 'Search failed');
            setResults(json.results || []);
        } catch (err: any) {
            setError(err.message);
            setResults([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            search(query);
        }, 250);
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [query, search]);

    const selectPlace = async (place: PlaceSuggestion) => {
        setSelected(place);
        setResults([]);
        setDetailsLoading(true);
        try {
            const res = await fetch(`/api/places/details?placeId=${encodeURIComponent(place.placeId)}`);
            const json = await res.json();
            if (!res.ok) throw new Error(json.error || 'Details failed');
            setDetails(json.details);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setDetailsLoading(false);
        }
    };

    const confirm = () => {
        if (!details) return;
        updateData('gbpPlaceId', details.placeId);
        updateData('gbpName', details.name);
        updateData('gbpAddress', details.address);
        updateData('gbpCategories', details.types || []);
        updateData('gbpData', details);
        onNext();
    };

    const skip = () => {
        updateData('gbpPlaceId', undefined);
        updateData('gbpName', undefined);
        updateData('gbpAddress', undefined);
        updateData('gbpCategories', undefined);
        updateData('gbpData', undefined);
        onSkip();
    };

    return (
        <motion.div
            key="step2-gbp"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col"
        >
            <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Business Location</h2>
            <p className="text-[var(--muted-foreground)] mb-6">
                Link your Google Business Profile so our designer can use real photos, hours, and location context in your wireframe.
            </p>

            {!selected && (
                <div className="space-y-4">
                    <div className="relative">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border-2 border-[var(--border)] bg-[var(--background)] text-[var(--text-primary)] focus:border-[var(--accent)] outline-none transition-colors"
                            placeholder="Start typing your business name..."
                        />
                        {loading && (
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--muted-foreground)]">Searching...</span>
                        )}
                    </div>

                    {error && (
                        <p className="text-sm text-red-400">{error}</p>
                    )}

                    <div className="space-y-2">
                        {results.map((place) => (
                            <button
                                key={place.placeId}
                                onClick={() => selectPlace(place)}
                                className="w-full text-left p-4 rounded-xl border border-[var(--border)] hover:border-[var(--accent)] hover:bg-[var(--accent)]/5 transition-all"
                            >
                                <p className="font-semibold text-[var(--text-primary)]">
                                    {place.structuredFormat?.mainText || place.text}
                                </p>
                                <p className="text-sm text-[var(--muted-foreground)]">
                                    {place.structuredFormat?.secondaryText || ''}
                                </p>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {selected && (
                <div className="space-y-4">
                    <div className="p-5 rounded-xl border border-[var(--accent)] bg-[var(--accent)]/5">
                        {detailsLoading ? (
                            <p className="text-[var(--muted-foreground)]">Loading details...</p>
                        ) : details ? (
                            <div className="space-y-2">
                                <p className="font-bold text-[var(--text-primary)] text-lg">{details.name}</p>
                                <p className="text-sm text-[var(--muted-foreground)]">{details.address}</p>
                                {details.types?.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 pt-1">
                                        {details.types.slice(0, 5).map((t: string) => (
                                            <span key={t} className="text-xs bg-[var(--surface-3)] border border-[var(--ghost-border)] px-2 py-0.5 rounded-full">
                                                {t.replace(/_/g, ' ')}
                                            </span>
                                        ))}
                                    </div>
                                )}
                                {details.rating && (
                                    <p className="text-sm text-[var(--accent)]">⭐ {details.rating} ({details.userRatingCount ?? 0} reviews)
                                    </p>
                                )}
                            </div>
                        ) : (
                            <p className="text-red-400">Could not load details.</p>
                        )}
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={confirm}
                            disabled={!details || detailsLoading}
                            className="flex-1 bg-[var(--accent)] text-[var(--accent-foreground)] font-bold px-6 py-3 rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-glow transition-all"
                        >
                            Confirm & Continue
                        </button>
                        <button
                            onClick={() => { setSelected(null); setDetails(null); }}
                            className="px-6 py-3 rounded-full border-2 border-[var(--border)] text-[var(--text-primary)] hover:border-[var(--accent)] transition-all"
                        >
                            Change
                        </button>
                    </div>
                </div>
            )}

            {!selected && (
                <button
                    onClick={skip}
                    className="mt-6 self-start text-[var(--muted-foreground)] hover:text-[var(--text-primary)] font-medium transition-colors"
                >
                    Skip this step →
                </button>
            )}
        </motion.div>
    );
}

export default function GrowthPlanWizard() {
    const [step, setStep] = useState(0);
    const [data, setData] = useState<WizardData>(initialData);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedPlan, setGeneratedPlan] = useState<GrowthPlan | null>(null);
    const [isPaid, setIsPaid] = useState(false);
    const [isGeneratingWireframe, setIsGeneratingWireframe] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem('vflow_growth_plan_partial');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                setData(prev => ({
                    ...prev,
                    subNiches: parsed.goals || [],
                    goals: parsed.details ? [parsed.details] : [],
                }));
                localStorage.removeItem('vflow_growth_plan_partial');
            } catch (e) {
                console.error('Failed to parse stored growth plan data', e);
            }
        }
    }, []);

    const generateWireframe = async () => {
        setIsGeneratingWireframe(true);
        try {
            const res = await fetch('/api/wireframe/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    industry: data.industry,
                    subNiches: data.subNiches,
                    businessName: data.name || 'Your Business',
                    executiveSummary: generatedPlan?.executive_summary || '',
                    phases: generatedPlan?.phases || [],
                    services: generatedPlan?.recommended_services || [],
                }),
            });
            if (!res.ok) throw new Error('Wireframe generation failed');
            const result = await res.json();
            if (generatedPlan) {
                setGeneratedPlan({ ...generatedPlan, wireframe_url: result.wireframe_url, wireframe_html: result.html });
            }
        } catch (err) {
            console.error('Wireframe error:', err);
            alert('Wireframe generation failed. Please try again.');
        } finally {
            setIsGeneratingWireframe(false);
        }
    };

    const totalSteps = 8;
    const selectedIndustry = useMemo(() => getIndustry(data.industry), [data.industry]);

    const handleNext = () => {
        if (step < 7) {
            setStep(step + 1);
        } else {
            setStep(step + 1);
            generatePlan();
        }
    };

    const handleBack = () => {
        if (step > 0) setStep(step - 1);
    };

    const updateData = (field: keyof WizardData, value: WizardData[keyof WizardData]) => {
        setData(prev => ({ ...prev, [field]: value }));
    };

    const toggleInArray = (field: 'challenges' | 'subNiches' | 'currentStack', value: string) => {
        const current = data[field];
        if (current.includes(value)) {
            updateData(field, current.filter(c => c !== value));
        } else {
            updateData(field, [...current, value]);
        }
    };

    const generatePlan = async () => {
        setIsGenerating(true);
        try {
            const response = await fetch('/api/generate-strategy', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...data, paid: isPaid }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('API returned error:', errorText);
                alert(`Error: ${response.status} - ${errorText}`);
                throw new Error('Failed to generate plan');
            }

            const result = await response.json();
            setGeneratedPlan(result.plan);
        } catch (error) {
            console.error('Error generating plan:', error);
            alert(`Failed to generate plan: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setIsGenerating(false);
        }
    };

    const startCheckout = async () => {
        try {
            const response = await fetch('/api/checkout-growth-plan', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: data.email, name: data.name, leadData: data }),
            });
            if (!response.ok) {
                alert('Checkout is not configured yet. Skipping to preview.');
                setIsPaid(false);
                handleNext();
                return;
            }
            const { url } = await response.json();
            if (url) {
                window.location.href = url;
                return;
            }
            setIsPaid(false);
            handleNext();
        } catch {
            setIsPaid(false);
            handleNext();
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
                        <motion.div key="step0" className="flex-1 flex flex-col">
                            <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-2">What industry are you in?</h2>
                            <p className="text-[var(--muted-foreground)] mb-8">This helps our agents tailor the wireframe and tech stack to your market.</p>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {industries.map((ind) => (
                                    <button
                                        key={ind.id}
                                        onClick={() => {
                                            updateData('industry', ind.id);
                                            updateData('subNiches', []);
                                            setStep(1);
                                        }}
                                        className={`p-5 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center justify-center gap-2 hover:scale-105 ${data.industry === ind.id
                                            ? 'border-[var(--accent)] bg-[var(--accent)]/10'
                                            : 'border-[var(--border)] hover:border-[var(--accent)]'
                                            }`}
                                    >
                                        <span className="text-3xl">{ind.icon}</span>
                                        <span className="font-semibold text-[var(--text-primary)] text-sm text-center leading-tight">{ind.label}</span>
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
                                {selectedIndustry?.freeText ? 'Tell us what you do' : 'Which area is your focus?'}
                            </h2>
                            <p className="text-[var(--muted-foreground)] mb-8">
                                {selectedIndustry?.tagline ?? 'Select all that apply, or describe it in your own words.'}
                            </p>

                            {selectedIndustry?.freeText || (selectedIndustry?.subNiches.length ?? 0) === 0 ? (
                                <div className="mb-8">
                                    <input
                                        type="text"
                                        value={data.subNiches[0] || ''}
                                        onChange={(e) => updateData('subNiches', [e.target.value])}
                                        className="w-full px-4 py-3 rounded-xl border-2 border-[var(--border)] bg-[var(--background)] text-[var(--text-primary)] focus:border-[var(--accent)] outline-none transition-colors"
                                        placeholder="e.g. Pediatric Dentistry, Commercial Real Estate, etc."
                                    />
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-3 mb-8">
                                    {selectedIndustry!.subNiches.map((niche) => (
                                        <button
                                            key={niche}
                                            onClick={() => toggleInArray('subNiches', niche)}
                                            className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${data.subNiches.includes(niche)
                                                ? 'border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--text-primary)]'
                                                : 'border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--accent)]'
                                                }`}
                                        >
                                            {niche}
                                        </button>
                                    ))}
                                </div>
                            )}

                            <button
                                onClick={handleNext}
                                disabled={data.subNiches.length === 0 || (data.subNiches.length === 1 && !data.subNiches[0])}
                                className="self-end bg-[var(--accent)] text-[var(--accent-foreground)] font-bold px-8 py-3 rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-glow transition-all"
                            >
                                Continue
                            </button>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <GbpStep
                            data={data}
                            updateData={updateData}
                            onNext={handleNext}
                            onSkip={handleNext}
                        />
                    )}

                    {step === 3 && (
                        <motion.div
                            key="step2-stage"
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

                    {step === 4 && (
                        <motion.div
                            key="step3-challenges"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="flex-1 flex flex-col"
                        >
                            <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Top Challenges</h2>
                            <p className="text-[var(--muted-foreground)] mb-8">Select all that apply (multi-select).</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                                {challengesList.map((challenge) => (
                                    <button
                                        key={challenge}
                                        onClick={() => toggleInArray('challenges', challenge)}
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

                    {step === 5 && (
                        <motion.div
                            key="step4-stack"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="flex-1 flex flex-col"
                        >
                            <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Current Stack & Gaps</h2>
                            <p className="text-[var(--muted-foreground)] mb-8">What are you running today, and where does it hurt? This drives the wireframe and tech stack we generate.</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                                {stackOptions.map((opt) => (
                                    <button
                                        key={opt}
                                        onClick={() => toggleInArray('currentStack', opt)}
                                        className={`p-3 rounded-xl border-2 transition-all duration-300 text-left text-sm ${data.currentStack.includes(opt)
                                            ? 'border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--text-primary)]'
                                            : 'border-[var(--border)] text-[var(--muted-foreground)] hover:border-[var(--accent)]'
                                            }`}
                                    >
                                        {opt}
                                    </button>
                                ))}
                            </div>

                            <div className="mb-6">
                                <label className="block text-[var(--text-primary)] font-semibold mb-2">Where does the legacy software hurt?</label>
                                <textarea
                                    value={data.legacyPain}
                                    onChange={(e) => updateData('legacyPain', e.target.value)}
                                    rows={3}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-[var(--border)] bg-[var(--background)] text-[var(--text-primary)] focus:border-[var(--accent)] outline-none transition-colors"
                                    placeholder="e.g. Dispatch is on whiteboards, claims appeals take 3 weeks, no API for our TMS…"
                                />
                            </div>

                            <button
                                onClick={handleNext}
                                disabled={data.currentStack.length === 0}
                                className="self-end bg-[var(--accent)] text-[var(--accent-foreground)] font-bold px-8 py-3 rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-glow transition-all"
                            >
                                Continue
                            </button>
                        </motion.div>
                    )}

                    {step === 6 && (
                        <motion.div
                            key="step5-team"
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
                                    <label className="block text-[var(--text-primary)] font-semibold mb-3">Budget for Growth</label>
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
                                    className="bg-[var(--accent)] text-[var(--accent-foreground)] font-bold px-8 py-3 rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-glow transition-all w-full mt-4"
                                >
                                    Continue
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {step === 7 && (
                        <motion.div
                            key="step6-timeline"
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
                                    <div className="grid grid-cols-3 gap-3 mb-2">
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

                                <div className="space-y-3 pt-2">
                                    <button
                                        onClick={() => { setIsPaid(true); handleNext(); }}
                                        disabled={!data.name || !data.email || !data.timeline}
                                        className="w-full bg-[var(--accent)] text-[var(--accent-foreground)] font-bold px-8 py-4 rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-glow transition-all"
                                    >
                                        Generate Full Plan
                                    </button>
                                    <button
                                        onClick={() => { setIsPaid(false); handleNext(); }}
                                        disabled={!data.name || !data.email || !data.timeline}
                                        className="w-full bg-transparent border-2 border-[var(--border)] text-[var(--text-primary)] font-semibold px-8 py-3 rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:border-[var(--accent)] transition-all"
                                    >
                                        Get the Free Preview First
                                    </button>
                                    <p className="text-xs text-[var(--muted-foreground)] text-center">
                                        Test mode: payment bypassed. Wireframe delivery via Hermes pipeline.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {step === 8 && (
                        <motion.div
                            key="step7"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex-1 flex flex-col items-center justify-center text-center w-full"
                        >
                            {isGenerating ? (
                                <div className="space-y-6 py-12">
                                    <div className="w-20 h-20 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin mx-auto" />
                                    <h2 className="text-2xl font-bold text-[var(--text-primary)]">Spinning up the agent crew…</h2>
                                    <p className="text-[var(--muted-foreground)]">Architect, CEO, designer and compliance officer are drafting your plan.</p>
                                </div>
                            ) : generatedPlan ? (
                                <div className="space-y-8 w-full text-left">
                                    <div className="text-center space-y-4">
                                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto text-3xl">
                                            ✅
                                        </div>
                                        <h2 className="text-3xl font-bold text-[var(--text-primary)]">Your Growth Plan</h2>
                                        <p className="text-[var(--muted-foreground)]">
                                            A tailored plan for your {selectedIndustry?.label ?? data.industry} business.
                                        </p>
                                    </div>

                                    <div className="bg-[var(--section-bg-1)] p-6 lg:p-8 rounded-2xl border border-[var(--border)] space-y-8">

                                        <div className="bg-[var(--card-background)] p-6 rounded-xl border border-[var(--border)] shadow-sm">
                                            <h3 className="text-xl font-bold text-[var(--accent)] mb-3 flex items-center gap-2">
                                                <span>🚀</span> Executive Summary
                                            </h3>
                                            <p className="text-[var(--text-secondary)] leading-relaxed text-lg">
                                                {generatedPlan.executive_summary}
                                            </p>
                                        </div>

                                        {/* Wireframe Section */}
                                        <div className="bg-[var(--card-background)] p-6 rounded-xl border border-[var(--border)]">
                                            <h3 className="text-xl font-bold text-[var(--accent)] mb-3 flex items-center gap-2">
                                                <span>🖼️</span> Wireframe
                                            </h3>
                                            {generatedPlan.wireframe_url ? (
                                                <iframe
                                                    srcDoc={generatedPlan.wireframe_html || atob(generatedPlan.wireframe_url.split(',')[1] || '')}
                                                    title="Wireframe Preview"
                                                    className="w-full rounded-lg border border-[var(--border)]"
                                                    style={{ height: '600px', border: 'none' }}
                                                    sandbox="allow-scripts"
                                                />
                                            ) : (
                                                <div className="space-y-4">
                                                    <p className="text-[var(--text-secondary)]">Generate a custom wireframe for your business based on your growth plan.</p>
                                                    <button
                                                        onClick={generateWireframe}
                                                        disabled={isGeneratingWireframe}
                                                        className="bg-[var(--accent)] text-[var(--accent-foreground)] font-bold px-6 py-3 rounded-full hover:shadow-glow transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                                    >
                                                        {isGeneratingWireframe ? (
                                                            <>
                                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                                Generating Wireframe...
                                                            </>
                                                        ) : (
                                                            <>🎨 Generate Free Wireframe</>
                                                        )}
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                        {generatedPlan.tech_stack && generatedPlan.tech_stack.length > 0 && (
                                            <div className="bg-[var(--card-background)] p-6 rounded-xl border border-[var(--border)]">
                                                <h3 className="text-xl font-bold text-[var(--accent)] mb-3 flex items-center gap-2">
                                                    <span>🧩</span> Recommended Tech Stack
                                                </h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {generatedPlan.tech_stack.map((layer, idx) => (
                                                        <div key={idx} className="border border-[var(--border)] rounded-lg p-4">
                                                            <p className="font-semibold text-[var(--text-primary)] mb-2">{layer.layer}</p>
                                                            <div className="flex flex-wrap gap-1.5">
                                                                {layer.tools.map((t, i) => (
                                                                    <span key={i} className="text-xs bg-[var(--section-bg-2)] border border-[var(--border)] px-2 py-1 rounded-full">{t}</span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <div className="space-y-6">
                                            <h3 className="text-2xl font-bold text-[var(--text-primary)] border-b border-[var(--border)] pb-2">Action Plan</h3>
                                            <div className="relative space-y-8 pl-4 lg:pl-0">
                                                <div className="hidden lg:block absolute left-[19px] top-4 bottom-4 w-0.5 bg-[var(--border)]" />

                                                {generatedPlan.phases.map((phase, idx) => (
                                                    <div key={idx} className="relative lg:pl-12">
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
                                                <p className="text-sm text-[var(--muted-foreground)]">Based on recommended services.</p>
                                            </div>
                                        </div>

                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <a
                                            href="/club"
                                            className="text-center bg-[var(--accent)] text-[var(--accent-foreground)] font-bold px-6 py-4 rounded-full hover:shadow-glow transition-all"
                                        >
                                            Join the Growth Club →
                                        </a>
                                        <a
                                            href="https://cal.com/sandeep-singh/30min"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-center border-2 border-[var(--border)] text-[var(--text-primary)] font-bold px-6 py-4 rounded-full hover:border-[var(--accent)] transition-all"
                                        >
                                            Book a Call
                                        </a>
                                    </div>

                                    <div className="text-center space-y-2">
                                        <p className="text-sm text-[var(--muted-foreground)]">
                                            Sent to <strong>{data.email}</strong>
                                        </p>
                                        <p className="text-xs text-[var(--muted-foreground)]">
                                            Looking for à-la-carte pricing instead? <a href="/services" className="text-[var(--accent)] hover:underline">View individual services →</a>
                                        </p>
                                        <button
                                            onClick={() => window.location.reload()}
                                            className="text-[var(--accent)] font-semibold hover:underline text-sm"
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

            {step > 0 && step < 8 && !isGenerating && (
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
