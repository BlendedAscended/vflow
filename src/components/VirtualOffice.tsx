'use client';

import { useState, useEffect } from 'react';

const pulseKeyframes = `
  @keyframes pulse-glow {
    0%, 100% { opacity: 0.25; transform: scale(1); }
    50% { opacity: 0.45; transform: scale(1.08); }
  }
  @keyframes pulse-inner {
    0%, 100% { opacity: 0.35; }
    50% { opacity: 0.6; }
  }
  @keyframes vo-fade-in-up {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes dot-ping {
    0% { transform: scale(1); opacity: 1; }
    75%, 100% { transform: scale(2.2); opacity: 0; }
  }
  @keyframes vo-slide-in {
    from { opacity: 0; transform: translateX(10px); }
    to { opacity: 1; transform: translateX(0); }
  }
`;

interface RoomAvatar {
    name: string;
    url: string;
}
interface Room {
    id: string;
    name: string;
    subtitle: string;
    x: string;
    y: string;
    glowColor: string;
    dotColor: string;
    status: string;
    avatars: RoomAvatar[];
}

const activeRooms: Room[] = [
    {
        id: 'meeting',
        name: 'Client Suite',
        subtitle: 'Starts at 14:00 EST',
        x: '16%', y: '28%',
        glowColor: 'rgba(34,211,238,0.55)',
        dotColor: '#22d3ee',
        status: 'Scheduled',
        avatars: [{ name: 'Client', url: 'https://i.pravatar.cc/150?u=client1' }],
    },
    {
        id: 'orchestration',
        name: 'Command Center',
        subtitle: 'Supervising Agents',
        x: '50%', y: '46%',
        glowColor: 'rgba(59,130,246,0.6)',
        dotColor: '#3b82f6',
        status: 'Live',
        avatars: [
            { name: 'San', url: 'https://i.pravatar.cc/150?u=san' },
            { name: 'Guardian', url: 'https://ui-avatars.com/api/?name=G&background=0F2557&color=93C5FD&bold=true&rounded=true' },
        ],
    },
    {
        id: 'design',
        name: 'Design Studio',
        subtitle: 'Tensei UI Specs',
        x: '80%', y: '30%',
        glowColor: 'rgba(99,102,241,0.5)',
        dotColor: '#818cf8',
        status: 'Active',
        avatars: [{ name: 'Design Agent', url: 'https://ui-avatars.com/api/?name=DA&background=312e81&color=a5b4fc&bold=true&rounded=true' }],
    },
    {
        id: 'engine',
        name: 'Engine Room',
        subtitle: 'Galaxy Pipeline QA',
        x: '27%', y: '72%',
        glowColor: 'rgba(96,165,250,0.5)',
        dotColor: '#60a5fa',
        status: 'Active',
        avatars: [{ name: 'Prometheus', url: 'https://ui-avatars.com/api/?name=PM&background=1e3a5f&color=7dd3fc&bold=true&rounded=true' }],
    },
];

const liveFeed = [
    { time: 'Just now', event: 'San approved Tensei Extension manifest v2.4', dot: '#3b82f6' },
    { time: '3m ago', event: 'Titan routed Trust One Services outreach batch', dot: '#818cf8' },
    { time: '18m ago', event: 'Design Agent finalized Studio White matrix tokens', dot: '#60a5fa' },
    { time: '1h ago', event: 'Client discovery call confirmed for 14:00', dot: '#22d3ee' },
    { time: '2h ago', event: 'Guardian patched Galaxy n8n webhook timeout', dot: '#3b82f6' },
];

const ActivityIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
);
const ClockIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
);
const PhoneIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#93c5fd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.99 12 19.79 19.79 0 0 1 1.96 3.26 2 2 0 0 1 3.93 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
);
const UsersIcon = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
);
const BriefcaseIcon = () => (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
);
const CheckIcon = () => (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
    </svg>
);

