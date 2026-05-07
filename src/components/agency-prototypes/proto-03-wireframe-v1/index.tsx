'use client';

import { useState, useEffect, ReactNode } from 'react';
import styles from './styles.module.css';

const cx = (...args: (string | false | undefined | null)[]): string =>
  args.filter(Boolean).join(' ');

export default function Proto03WireframeV1() {
  const [time, setTime] = useState('--:--');

  useEffect(() => {
    const update = () =>
      setTime(
        new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })
      );
    update();
    const id = setInterval(update, 30000);
    return () => clearInterval(id);
  }, []);

  const Pawn = ({
    color = '',
    size = 36,
    status,
    dark,
  }: {
    color?: string;
    size?: number;
    status?: string;
    dark?: boolean;
  }) => (
    <div
      className={cx(
        styles['pawn'],
        dark && styles['dark'],
        color && styles[color as keyof typeof styles]
      )}
      style={{ width: size, height: size }}
    >
      {status && (
        <span
          className={cx(
            styles['status-dot'],
            status && styles[status as keyof typeof styles]
          )}
          style={{ width: size * 0.3, height: size * 0.3 }}
        />
      )}
    </div>
  );

  const Cap = ({
    children,
    dark,
    green,
    style,
  }: {
    children: ReactNode;
    dark?: boolean;
    green?: boolean;
    style?: React.CSSProperties;
  }) => (
    <div
      className={cx(
        styles['sk-cap'],
        dark && styles['dark'],
        green && styles['green']
      )}
      style={style}
    >
      {children}
    </div>
  );

  const Pill = ({
    children,
    variant = '',
    style,
  }: {
    children: ReactNode;
    variant?: string;
    style?: React.CSSProperties;
  }) => (
    <span
      className={cx(
        styles['sk-pill'],
        variant && styles[variant as keyof typeof styles]
      )}
      style={style}
    >
      {children}
    </span>
  );

  const AnnoBar = ({
    dark,
    num,
    items,
  }: {
    dark?: boolean;
    num: string;
    items: { t: string; d: string }[];
  }) => (
    <div className={cx(styles['anno-bar'], dark && styles['dark'])}>
      <div className={styles['anno-num']}>{num}</div>
      {items.map((it, i) => (
        <div key={i}>
          <b>{it.t}</b>
          {it.d}
        </div>
      ))}
    </div>
  );

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;500;600;700&family=Kalam:wght@300;400;700&family=Architects+Daughter&family=DM+Sans:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap"
        rel="stylesheet"
      />

      <div className={styles['root']}>
        {/* HEADER STRIP */}
        <div className={styles['ctx-bar']}>
          <div>
            <h1>Agency Page · Wireframe Round 2</h1>
            <div className={styles['meta']}>
              Direction <strong>B + D</strong> — top-down blueprint floor with
              animated task-flow lines. Hero is edge-to-edge dark
              (Huly-style). Sections below: Live Ops · Services · Agents ·
              How it works · Pricing · CTA. Includes profile-drawer + booking
              interaction sketch.
            </div>
          </div>
          <div className={styles['stamp']}>Lo-fi · Round 2</div>
        </div>

        {/* SECTION ANCHOR NAV */}
        <div className={styles['secnav']}>
          <span className={styles['label']}>Jump to →</span>
          <a href="#hero">
            <span className={styles['num']}>01</span>Floor (Hero)
          </a>
          <a href="#liveops">
            <span className={styles['num']}>02</span>Live Ops
          </a>
          <a href="#services">
            <span className={styles['num']}>03</span>Services
          </a>
          <a href="#agents">
            <span className={styles['num']}>04</span>Agents + Drawer
          </a>
          <a href="#how">
            <span className={styles['num']}>05</span>How it works
          </a>
          <a href="#pricing">
            <span className={styles['num']}>06</span>Pricing
          </a>
          <a href="#cta">
            <span className={styles['num']}>07</span>CTA
          </a>
        </div>

        {/* WORKSPACE / MOCK BROWSER */}
        <div className={styles['workspace']}>
          <div className={styles['mock']}>
            {/* Mock toolbar */}
            <div className={styles['mock-toolbar']}>
              <span
                className={styles['dot']}
                style={{ background: '#ff6b6b' }}
              />
              <span
                className={styles['dot']}
                style={{ background: '#ffd93d' }}
              />
              <span
                className={styles['dot']}
                style={{ background: '#6bcf7f' }}
              />
              <span className={styles['url']}>
                verbaflowllc.com/agency
              </span>
              <span
                style={{
                  marginLeft: 'auto',
                  fontFamily: 'DM Mono',
                  fontSize: 10,
                  color: 'var(--ink-3)',
                }}
              >
                1280 × scroll
              </span>
            </div>

            {/* HERO — FULL-BLEED FLOOR PLAN */}
            <div id="hero" className={styles['floor-stage']}>
              {/* Glow blobs */}
              <div
                className={styles['glow-blob']}
                style={{
                  top: '-10%',
                  right: '8%',
                  width: 520,
                  height: 520,
                  background: 'rgba(165,214,167,0.18)',
                }}
              />
              <div
                className={styles['glow-blob']}
                style={{
                  bottom: '-15%',
                  left: '-5%',
                  width: 560,
                  height: 560,
                  background: 'rgba(110,148,214,0.15)',
                }}
              />

              {/* Top Nav */}
              <div className={styles['nav']}>
                <div className={styles['nav-logo']}>
                  <div className={styles['lo']}>V</div>
                  <span
                    style={{
                      fontFamily: 'Caveat',
                      fontSize: 24,
                      fontWeight: 700,
                      color: '#fff',
                    }}
                  >
                    Verbaflow LLC
                  </span>
                  <Pill
                    variant="dark"
                    style={{
                      fontSize: 10,
                      padding: '2px 10px',
                      marginLeft: 6,
                    }}
                  >
                    ● Agency
                  </Pill>
                </div>
                <div
                  style={{
                    display: 'flex',
                    gap: 8,
                    alignItems: 'center',
                  }}
                >
                  <Pill variant="dark" style={{ fontSize: 11 }}>
                    Services
                  </Pill>
                  <Pill variant="dark" style={{ fontSize: 11 }}>
                    Agents
                  </Pill>
                  <Pill variant="dark" style={{ fontSize: 11 }}>
                    How it works
                  </Pill>
                  <Pill variant="dark" style={{ fontSize: 11 }}>
                    Pricing
                  </Pill>
                  <Pill
                    variant="green"
                    style={{
                      fontSize: 12,
                      padding: '5px 16px',
                      marginLeft: 6,
                    }}
                  >
                    Book Call →
                  </Pill>
                </div>
              </div>

              {/* Hero copy */}
              <div className={styles['hero-copy']}>
                <Cap green>
                  ● Live · Agency Floor · {time} EST
                </Cap>
                <h1 className={styles['hero-headline']}>
                  Step inside
                  <br />
                  <span className={styles['accent']}>the agency.</span>
                </h1>
                <p className={styles['hero-sub']}>
                  Watch your AI agents and human supervisors work in real
                  time. Drop into any room, click any agent, book any slot.
                  The floor is always live.
                </p>
                <div
                  style={{
                    display: 'flex',
                    gap: 10,
                    marginTop: 20,
                    flexWrap: 'wrap',
                  }}
                >
                  <Pill
                    variant="green"
                    style={{ fontSize: 14, padding: '8px 22px' }}
                  >
                    Book a Session →
                  </Pill>
                  <Pill
                    variant="dark"
                    style={{
                      fontSize: 14,
                      padding: '8px 22px',
                      color: '#fff',
                    }}
                  >
                    See the agents
                  </Pill>
                </div>
              </div>

              {/* Floor plan */}
              <div className={styles['floorplan-wrap']}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 14,
                  }}
                >
                  <Cap dark>Floor map · live</Cap>
                  <div
                    style={{
                      display: 'flex',
                      gap: 14,
                      alignItems: 'center',
                      fontFamily: 'Kalam',
                      fontSize: 12,
                      color: 'rgba(255,255,255,0.65)',
                    }}
                  >
                    <span>
                      <span className={styles['ldot']} /> Live
                    </span>
                    <span style={{ marginLeft: 6 }}>
                      <span className={cx(styles['ldot'], styles['amber'])} />{' '}
                      Busy
                    </span>
                    <span style={{ marginLeft: 6 }}>
                      <span className={cx(styles['ldot'], styles['blue'])} />{' '}
                      Scheduled
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: 380,
                  }}
                >
                  <svg
                    viewBox="0 0 1000 380"
                    preserveAspectRatio="none"
                    style={{ width: '100%', height: '100%' }}
                  >
                    {/* Outer wall */}
                    <rect
                      x="6"
                      y="6"
                      width="988"
                      height="368"
                      fill="rgba(255,255,255,0.02)"
                      stroke="rgba(255,255,255,0.45)"
                      strokeWidth="2.5"
                      rx="6"
                    />
                    {/* Inner walls (form 4 rooms + corridor) */}
                    <line
                      x1="380"
                      y1="6"
                      x2="380"
                      y2="180"
                      stroke="rgba(255,255,255,0.45)"
                      strokeWidth="2"
                    />
                    <line
                      x1="6"
                      y1="220"
                      x2="380"
                      y2="220"
                      stroke="rgba(255,255,255,0.45)"
                      strokeWidth="2"
                    />
                    <line
                      x1="640"
                      y1="160"
                      x2="994"
                      y2="160"
                      stroke="rgba(255,255,255,0.45)"
                      strokeWidth="2"
                    />
                    <line
                      x1="640"
                      y1="160"
                      x2="640"
                      y2="374"
                      stroke="rgba(255,255,255,0.45)"
                      strokeWidth="2"
                    />
                    {/* Door gaps (cut walls) */}
                    <line
                      x1="380"
                      y1="90"
                      x2="380"
                      y2="120"
                      stroke="#0d1722"
                      strokeWidth="5"
                    />
                    <line
                      x1="180"
                      y1="220"
                      x2="220"
                      y2="220"
                      stroke="#0d1722"
                      strokeWidth="5"
                    />
                    <line
                      x1="640"
                      y1="240"
                      x2="640"
                      y2="280"
                      stroke="#0d1722"
                      strokeWidth="5"
                    />

                    {/* Zone labels */}
                    <text
                      x="40"
                      y="32"
                      fontFamily="DM Mono"
                      fontSize="11"
                      fill="rgba(165,214,167,0.5)"
                      letterSpacing="2"
                    >
                      WEST WING
                    </text>
                    <text
                      x="430"
                      y="32"
                      fontFamily="DM Mono"
                      fontSize="11"
                      fill="rgba(165,214,167,0.5)"
                      letterSpacing="2"
                    >
                      DESIGN WING
                    </text>
                    <text
                      x="40"
                      y="246"
                      fontFamily="DM Mono"
                      fontSize="11"
                      fill="rgba(165,214,167,0.5)"
                      letterSpacing="2"
                    >
                      CORE
                    </text>
                    <text
                      x="680"
                      y="186"
                      fontFamily="DM Mono"
                      fontSize="11"
                      fill="rgba(165,214,167,0.5)"
                      letterSpacing="2"
                    >
                      EAST WING
                    </text>

                    {/* Animated TASK FLOW lines (D-direction) */}
                    <path
                      d="M 200 110 Q 280 110 280 200 T 420 270 T 720 290"
                      fill="none"
                      stroke="#A5D6A7"
                      strokeWidth="2"
                      strokeDasharray="6 6"
                      opacity="0.7"
                      className={styles['flow-line']}
                    />
                    <path
                      d="M 720 110 Q 600 110 540 200 T 300 290"
                      fill="none"
                      stroke="#6e94d6"
                      strokeWidth="2"
                      strokeDasharray="6 6"
                      opacity="0.7"
                      className={styles['flow-line']}
                      style={{ animationDuration: '4s' }}
                    />
                    <path
                      d="M 720 290 Q 720 200 820 200 T 880 110"
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="2"
                      strokeDasharray="6 6"
                      opacity="0.6"
                      className={styles['flow-line']}
                      style={{ animationDuration: '5s' }}
                    />

                    {/* Flowing dots on the lines */}
                    <circle r="4" fill="#A5D6A7">
                      <animateMotion
                        dur="3.5s"
                        repeatCount="indefinite"
                        path="M 200 110 Q 280 110 280 200 T 420 270 T 720 290"
                      />
                    </circle>
                    <circle r="4" fill="#6e94d6">
                      <animateMotion
                        dur="3s"
                        repeatCount="indefinite"
                        path="M 720 110 Q 600 110 540 200 T 300 290"
                      />
                    </circle>
                    <circle r="4" fill="#f59e0b">
                      <animateMotion
                        dur="4.5s"
                        repeatCount="indefinite"
                        path="M 720 290 Q 720 200 820 200 T 880 110"
                      />
                    </circle>

                    {/* Pulse beacons at room centers */}
                    <g opacity="0.6">
                      <circle
                        cx="190"
                        cy="100"
                        r="32"
                        fill="rgba(110,148,214,0.15)"
                      />
                      <circle
                        cx="540"
                        cy="90"
                        r="38"
                        fill="rgba(245,158,11,0.13)"
                      />
                      <circle
                        cx="820"
                        cy="80"
                        r="32"
                        fill="rgba(165,214,167,0.18)"
                      />
                      <circle
                        cx="190"
                        cy="290"
                        r="40"
                        fill="rgba(165,214,167,0.22)"
                      />
                      <circle
                        cx="820"
                        cy="290"
                        r="32"
                        fill="rgba(110,148,214,0.13)"
                      />
                    </g>
                  </svg>

                  {/* Room cards (positioned absolutely) */}
                  <div
                    className={styles['room-card']}
                    style={{ top: '8%', left: '14%' }}
                  >
                    <div className={styles['rname']}>
                      <span className={cx(styles['ldot'], styles['blue'])} />
                      Client Suite
                    </div>
                    <div className={styles['rsub']}>
                      14:00 EST · Discovery
                    </div>
                    <div className={styles['ravs']}>
                      <Pawn color="blue" size={28} dark />
                    </div>
                  </div>
                  <div
                    className={styles['room-card']}
                    style={{ top: '8%', left: '48%' }}
                  >
                    <div className={styles['rname']}>
                      <span className={cx(styles['ldot'], styles['amber'])} />
                      Design Studio
                    </div>
                    <div className={styles['rsub']}>
                      Tensei UI specs · busy
                    </div>
                    <div className={styles['ravs']}>
                      <Pawn color="amber" size={28} dark status="busy" />
                    </div>
                  </div>
                  <div
                    className={cx(styles['room-card'], styles['live'])}
                    style={{ top: '8%', right: '8%' }}
                  >
                    <div className={styles['rname']}>
                      <span className={styles['ldot']} />
                      Engine Room
                    </div>
                    <div className={styles['rsub']}>Galaxy QA · live</div>
                    <div className={styles['ravs']}>
                      <Pawn color="green" size={28} dark status="" />
                    </div>
                  </div>
                  <div
                    className={cx(styles['room-card'], styles['live'])}
                    style={{ top: '62%', left: '10%' }}
                  >
                    <div className={styles['rname']}>
                      <span className={styles['ldot']} />
                      Command Center
                    </div>
                    <div className={styles['rsub']}>
                      San + 2 agents · supervising
                    </div>
                    <div className={styles['ravs']}>
                      <Pawn color="green" size={28} dark status="" />
                      <Pawn color="note" size={28} dark />
                      <Pawn color="blue" size={28} dark />
                    </div>
                  </div>
                  <div
                    className={styles['room-card']}
                    style={{ top: '62%', right: '10%' }}
                  >
                    <div className={styles['rname']}>
                      <span className={cx(styles['ldot'], styles['blue'])} />
                      Boardroom
                    </div>
                    <div className={styles['rsub']}>
                      Empty · book a slot
                    </div>
                    <div className={styles['ravs']} style={{ marginTop: 6 }}>
                      <Pill
                        variant="green"
                        style={{ fontSize: 10, padding: '2px 8px' }}
                      >
                        + Reserve
                      </Pill>
                    </div>
                  </div>
                </div>

                {/* Anno labels around the floor */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginTop: 16,
                    gap: 24,
                    flexWrap: 'wrap',
                  }}
                >
                  <span className={cx(styles['anno'], styles['dark'])}>
                    ↗ animated dotted lines = tasks flowing between rooms
                    (live)
                  </span>
                  <span className={cx(styles['anno'], styles['dark'])}>
                    click any room → join meeting / book slot ↘
                  </span>
                </div>
              </div>

              {/* Stat strip */}
              <div className={styles['stat-strip']}>
                <div
                  className={cx(styles['sk-box'], styles['dark'])}
                  style={{ padding: 18 }}
                >
                  <Cap dark>Active projects</Cap>
                  <div
                    style={{
                      fontFamily: 'Caveat',
                      fontSize: 54,
                      fontWeight: 700,
                      lineHeight: 1,
                      color: '#fff',
                      marginTop: 4,
                    }}
                  >
                    7
                  </div>
                  <div
                    style={{
                      fontFamily: 'Kalam',
                      fontSize: 12,
                      color: 'rgba(255,255,255,0.55)',
                      marginTop: 4,
                    }}
                  >
                    across 4 industries
                  </div>
                </div>
                <div
                  className={cx(styles['sk-box'], styles['dark'])}
                  style={{ padding: 18 }}
                >
                  <Cap dark>On the floor now</Cap>
                  <div
                    style={{
                      fontFamily: 'Caveat',
                      fontSize: 54,
                      fontWeight: 700,
                      lineHeight: 1,
                      color: 'var(--accent)',
                      marginTop: 4,
                    }}
                  >
                    4 + 1
                  </div>
                  <div
                    style={{
                      fontFamily: 'Kalam',
                      fontSize: 12,
                      color: 'rgba(255,255,255,0.55)',
                      marginTop: 4,
                    }}
                  >
                    4 AI agents · 1 supervisor
                  </div>
                </div>
                <div
                  className={cx(styles['sk-box'], styles['dark'])}
                  style={{
                    padding: 18,
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <Cap dark>Next available slot</Cap>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 14,
                      marginTop: 6,
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontFamily: 'Caveat',
                          fontSize: 34,
                          fontWeight: 700,
                          color: '#fff',
                          lineHeight: 1,
                        }}
                      >
                        Today · 14:00 EST
                      </div>
                      <div
                        style={{
                          fontFamily: 'Kalam',
                          fontSize: 12,
                          color: 'rgba(255,255,255,0.6)',
                          marginTop: 4,
                        }}
                      >
                        15-min discovery · with San
                      </div>
                    </div>
                    <Pill
                      variant="green"
                      style={{ fontSize: 13, padding: '8px 18px' }}
                    >
                      Take it →
                    </Pill>
                  </div>
                </div>
              </div>
            </div>

            {/* Hero AnnoBar */}
            <AnnoBar
              dark
              num="01"
              items={[
                {
                  t: 'Floor plan',
                  d: 'Top-down blueprint with rooms + corridor + door gaps. Animated dashed lines = task flow.',
                },
                {
                  t: 'Rooms',
                  d: '5 named zones. Each shows live status pill + avatars. Click → join / book.',
                },
                {
                  t: 'Stat strip',
                  d: '3 cards bolted to bottom of hero — projects · presence · next slot. Booking lives here too.',
                },
              ]}
            />

            {/* LIVE OPS + ACTIVITY FEED */}
            <div id="liveops" className={styles['section']}>
              <div className={styles['section-inner']}>
                <div className={styles['sec-head']}>
                  <div>
                    <Cap>02 — Live Operations</Cap>
                    <h2>Two windows into the floor.</h2>
                  </div>
                  <div className={styles['sec-side']}>
                    Two persistent cards that live just below the office.
                    Public metrics on the left. The activity stream on the
                    right.
                  </div>
                </div>

                <div className={styles['g2']}>
                  {/* Live Ops Card */}
                  <div
                    className={styles['sk-box']}
                    style={{ padding: 22 }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: 12,
                      }}
                    >
                      <div
                        className={styles['sk-h']}
                        style={{ fontSize: 26 }}
                      >
                        Live Operations
                      </div>
                      <Pill
                        variant="green"
                        style={{ fontSize: 10, padding: '2px 10px' }}
                      >
                        ● LIVE
                      </Pill>
                    </div>
                    <Cap>Real-time public metrics</Cap>
                    <div className={styles['g2']} style={{ marginTop: 14 }}>
                      <div
                        className={styles['sk-box']}
                        style={{
                          padding: 14,
                          background: 'rgba(165,214,167,0.18)',
                          borderColor: 'var(--accent-strong)',
                        }}
                      >
                        <div
                          style={{
                            fontFamily: 'Caveat',
                            fontSize: 42,
                            fontWeight: 700,
                            lineHeight: 0.9,
                          }}
                        >
                          7
                        </div>
                        <Cap style={{ marginTop: 4 }}>
                          ● Active projects
                        </Cap>
                      </div>
                      <div
                        className={styles['sk-box']}
                        style={{
                          padding: 14,
                          background: '#f6f3ea',
                        }}
                      >
                        <div
                          style={{
                            fontFamily: 'Caveat',
                            fontSize: 42,
                            fontWeight: 700,
                            lineHeight: 0.9,
                          }}
                        >
                          247
                        </div>
                        <Cap style={{ marginTop: 4 }}>✓ Completed</Cap>
                      </div>
                    </div>
                    <div
                      style={{
                        marginTop: 14,
                        paddingTop: 12,
                        borderTop: '1.5px dashed var(--ink)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 7,
                      }}
                    >
                      {[
                        ['Autonomous Agents', '4 Online'],
                        ['Human Supervisors', '1 Present'],
                        ['Avg. response time', '< 90s'],
                        ['Slot availability', 'Today 14:00'],
                      ].map(([k, v]) => (
                        <div
                          key={k}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            fontFamily: 'Kalam',
                            fontSize: 13,
                          }}
                        >
                          <span style={{ color: 'var(--ink-2)' }}>
                            {k}
                          </span>
                          <span style={{ fontWeight: 700 }}>{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Activity Feed */}
                  <div
                    className={styles['sk-box']}
                    style={{ padding: 22 }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: 12,
                      }}
                    >
                      <div
                        className={styles['sk-h']}
                        style={{ fontSize: 26 }}
                      >
                        Agent Activity Feed
                      </div>
                      <Pill style={{ fontSize: 10, padding: '2px 10px' }}>
                        last 24h
                      </Pill>
                    </div>
                    <Cap>Stream of what agents did, hour-by-hour</Cap>
                    <div
                      style={{
                        marginTop: 14,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 11,
                      }}
                    >
                      {[
                        {
                          dot: 'green',
                          t: 'just now',
                          e: 'San approved Tensei manifest v2.4',
                        },
                        {
                          dot: 'blue',
                          t: '3m ago',
                          e: 'Titan routed Trust One outreach batch (52 leads)',
                        },
                        {
                          dot: 'amber',
                          t: '18m ago',
                          e: 'Design Agent finalized Studio White tokens',
                        },
                        {
                          dot: 'blue',
                          t: '1h ago',
                          e: 'Client discovery confirmed for 14:00 EST',
                        },
                        {
                          dot: 'green',
                          t: '2h ago',
                          e: 'Guardian patched Galaxy webhook timeout',
                        },
                        {
                          dot: 'amber',
                          t: '4h ago',
                          e: 'Prometheus shipped Engine Room v0.9.1',
                        },
                      ].map((it, i) => (
                        <div
                          key={i}
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: 11,
                          }}
                        >
                          <span
                            className={cx(
                              styles['ldot'],
                              it.dot !== 'green' &&
                                styles[it.dot as keyof typeof styles]
                            )}
                            style={{
                              marginTop: 7,
                              flexShrink: 0,
                            }}
                          />
                          <div style={{ flex: 1 }}>
                            <div
                              style={{
                                fontFamily: 'Kalam',
                                fontSize: 14,
                                lineHeight: 1.4,
                              }}
                            >
                              {it.e}
                            </div>
                            <div
                              style={{
                                fontFamily: 'DM Mono',
                                fontSize: 10,
                                color: 'var(--ink-3)',
                                marginTop: 1,
                              }}
                            >
                              {it.t}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <AnnoBar
                num="02"
                items={[
                  {
                    t: 'What it is',
                    d: 'Two cards underneath the office, persistent. Public, anonymized.',
                  },
                  {
                    t: 'Why',
                    d: 'Visitors see proof of life — the agency is real, work is happening now.',
                  },
                  {
                    t: 'Build note',
                    d: 'Cards stack on mobile. Feed truncates after 6 items + "view all".',
                  },
                ]}
              />
            </div>

            {/* SERVICES — BENTO */}
            <div
              id="services"
              className={cx(styles['section'], styles['paper'])}
            >
              <div className={styles['section-inner']}>
                <div className={styles['sec-head']}>
                  <div>
                    <Cap>03 — Services</Cap>
                    <h2>What we run for you.</h2>
                  </div>
                  <div className={styles['sec-side']}>
                    Pulled from Verbaflow LLC offerings. Bento layout — one
                    anchor card, satellites around.
                  </div>
                </div>

                <div className={styles['bento']}>
                  {/* Anchor: Chatbot */}
                  <div
                    className={cx(
                      styles['b-card'],
                      styles['tall'],
                      styles['green']
                    )}
                  >
                    <div>
                      <Pill
                        variant="solid-dark"
                        style={{ fontSize: 10, padding: '2px 10px' }}
                      >
                        ★ Most popular
                      </Pill>
                      <div
                        className={styles['sk-h']}
                        style={{
                          fontSize: 42,
                          marginTop: 14,
                          lineHeight: 1.0,
                        }}
                      >
                        AI Chatbot Integration
                      </div>
                      <p
                        style={{
                          fontFamily: 'Kalam',
                          fontSize: 14,
                          color: 'var(--ink-2)',
                          marginTop: 10,
                          lineHeight: 1.55,
                          maxWidth: 300,
                        }}
                      >
                        Deploy intelligent chatbots that qualify leads,
                        answer FAQs, and book appointments — 24/7, without
                        human intervention.
                      </p>
                    </div>
                    {/* Sketchy chatbot bubble preview */}
                    <div
                      style={{
                        marginTop: 18,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 8,
                      }}
                    >
                      <div
                        style={{
                          alignSelf: 'flex-start',
                          background: '#fff',
                          border: '1.5px solid var(--ink)',
                          borderRadius: 14,
                          padding: '8px 12px',
                          fontFamily: 'Kalam',
                          fontSize: 12,
                          maxWidth: '80%',
                        }}
                      >
                        &ldquo;I&apos;d like a free audit&rdquo;
                      </div>
                      <div
                        style={{
                          alignSelf: 'flex-end',
                          background: 'var(--ink)',
                          color: '#fff',
                          borderRadius: 14,
                          padding: '8px 12px',
                          fontFamily: 'Kalam',
                          fontSize: 12,
                          maxWidth: '80%',
                        }}
                      >
                        Got it — you&apos;ll hear from San at 14:00 EST. ✓
                      </div>
                    </div>
                  </div>

                  <div className={styles['b-card']}>
                    <div>
                      <Cap>Outreach</Cap>
                      <div
                        className={styles['sk-h']}
                        style={{ fontSize: 24, marginTop: 6 }}
                      >
                        Lead Engine
                      </div>
                      <p
                        style={{
                          fontFamily: 'Kalam',
                          fontSize: 13,
                          color: 'var(--ink-2)',
                          marginTop: 6,
                          lineHeight: 1.5,
                        }}
                      >
                        Cold-to-warm pipeline run by Titan + n8n.
                      </p>
                    </div>
                    <Pill
                      style={{
                        fontSize: 11,
                        alignSelf: 'flex-start',
                        marginTop: 12,
                      }}
                    >
                      1.2k routed today
                    </Pill>
                  </div>

                  <div
                    className={cx(styles['b-card'], styles['dark'])}
                  >
                    <div>
                      <Cap dark>Insight</Cap>
                      <div
                        className={styles['sk-h']}
                        style={{
                          fontSize: 24,
                          marginTop: 6,
                          color: '#fff',
                        }}
                      >
                        Predictive Reports
                      </div>
                      <p
                        style={{
                          fontFamily: 'Kalam',
                          fontSize: 13,
                          color: 'rgba(255,255,255,0.65)',
                          marginTop: 6,
                          lineHeight: 1.5,
                        }}
                      >
                        LLM dashboards that translate raw data → actions.
                      </p>
                    </div>
                    {/* Mini sparkline */}
                    <svg
                      width="100%"
                      height="48"
                      viewBox="0 0 200 48"
                      style={{ marginTop: 10 }}
                    >
                      <polyline
                        points="0,38 30,30 60,32 90,18 120,22 150,10 180,14 200,4"
                        fill="none"
                        stroke="#A5D6A7"
                        strokeWidth="2"
                      />
                      <polyline
                        points="0,38 30,30 60,32 90,18 120,22 150,10 180,14 200,4 200,48 0,48"
                        fill="rgba(165,214,167,0.15)"
                        stroke="none"
                      />
                    </svg>
                  </div>

                  <div className={styles['b-card']}>
                    <div>
                      <Cap>Studio</Cap>
                      <div
                        className={styles['sk-h']}
                        style={{ fontSize: 24, marginTop: 6 }}
                      >
                        Design Sprint
                      </div>
                      <p
                        style={{
                          fontFamily: 'Kalam',
                          fontSize: 13,
                          color: 'var(--ink-2)',
                          marginTop: 6,
                          lineHeight: 1.5,
                        }}
                      >
                        Spec → ship in 2 weeks.
                      </p>
                    </div>
                  </div>

                  <div className={styles['b-card']}>
                    <div>
                      <Cap>Reliability</Cap>
                      <div
                        className={styles['sk-h']}
                        style={{ fontSize: 24, marginTop: 6 }}
                      >
                        Guardian Watch
                      </div>
                      <p
                        style={{
                          fontFamily: 'Kalam',
                          fontSize: 13,
                          color: 'var(--ink-2)',
                          marginTop: 6,
                          lineHeight: 1.5,
                        }}
                      >
                        Always-on uptime + auto-patching.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <AnnoBar
                num="03"
                items={[
                  {
                    t: 'Layout',
                    d: 'Anchor card (3 col span x 2 rows) + 4 satellites. Bento, like Huly.',
                  },
                  {
                    t: 'Hover',
                    d: 'Card lifts 4px, accent border, shadow grows.',
                  },
                  {
                    t: 'Mobile',
                    d: 'Stacks 1-col; anchor stays first.',
                  },
                ]}
              />
            </div>

            {/* AGENTS ROSTER + PROFILE DRAWER MOCK */}
            <div
              id="agents"
              className={cx(styles['section'], styles['dark'])}
            >
              <div className={styles['section-inner']}>
                <div className={styles['sec-head']}>
                  <div>
                    <Cap dark>04 — The Roster</Cap>
                    <h2 style={{ color: '#fff' }}>
                      Meet the agents running your account.
                    </h2>
                  </div>
                  <div className={styles['sec-side']}>
                    Click an avatar → profile drawer opens. From there: book
                    a call, send a message, see live log.
                  </div>
                </div>

                {/* Roster cards (4) */}
                <div className={styles['g4']} style={{ marginBottom: 24 }}>
                  {[
                    {
                      n: 'San',
                      r: 'Supervisor (Human)',
                      s: 'Live · in Command Center',
                      c: 'green',
                      i: 'S',
                      online: 'live',
                    },
                    {
                      n: 'Titan',
                      r: 'Outreach AI',
                      s: 'Running batch · 1.2k',
                      c: 'note',
                      i: 'T',
                      online: 'live',
                    },
                    {
                      n: 'Guardian',
                      r: 'Reliability AI',
                      s: 'Idle · last fix 12m ago',
                      c: 'blue',
                      i: 'G',
                      online: 'off',
                    },
                    {
                      n: 'Prometheus',
                      r: 'Engine Room AI',
                      s: 'Building Galaxy QA · busy',
                      c: 'amber',
                      i: 'P',
                      online: 'busy',
                    },
                  ].map((a) => (
                    <div
                      key={a.n}
                      className={cx(styles['sk-box'], styles['dark'])}
                      style={{ padding: 18, position: 'relative' }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 12,
                          marginBottom: 12,
                        }}
                      >
                        <Pawn
                          color={a.c}
                          size={48}
                          dark
                          status={
                            a.online === 'live' ? '' : a.online
                          }
                        />
                        <div>
                          <div
                            style={{
                              fontFamily: 'Caveat',
                              fontSize: 26,
                              fontWeight: 700,
                              lineHeight: 1,
                              color: '#fff',
                            }}
                          >
                            {a.n}
                          </div>
                          <div
                            style={{
                              fontFamily: 'Kalam',
                              fontSize: 11,
                              color: 'rgba(255,255,255,0.55)',
                            }}
                          >
                            {a.r}
                          </div>
                        </div>
                      </div>
                      <div
                        style={{
                          fontFamily: 'Kalam',
                          fontSize: 12,
                          color: 'rgba(255,255,255,0.7)',
                          lineHeight: 1.4,
                          marginBottom: 12,
                        }}
                      >
                        {a.s}
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          gap: 6,
                          flexWrap: 'wrap',
                        }}
                      >
                        <Pill
                          variant="dark"
                          style={{ fontSize: 10, padding: '2px 10px' }}
                        >
                          Profile
                        </Pill>
                        <Pill
                          variant="green"
                          style={{ fontSize: 10, padding: '2px 10px' }}
                        >
                          Book →
                        </Pill>
                        <Pill
                          variant="dark"
                          style={{ fontSize: 10, padding: '2px 10px' }}
                        >
                          Message
                        </Pill>
                      </div>
                    </div>
                  ))}
                </div>

                {/* PROFILE DRAWER MOCK */}
                <div style={{ marginTop: 24 }}>
                  <Cap dark>Profile drawer · clicked San</Cap>
                  <div
                    className={styles['drawer-mock']}
                    style={{
                      marginTop: 8,
                      background: 'rgba(255,255,255,0.04)',
                      borderColor: 'var(--dark-border)',
                    }}
                  >
                    <div
                      className={styles['drawer-bg']}
                      style={{ opacity: 0.5 }}
                    />
                    {/* Faded floor underneath */}
                    <div
                      style={{
                        position: 'relative',
                        padding: 20,
                        color: 'rgba(255,255,255,0.4)',
                        fontFamily: 'Kalam',
                        fontSize: 13,
                      }}
                    >
                      <span>
                        ← agency floor (dimmed when drawer open)
                      </span>
                    </div>
                    {/* The drawer itself */}
                    <div
                      className={styles['drawer-side']}
                      style={{
                        background: 'var(--dark-surface)',
                        borderLeftColor: 'var(--dark-border)',
                        color: '#fff',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            gap: 12,
                            alignItems: 'center',
                          }}
                        >
                          <Pawn
                            color="green"
                            size={56}
                            dark
                            status=""
                          />
                          <div>
                            <div
                              style={{
                                fontFamily: 'Caveat',
                                fontSize: 32,
                                fontWeight: 700,
                                color: '#fff',
                                lineHeight: 1,
                              }}
                            >
                              San
                            </div>
                            <div
                              style={{
                                fontFamily: 'Kalam',
                                fontSize: 12,
                                color: 'rgba(255,255,255,0.6)',
                              }}
                            >
                              Founder + Supervisor · Human · NYC
                            </div>
                          </div>
                        </div>
                        <Pill
                          variant="dark"
                          style={{ fontSize: 11, padding: '2px 10px' }}
                        >
                          ✕
                        </Pill>
                      </div>

                      {/* Status row */}
                      <div
                        style={{
                          display: 'flex',
                          gap: 8,
                          marginTop: 14,
                          flexWrap: 'wrap',
                        }}
                      >
                        <Pill
                          variant="green"
                          style={{ fontSize: 10, padding: '2px 10px' }}
                        >
                          ● Available now
                        </Pill>
                        <Pill
                          variant="dark"
                          style={{ fontSize: 10, padding: '2px 10px' }}
                        >
                          Next free: 14:00 EST
                        </Pill>
                      </div>

                      {/* Three actions */}
                      <div
                        className={styles['g3']}
                        style={{ marginTop: 18, gap: 8 }}
                      >
                        <div
                          className={styles['sk-box']}
                          style={{
                            padding: '10px 8px',
                            textAlign: 'center',
                            background: 'var(--accent)',
                            borderColor: 'var(--accent)',
                            color: '#000',
                          }}
                        >
                          <div
                            style={{
                              fontFamily: 'Caveat',
                              fontSize: 18,
                              fontWeight: 700,
                              lineHeight: 1,
                            }}
                          >
                            📞 Book
                          </div>
                          <div
                            style={{
                              fontFamily: 'Kalam',
                              fontSize: 10,
                            }}
                          >
                            15m · 30m · 1h
                          </div>
                        </div>
                        <div
                          className={styles['sk-box']}
                          style={{
                            padding: '10px 8px',
                            textAlign: 'center',
                            background: 'rgba(255,255,255,0.05)',
                            borderColor: 'var(--dark-border)',
                            color: '#fff',
                          }}
                        >
                          <div
                            style={{
                              fontFamily: 'Caveat',
                              fontSize: 18,
                              fontWeight: 700,
                              lineHeight: 1,
                            }}
                          >
                            💬 Message
                          </div>
                          <div
                            style={{
                              fontFamily: 'Kalam',
                              fontSize: 10,
                              color: 'rgba(255,255,255,0.5)',
                            }}
                          >
                            async, &lt; 4h
                          </div>
                        </div>
                        <div
                          className={styles['sk-box']}
                          style={{
                            padding: '10px 8px',
                            textAlign: 'center',
                            background: 'rgba(255,255,255,0.05)',
                            borderColor: 'var(--dark-border)',
                            color: '#fff',
                          }}
                        >
                          <div
                            style={{
                              fontFamily: 'Caveat',
                              fontSize: 18,
                              fontWeight: 700,
                              lineHeight: 1,
                            }}
                          >
                            📊 Activity
                          </div>
                          <div
                            style={{
                              fontFamily: 'Kalam',
                              fontSize: 10,
                              color: 'rgba(255,255,255,0.5)',
                            }}
                          >
                            last 7 days
                          </div>
                        </div>
                      </div>

                      {/* Mini activity preview */}
                      <div
                        style={{
                          marginTop: 18,
                          paddingTop: 14,
                          borderTop: '1px solid var(--dark-border)',
                        }}
                      >
                        <Cap dark>Recent activity</Cap>
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 8,
                            marginTop: 8,
                          }}
                        >
                          <div
                            style={{
                              fontFamily: 'Kalam',
                              fontSize: 12,
                              color: 'rgba(255,255,255,0.85)',
                            }}
                          >
                            <span
                              className={styles['ldot']}
                              style={{ marginRight: 6 }}
                            />
                            Approved Tensei manifest v2.4
                            <span
                              style={{
                                fontFamily: 'DM Mono',
                                fontSize: 10,
                                color: 'rgba(255,255,255,0.45)',
                                marginLeft: 8,
                              }}
                            >
                              now
                            </span>
                          </div>
                          <div
                            style={{
                              fontFamily: 'Kalam',
                              fontSize: 12,
                              color: 'rgba(255,255,255,0.85)',
                            }}
                          >
                            <span
                              className={cx(
                                styles['ldot'],
                                styles['blue']
                              )}
                              style={{ marginRight: 6 }}
                            />
                            Confirmed Trust One discovery
                            <span
                              style={{
                                fontFamily: 'DM Mono',
                                fontSize: 10,
                                color: 'rgba(255,255,255,0.45)',
                                marginLeft: 8,
                              }}
                            >
                              1h
                            </span>
                          </div>
                          <div
                            style={{
                              fontFamily: 'Kalam',
                              fontSize: 12,
                              color: 'rgba(255,255,255,0.85)',
                            }}
                          >
                            <span
                              className={cx(
                                styles['ldot'],
                                styles['amber']
                              )}
                              style={{ marginRight: 6 }}
                            />
                            Reviewed Engine Room v0.9.1
                            <span
                              style={{
                                fontFamily: 'DM Mono',
                                fontSize: 10,
                                color: 'rgba(255,255,255,0.45)',
                                marginLeft: 8,
                              }}
                            >
                              3h
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Booking row preview */}
                      <div
                        style={{
                          marginTop: 18,
                          paddingTop: 14,
                          borderTop: '1px solid var(--dark-border)',
                        }}
                      >
                        <Cap dark>Pick a slot</Cap>
                        <div
                          style={{
                            display: 'flex',
                            gap: 6,
                            marginTop: 8,
                            flexWrap: 'wrap',
                          }}
                        >
                          {[
                            'Today 14:00',
                            'Today 15:30',
                            'Tom 10:00',
                            'Tom 11:30',
                            'Tom 14:00',
                          ].map((s) => (
                            <Pill
                              key={s}
                              variant="dark"
                              style={{
                                fontSize: 11,
                                padding: '4px 12px',
                              }}
                            >
                              {s}
                            </Pill>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <AnnoBar
                dark
                num="04"
                items={[
                  {
                    t: 'Roster',
                    d: '4 cards: 1 human (San), 3 AI (Titan, Guardian, Prometheus). Status dot on every avatar.',
                  },
                  {
                    t: 'Drawer',
                    d: 'Right-side slide-in. Floor stays visible, dimmed. Esc / X to close.',
                  },
                  {
                    t: 'Actions',
                    d: 'Book / Message / Activity — three CTAs. Slot pills are clickable inside drawer.',
                  },
                ]}
              />
            </div>

            {/* HOW IT WORKS */}
            <div
              id="how"
              className={cx(styles['section'], styles['paper'])}
            >
              <div className={styles['section-inner']}>
                <div className={styles['sec-head']}>
                  <div>
                    <Cap>05 — How it works</Cap>
                    <h2>
                      From &ldquo;hello&rdquo; to live ops in 4 steps.
                    </h2>
                  </div>
                  <div className={styles['sec-side']}>
                    Linked steps — dotted line connects them, like a
                    floor-plan corridor.
                  </div>
                </div>

                <div className={styles['steps']}>
                  {[
                    {
                      n: '01',
                      t: 'Discovery call',
                      d: '15-minute audit. Free. We listen first, talk second.',
                      f: false,
                    },
                    {
                      n: '02',
                      t: 'Plan & quote',
                      d: 'Bespoke roadmap within 48h. Fixed scope, fixed price.',
                      f: true,
                    },
                    {
                      n: '03',
                      t: 'Build & supervise',
                      d: 'Agents deploy. San watches. Slack channel opens.',
                      f: false,
                    },
                    {
                      n: '04',
                      t: 'See it live',
                      d: 'Right here on the agency floor. Forever.',
                      f: false,
                    },
                  ].map((s) => (
                    <div key={s.n} className={styles['step']}>
                      <div
                        className={cx(
                          styles['step-bubble'],
                          s.f && styles['featured']
                        )}
                      >
                        {s.n}
                      </div>
                      <div
                        className={styles['sk-h']}
                        style={{ fontSize: 24, lineHeight: 1.05 }}
                      >
                        {s.t}
                      </div>
                      <p
                        style={{
                          fontFamily: 'Kalam',
                          fontSize: 13,
                          color: 'var(--ink-2)',
                          marginTop: 8,
                          lineHeight: 1.55,
                        }}
                      >
                        {s.d}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <AnnoBar
                num="05"
                items={[
                  {
                    t: 'Visual',
                    d: 'Steps connected by a dotted line — picks up the blueprint metaphor.',
                  },
                  {
                    t: 'Step 02',
                    d: 'Featured (dark bubble) = the moment you commit. Friction kept low.',
                  },
                  {
                    t: 'Mobile',
                    d: 'Stacks vertically; line becomes a vertical dotted spine.',
                  },
                ]}
              />
            </div>

            {/* PRICING */}
            <div
              id="pricing"
              className={cx(styles['section'], styles['cream'])}
            >
              <div className={styles['section-inner']}>
                <div className={styles['sec-head']}>
                  <div>
                    <Cap>06 — Membership</Cap>
                    <h2>Pick a tier. Get to work.</h2>
                  </div>
                  <div className={styles['sec-side']}>
                    Same names as your existing tiers. Featured tier scaled
                    up + pinned ribbon.
                  </div>
                </div>

                <div
                  className={styles['g3']}
                  style={{ alignItems: 'stretch' }}
                >
                  {[
                    {
                      n: 'Coupe',
                      p: '$49',
                      d: 'Essential website + presence for new businesses.',
                      f: [
                        'Custom site dev',
                        'Landing page opt.',
                        'Google Business profile',
                        '1 monthly check-in',
                      ],
                    },
                    {
                      n: 'Muscle',
                      p: '$99',
                      d: 'Marketing + automation for growing teams.',
                      f: [
                        'Social campaigns',
                        'Auto lead response',
                        'Google Ads + SEO',
                        'Analytics + reports',
                        'Slack channel',
                      ],
                      featured: true,
                    },
                    {
                      n: 'Grand Tourer',
                      p: '$199',
                      d: 'Full AI + compliance for scaling ops.',
                      f: [
                        'Everything in Muscle',
                        '4 AI agents on call',
                        'Compliance audits',
                        'Dedicated supervisor',
                        'Custom integrations',
                      ],
                    },
                  ].map((p) => (
                    <div
                      key={p.n}
                      className={cx(
                        styles['pcard'],
                        p.featured && styles['featured']
                      )}
                    >
                      {p.featured && (
                        <div className={styles['pmost']}>
                          most picked
                        </div>
                      )}
                      <div
                        className={styles['sk-h']}
                        style={{ fontSize: 28 }}
                      >
                        {p.n}
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'baseline',
                          gap: 4,
                          marginTop: 4,
                        }}
                      >
                        <span
                          style={{
                            fontFamily: 'Caveat',
                            fontSize: 48,
                            fontWeight: 700,
                            lineHeight: 0.9,
                          }}
                        >
                          {p.p}
                        </span>
                        <span
                          style={{
                            fontFamily: 'Kalam',
                            fontSize: 14,
                            color: 'var(--ink-3)',
                          }}
                        >
                          /mo
                        </span>
                      </div>
                      <p
                        style={{
                          fontFamily: 'Kalam',
                          fontSize: 13,
                          color: 'var(--ink-2)',
                          margin: '10px 0 14px',
                          lineHeight: 1.5,
                        }}
                      >
                        {p.d}
                      </p>
                      <ul
                        style={{
                          listStyle: 'none',
                          padding: 0,
                          margin: 0,
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 7,
                        }}
                      >
                        {p.f.map((item) => (
                          <li
                            key={item}
                            style={{
                              fontFamily: 'Kalam',
                              fontSize: 13,
                              display: 'flex',
                              gap: 8,
                              alignItems: 'flex-start',
                            }}
                          >
                            <span
                              style={{
                                color: 'var(--accent-strong)',
                                fontWeight: 700,
                                flexShrink: 0,
                              }}
                            >
                              ✓
                            </span>
                            {item}
                          </li>
                        ))}
                      </ul>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          marginTop: 18,
                        }}
                      >
                        <Pill
                          variant={p.featured ? 'green' : ''}
                          style={{
                            fontSize: 13,
                            fontWeight: 700,
                            padding: '8px 18px',
                            width: '100%',
                            justifyContent: 'center',
                          }}
                        >
                          Choose {p.n} →
                        </Pill>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <AnnoBar
                num="06"
                items={[
                  {
                    t: 'Tier names',
                    d: 'Coupe / Muscle / Grand Tourer — kept your existing taxonomy.',
                  },
                  {
                    t: 'Featured',
                    d: 'Muscle is highlighted with green tint + ribbon + lift.',
                  },
                  {
                    t: 'Future',
                    d: 'Add usage meter (e.g. agent-hours) underneath each tier.',
                  },
                ]}
              />
            </div>

            {/* CTA */}
            <div id="cta" className={styles['cta']}>
              <div
                className={styles['glow-blob']}
                style={{
                  top: '-30%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 600,
                  height: 600,
                  background: 'rgba(165,214,167,0.18)',
                }}
              />
              <div style={{ position: 'relative', zIndex: 2 }}>
                <Cap dark green>
                  ● Ready when you are
                </Cap>
                <h2
                  className={styles['sk-h']}
                  style={{
                    fontSize: 68,
                    color: '#fff',
                    marginTop: 8,
                    lineHeight: 0.98,
                  }}
                >
                  Ready to walk
                  <br />
                  the floor?
                </h2>
                <p
                  style={{
                    fontFamily: 'Kalam',
                    fontSize: 17,
                    color: 'rgba(255,255,255,0.7)',
                    maxWidth: 520,
                    margin: '18px auto 26px',
                    lineHeight: 1.6,
                  }}
                >
                  Book a 15-minute discovery call. We&apos;ll show you your
                  future agency floor — populated with agents already
                  running for clients like you.
                </p>
                <div
                  style={{
                    display: 'flex',
                    gap: 12,
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                  }}
                >
                  <Pill
                    variant="green"
                    style={{
                      fontSize: 15,
                      padding: '10px 26px',
                      fontWeight: 700,
                    }}
                  >
                    Book a Session →
                  </Pill>
                  <Pill
                    variant="dark"
                    style={{
                      fontSize: 15,
                      padding: '10px 26px',
                      color: '#fff',
                    }}
                  >
                    See pricing
                  </Pill>
                </div>
                <div
                  style={{
                    marginTop: 24,
                    fontFamily: 'DM Mono',
                    fontSize: 11,
                    color: 'rgba(255,255,255,0.4)',
                  }}
                >
                  verbaflowllc.com/agency · est. 2024
                </div>
              </div>
            </div>
          </div>

          <div className={styles['footer']}>
            Round 2 · Direction B + D · Ready for sign-off → hi-fi
          </div>
        </div>
      </div>
    </>
  );
}
