'use client';

import { useState, useMemo } from 'react';
import { agencyProjects, type ProjectStatus } from '../../data/agencyProjects';

const STATUS_LABEL: Record<ProjectStatus | 'all', string> = {
    all: 'All',
    live: 'Live',
    'in-progress': 'In Progress',
    shipped: 'Shipped',
};

const STATUS_BG: Record<ProjectStatus, string> = {
    live: 'rgba(34, 197, 94, 0.12)',
    'in-progress': 'rgba(245, 158, 11, 0.12)',
    shipped: 'rgba(99, 102, 241, 0.12)',
};

const STATUS_COLOR: Record<ProjectStatus, string> = {
    live: '#16a34a',
    'in-progress': '#d97706',
    shipped: '#6366f1',
};

export default function AgencyProjectsStrip() {
    const [filter, setFilter] = useState<ProjectStatus | 'all'>('all');

    const visible = useMemo(
        () => (filter === 'all' ? agencyProjects : agencyProjects.filter(p => p.status === filter)),
        [filter]
    );

    return (
        <section
            id="agency-projects"
            className="agency-page"
            style={{
                background: 'var(--agency-bg, #FAFAF8)',
                borderTop: '1px solid var(--agency-border, #E5E5E0)',
                padding: '64px 0',
            }}
        >
            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8">
                    <div>
                        <p
                            className="text-xs font-bold uppercase tracking-widest mb-2"
                            style={{ color: '#6B7280' }}
                        >
                            Engagements
                        </p>
                        <h2
                            className="text-3xl lg:text-5xl font-extrabold leading-tight"
                            style={{ color: '#111111' }}
                        >
                            Past &amp; current projects.
                        </h2>
                        <p className="text-base mt-3 max-w-2xl" style={{ color: '#4B5563' }}>
                            A working sample of what the agency has shipped and what it is shipping right now —
                            across healthcare, insurance, logistics, government and AEC.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {(['all', 'live', 'in-progress', 'shipped'] as const).map(key => {
                            const active = filter === key;
                            return (
                                <button
                                    key={key}
                                    onClick={() => setFilter(key)}
                                    className="text-xs font-semibold px-3 py-1.5 rounded-full border transition-all"
                                    style={{
                                        borderColor: active ? '#111111' : '#E5E5E0',
                                        background: active ? '#111111' : 'transparent',
                                        color: active ? '#FFFFFF' : '#374151',
                                    }}
                                >
                                    {STATUS_LABEL[key]}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {visible.map(project => (
                        <article
                            key={project.id}
                            className="group rounded-2xl border transition-all duration-200"
                            style={{
                                background: '#FFFFFF',
                                borderColor: '#E5E5E0',
                                padding: 20,
                                position: 'relative',
                                overflow: 'hidden',
                            }}
                        >
                            <div
                                style={{
                                    position: 'absolute', top: 0, left: 0, right: 0, height: 3,
                                    background: project.accent,
                                }}
                            />
                            <div className="flex items-start justify-between gap-3 mb-3">
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#6B7280' }}>
                                        {project.industry}
                                    </p>
                                    <h3 className="text-lg font-bold mt-1" style={{ color: '#111111' }}>
                                        {project.name}
                                    </h3>
                                </div>
                                <span
                                    className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full whitespace-nowrap"
                                    style={{
                                        background: STATUS_BG[project.status],
                                        color: STATUS_COLOR[project.status],
                                    }}
                                >
                                    {STATUS_LABEL[project.status]}
                                </span>
                            </div>
                            <p className="text-sm leading-relaxed mb-4" style={{ color: '#4B5563' }}>
                                {project.summary}
                            </p>
                            {project.metric && (
                                <div
                                    className="text-xs font-semibold rounded-lg px-3 py-2"
                                    style={{ background: '#F5F5F0', color: '#111111' }}
                                >
                                    {project.metric}
                                </div>
                            )}
                        </article>
                    ))}
                </div>

                {visible.length === 0 && (
                    <div className="text-center py-12" style={{ color: '#6B7280' }}>
                        Nothing matching that status. Try another filter.
                    </div>
                )}
            </div>
        </section>
    );
}