export default function VirtualOffice() {
    const [currentTime, setCurrentTime] = useState<Date | null>(null);
    const [hoveredRoom, setHoveredRoom] = useState<string | null>(null);

    useEffect(() => {
        setCurrentTime(new Date());
        const t = setInterval(() => setCurrentTime(new Date()), 60000);
        return () => clearInterval(t);
    }, []);

    const fmt = (d: Date) => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <>
            <style>{pulseKeyframes}</style>
            <div style={{
                width: '100%',
                minHeight: 'calc(100vh - 80px)',
                paddingTop: 96,
                background: 'linear-gradient(145deg,#f0f4ff 0%,#f8fafc 45%,#eef2ff 100%)',
                fontFamily: "'DM Sans',system-ui,sans-serif",
                color: '#1e293b',
                position: 'relative',
                overflow: 'hidden',
            }}>

                {/* Grid background */}
                <div style={{
                    position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none',
                    backgroundImage: 'radial-gradient(circle,rgba(148,163,184,0.13) 1px,transparent 1px)',
                    backgroundSize: '30px 30px',
                }} />

                {/* Ambient blobs */}
                <div style={{ position: 'absolute', top: '8%', left: '4%', width: 380, height: 380, borderRadius: '50%', background: 'radial-gradient(circle,rgba(99,102,241,0.07) 0%,transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
                <div style={{ position: 'absolute', bottom: '4%', right: '6%', width: 460, height: 460, borderRadius: '50%', background: 'radial-gradient(circle,rgba(59,130,246,0.08) 0%,transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

                {/* Top-right time pill */}
                <div style={{
                    position: 'absolute', top: 100, left: 32, zIndex: 30,
                    fontSize: 11, color: '#64748b', fontWeight: 600,
                    background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(226,232,240,0.7)',
                    padding: '6px 12px', borderRadius: 100,
                }}>
                    {currentTime ? `${fmt(currentTime)} EST` : '— EST'} · Floor Live
                </div>

                {/* Main canvas */}
                <main style={{ position: 'relative', width: '100%', height: 'calc(100vh - 80px)', minHeight: 620 }}>

                    {/* Structural walls */}
                    {[
                        { top: '36%', left: 0, width: '38%', height: 3 },
                        { top: '36%', right: 0, width: '43%', height: 3 },
                        { top: '66%', left: 0, width: '58%', height: 3 },
                        { top: 0, left: '36%', width: 3, height: '36%' },
                        { bottom: 0, right: '24%', width: 3, height: '64%' },
                    ].map((w, i) => (
                        <div key={i} style={{
                            position: 'absolute', zIndex: 1,
                            background: 'rgba(255,255,255,0.9)',
                            boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                            borderRadius: 6, ...w,
                        }} />
                    ))}

                    {/* Floor zone labels */}
                    {[
                        { label: 'WEST WING', x: '7%', y: '54%' },
                        { label: 'EAST WING', x: '63%', y: '60%' },
                        { label: 'CORE', x: '46%', y: '80%' },
                    ].map((z, i) => (
                        <div key={i} style={{
                            position: 'absolute', left: z.x, top: z.y, zIndex: 2,
                            fontSize: 9, fontWeight: 700, color: 'rgba(148,163,184,0.45)',
                            letterSpacing: '0.2em', textTransform: 'uppercase', userSelect: 'none',
                        }}>{z.label}</div>
                    ))}

                    {/* Active Rooms */}
                    {activeRooms.map((room, idx) => (
                        <div
                            key={room.id}
                            style={{
                                position: 'absolute', left: room.x, top: room.y,
                                transform: 'translate(-50%,-50%)', zIndex: 10,
                                display: 'flex', flexDirection: 'column', alignItems: 'center',
                                animation: `vo-fade-in-up 0.5s ease ${idx * 0.1}s both`,
                                cursor: 'default',
                            }}
                            onMouseEnter={() => setHoveredRoom(room.id)}
                            onMouseLeave={() => setHoveredRoom(null)}
                        >
                            <div style={{
                                position: 'absolute', zIndex: -1,
                                width: 260, height: 260, borderRadius: '50%',
                                background: `radial-gradient(circle,${room.glowColor} 0%,transparent 70%)`,
                                animation: 'pulse-glow 3s ease-in-out infinite',
                                animationDelay: `${idx * 0.7}s`,
                            }} />
                            <div style={{
                                position: 'absolute', zIndex: -1,
                                width: 110, height: 110, borderRadius: '50%',
                                background: `radial-gradient(circle,${room.glowColor} 0%,transparent 65%)`,
                                animation: 'pulse-inner 2.2s ease-in-out infinite',
                                animationDelay: `${idx * 0.4}s`,
                            }} />

                            <div style={{
                                background: hoveredRoom === room.id ? 'rgba(255,255,255,0.97)' : 'rgba(255,255,255,0.84)',
                                backdropFilter: 'blur(20px)', borderRadius: 18,
                                padding: '9px 16px', marginBottom: 9, textAlign: 'center', minWidth: 150,
                                border: `1px solid ${hoveredRoom === room.id ? room.dotColor + '55' : 'rgba(226,232,240,0.7)'}`,
                                boxShadow: hoveredRoom === room.id
                                    ? `0 8px 28px ${room.glowColor}`
                                    : '0 3px 12px rgba(0,0,0,0.04)',
                                transition: 'all 0.22s ease',
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 2 }}>
                                    <div style={{ position: 'relative', width: 7, height: 7 }}>
                                        <div style={{
                                            position: 'absolute', inset: 0, borderRadius: '50%',
                                            background: room.dotColor, opacity: 0.4,
                                            animation: 'dot-ping 1.5s cubic-bezier(0,0,0.2,1) infinite',
                                            animationDelay: `${idx * 0.3}s`,
                                        }} />
                                        <div style={{ position: 'relative', width: 7, height: 7, borderRadius: '50%', background: room.dotColor }} />
                                    </div>
                                    <span style={{ fontSize: 13, fontWeight: 700, color: '#1e293b', letterSpacing: '-0.2px' }}>
                                        {room.name}
                                    </span>
                                </div>
                                <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500 }}>{room.subtitle}</div>
                                <div style={{
                                    display: 'inline-block', marginTop: 5, fontSize: 9, fontWeight: 700,
                                    letterSpacing: '0.1em', textTransform: 'uppercase', color: room.dotColor,
                                    background: `${room.dotColor}18`, padding: '2px 8px', borderRadius: 20,
                                }}>{room.status}</div>
                            </div>

                            <div style={{
                                display: 'flex',
                                background: 'rgba(255,255,255,0.88)',
                                padding: '4px 7px', borderRadius: 100,
                                backdropFilter: 'blur(16px)',
                                border: '1px solid rgba(255,255,255,0.8)',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                            }}>
                                {room.avatars.map((av, i) => (
                                    <div key={i} style={{ marginLeft: i > 0 ? -9 : 0 }}>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={av.url} alt={av.name} style={{
                                            width: 32, height: 32, borderRadius: '50%',
                                            border: '2px solid #fff',
                                            boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
                                            objectFit: 'cover', display: 'block',
                                        }} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    {/* Bottom Panels */}
                    <div style={{
                        position: 'absolute', bottom: 22, left: 0, right: 0,
                        padding: '0 32px', display: 'flex', justifyContent: 'space-between',
                        alignItems: 'flex-end', zIndex: 30, pointerEvents: 'none',
                        flexWrap: 'wrap', gap: 16,
                    }}>

                        <div style={{
                            background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(24px)',
                            borderRadius: 22, padding: '22px 24px',
                            border: '1px solid rgba(226,232,240,0.8)',
                            boxShadow: '0 8px 40px rgba(0,0,0,0.05)',
                            width: 272, pointerEvents: 'auto',
                            animation: 'vo-fade-in-up 0.6s ease 0.2s both',
                        }}>
                            <div style={{ marginBottom: 16 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                                    <ActivityIcon />
                                    <span style={{ fontSize: 14, fontWeight: 700, color: '#0f2557' }}>Live Operations</span>
                                </div>
                                <div style={{ fontSize: 11, color: '#94a3b8' }}>Real time public metrics</div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
                                <div style={{
                                    background: 'linear-gradient(135deg,rgba(37,99,235,0.07),rgba(99,102,241,0.05))',
                                    borderRadius: 14, padding: '12px 14px',
                                    border: '1px solid rgba(99,102,241,0.12)',
                                }}>
                                    <div style={{ fontSize: 26, fontWeight: 800, color: '#2563eb', letterSpacing: '-1px' }}>7</div>
                                    <div style={{ fontSize: 9, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                                        <BriefcaseIcon /> Active
                                    </div>
                                </div>
                                <div style={{ background: '#f8fafc', borderRadius: 14, padding: '12px 14px' }}>
                                    <div style={{ fontSize: 26, fontWeight: 800, color: '#1e293b', letterSpacing: '-1px' }}>247</div>
                                    <div style={{ fontSize: 9, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                                        <CheckIcon /> Done
                                    </div>
                                </div>
                            </div>

                            <div style={{ borderTop: '1px solid rgba(226,232,240,0.8)', paddingTop: 14, display: 'flex', flexDirection: 'column', gap: 9 }}>
                                {[
                                    { label: 'Autonomous Agents', value: '4 Online' },
                                    { label: 'Human Supervisors', value: '1 Present' },
                                ].map((row, i) => (
                                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: 12, color: '#64748b', display: 'flex', alignItems: 'center', gap: 5 }}>
                                            <UsersIcon /> {row.label}
                                        </span>
                                        <span style={{ fontSize: 12, fontWeight: 700, color: '#1e293b' }}>{row.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div style={{
                            background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(24px)',
                            borderRadius: 22, padding: '22px 24px',
                            border: '1px solid rgba(226,232,240,0.8)',
                            boxShadow: '0 8px 40px rgba(0,0,0,0.05)',
                            width: 360, pointerEvents: 'auto',
                            animation: 'vo-fade-in-up 0.6s ease 0.35s both',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                                <ClockIcon />
                                <span style={{ fontSize: 14, fontWeight: 700, color: '#0f2557' }}>Agent Activity Feed</span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
                                {liveFeed.map((item, i) => (
                                    <div key={i} style={{
                                        display: 'flex', alignItems: 'flex-start', gap: 11,
                                        animation: `vo-slide-in 0.4s ease ${i * 0.08}s both`,
                                    }}>
                                        <div style={{
                                            width: 6, height: 6, borderRadius: '50%', background: item.dot,
                                            marginTop: 5, flexShrink: 0,
                                        }} />
                                        <div>
                                            <div style={{ fontSize: 12, fontWeight: 600, color: '#334155', lineHeight: 1.45 }}>{item.event}</div>
                                            <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 2 }}>{item.time}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Book a Session card */}
                    <div style={{
                        position: 'absolute', top: 110, right: 32, zIndex: 30,
                        animation: 'vo-fade-in-up 0.6s ease 0.1s both',
                    }}>
                        <a href="https://cal.com/sandeep-singh/30min" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                            <div style={{
                                background: 'linear-gradient(155deg,#0f2557 0%,#1a3a7a 100%)',
                                borderRadius: 26, padding: '26px 26px 22px',
                                boxShadow: '0 24px 60px rgba(15,37,87,0.3),0 0 0 1px rgba(99,102,241,0.2)',
                                width: 255, position: 'relative', overflow: 'hidden',
                            }}>
                                <div style={{
                                    position: 'absolute', top: -40, right: -40, width: 150, height: 150,
                                    borderRadius: '50%', background: 'rgba(99,102,241,0.15)',
                                }} />
                                <div style={{
                                    position: 'absolute', bottom: -18, left: -18, width: 90, height: 90,
                                    borderRadius: '50%', background: 'rgba(37,99,235,0.18)',
                                }} />
                                <div style={{
                                    width: 44, height: 44, borderRadius: 13,
                                    background: 'rgba(255,255,255,0.1)',
                                    border: '1px solid rgba(255,255,255,0.15)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    marginBottom: 18, position: 'relative',
                                }}>
                                    <PhoneIcon />
                                </div>
                                <div style={{ fontSize: 18, fontWeight: 800, color: '#fff', marginBottom: 7, letterSpacing: '-0.3px', position: 'relative' }}>
                                    Book a Session
                                </div>
                                <div style={{ fontSize: 12, color: '#93c5fd', lineHeight: 1.65, marginBottom: 22, position: 'relative' }}>
                                    Schedule a discovery call. Slots from 15 minutes to 1 hour.
                                </div>
                                <button style={{
                                    width: '100%', padding: '11px 0', borderRadius: 13,
                                    background: '#fff', color: '#0f2557',
                                    border: 'none', cursor: 'pointer',
                                    fontWeight: 700, fontSize: 13, fontFamily: 'inherit',
                                    boxShadow: '0 4px 14px rgba(0,0,0,0.12)',
                                    position: 'relative',
                                }}>View Calendar</button>
                            </div>
                        </a>
                    </div>

                </main>
            </div>
        </>
    );
}
