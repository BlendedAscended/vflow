'use client';

import styles from './styles.module.css';

/* NOTE: CSS custom properties (--ink, --paper, --accent, etc.) are expected
   to be defined in globals.css or a parent layout. The :root block from the
   original wireframe has been removed per porting instructions. */

/* ── Google Fonts ── */
const GoogleFonts = () => (
  <>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
    <link
      href="https://fonts.googleapis.com/css2?family=Caveat:wght@400;500;600;700&family=Kalam:wght@300;400;700&family=Architects+Daughter&family=DM+Sans:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap"
      rel="stylesheet"
    />
  </>
);

/* ── Primitives ── */

function Cap({
  children,
  dark,
  green,
  style,
}: {
  children: React.ReactNode;
  dark?: boolean;
  green?: boolean;
  style?: React.CSSProperties;
}) {
  const cls = [styles['sk-cap'], dark ? styles.dark : '', green ? styles.green : '']
    .filter(Boolean)
    .join(' ');
  return (
    <div className={cls} style={style}>
      {children}
    </div>
  );
}

function Pawn({
  color = '',
  size = 36,
  status,
  dark,
}: {
  color?: string;
  size?: number;
  status?: string;
  dark?: boolean;
}) {
  const cls = [styles.pawn, dark ? styles.dark : '', color ? styles[color] : '']
    .filter(Boolean)
    .join(' ');
  return (
    <div className={cls} style={{ width: size, height: size }}>
      {status && (
        <span
          className={`${styles['status-dot']} ${status ? styles[status] : ''}`}
          style={{ width: size * 0.3, height: size * 0.3 }}
        />
      )}
    </div>
  );
}

function Pill({
  children,
  variant = '',
  style,
}: {
  children: React.ReactNode;
  variant?: string;
  style?: React.CSSProperties;
}) {
  const cls = [styles['sk-pill'], variant ? styles[variant] : ''].filter(Boolean).join(' ');
  return (
    <span className={cls} style={style}>
      {children}
    </span>
  );
}

/* ── Pixel Scene Helpers ── */

function PixScene({ type }: { type: string }) {
  const scenes: Record<string, React.ReactNode> = {
    conf: (
      <svg
        viewBox="0 0 100 60"
        preserveAspectRatio="none"
        style={{ width: '100%', height: '100%', imageRendering: 'pixelated' }}
      >
        <rect width="100" height="60" fill="#2a4a6f" />
        <rect x="20" y="22" width="60" height="20" fill="#5a3826" />
        <rect x="20" y="22" width="60" height="3" fill="#7a5036" />
        {[28, 40, 52, 64, 72].map((x, i) => (
          <rect key={i} x={x} y="14" width="6" height="10" fill="#c9a572" />
        ))}
        {[28, 40, 52, 64, 72].map((x, i) => (
          <rect key={i} x={x + 1} y="6" width="4" height="8" fill="#5a3a28" stroke="#000" strokeWidth="0.5" />
        ))}
        <rect x="62" y="10" width="14" height="9" fill="#1a1a1a" stroke="#444" strokeWidth="0.5" />
        <circle cx="69" cy="14.5" r="1" fill="#22c55e" />
        <rect x="6" y="10" width="6" height="40" fill="#1a3a5a" />
      </svg>
    ),
    studio: (
      <svg
        viewBox="0 0 100 60"
        preserveAspectRatio="none"
        style={{ width: '100%', height: '100%', imageRendering: 'pixelated' }}
      >
        <rect width="100" height="60" fill="#3a2a4f" />
        <rect x="6" y="10" width="40" height="22" fill="#1a1a2a" stroke="#555" strokeWidth="0.5" />
        <rect x="8" y="12" width="36" height="18" fill="#fbbf24" opacity="0.4" />
        {[10, 18, 26, 34].map((x, i) => (
          <rect
            key={i}
            x={x}
            y="14"
            width="6"
            height="14"
            fill={['#ef4444', '#22c55e', '#3b82f6', '#fbbf24'][i]}
          />
        ))}
        <rect x="50" y="38" width="44" height="18" fill="#5a3826" />
        <circle cx="62" cy="32" r="5" fill="#f4c2a1" />
        <rect x="58" y="36" width="8" height="12" fill="#3b82f6" />
      </svg>
    ),
    engine: (
      <svg
        viewBox="0 0 100 60"
        preserveAspectRatio="none"
        style={{ width: '100%', height: '100%', imageRendering: 'pixelated' }}
      >
        <rect width="100" height="60" fill="#0a2540" />
        {[10, 28, 46, 64, 82].map((x, i) => (
          <g key={i}>
            <rect x={x} y="8" width="10" height="44" fill="#1a1a2a" stroke="#22d3a9" strokeWidth="0.5" />
            {[0, 1, 2, 3, 4, 5, 6].map((r) => (
              <rect key={r} x={x + 1} y={10 + r * 5} width="8" height="3" fill={r % 2 ? '#22c55e' : '#0a4a3a'} />
            ))}
          </g>
        ))}
      </svg>
    ),
    cmd: (
      <svg
        viewBox="0 0 100 60"
        preserveAspectRatio="none"
        style={{ width: '100%', height: '100%', imageRendering: 'pixelated' }}
      >
        <rect width="100" height="60" fill="#1a3a4a" />
        <rect x="20" y="20" width="60" height="22" fill="#5a3826" />
        <rect x="22" y="14" width="14" height="10" fill="#000" />
        <rect x="38" y="14" width="14" height="10" fill="#000" />
        <rect x="54" y="14" width="14" height="10" fill="#000" />
        <rect x="22" y="15" width="14" height="6" fill="#22c55e" opacity="0.5" />
        <rect x="38" y="15" width="14" height="6" fill="#3b82f6" opacity="0.5" />
        <rect x="54" y="15" width="14" height="6" fill="#fbbf24" opacity="0.5" />
        <circle cx="48" cy="36" r="4" fill="#f4c2a1" />
        <rect x="44" y="40" width="8" height="10" fill="#22c55e" />
      </svg>
    ),
    board: (
      <svg
        viewBox="0 0 100 60"
        preserveAspectRatio="none"
        style={{ width: '100%', height: '100%', imageRendering: 'pixelated' }}
      >
        <rect width="100" height="60" fill="#2a3a4f" />
        <rect x="14" y="20" width="72" height="18" fill="#5a3826" />
        <rect x="14" y="20" width="72" height="3" fill="#7a5036" />
        <rect x="40" y="8" width="20" height="12" fill="#fbbf24" opacity="0.6" stroke="#fbbf24" strokeWidth="0.5" />
        <text x="50" y="16" fontFamily="DM Mono" fontSize="6" fill="#000" textAnchor="middle">
          14:00
        </text>
      </svg>
    ),
    kitchen: (
      <svg
        viewBox="0 0 100 60"
        preserveAspectRatio="none"
        style={{ width: '100%', height: '100%', imageRendering: 'pixelated' }}
      >
        <rect width="100" height="60" fill="#3a4a3a" />
        <rect x="8" y="20" width="20" height="34" fill="#d1d5db" />
        <rect x="10" y="24" width="16" height="12" fill="#9ca3af" />
        <rect x="32" y="34" width="60" height="20" fill="#5a3826" />
        <circle cx="44" cy="42" r="3" fill="#1a1a1a" />
        <circle cx="60" cy="42" r="3" fill="#1a1a1a" />
        <circle cx="76" cy="42" r="3" fill="#1a1a1a" />
      </svg>
    ),
  };
  return <>{scenes[type] || scenes.conf}</>;
}

/* ── Anno Bar ── */

function AnnoBar({
  dark,
  num,
  items,
}: {
  dark?: boolean;
  num: string;
  items: { t: string; d: string }[];
}) {
  const cls = [styles['anno-bar'], dark ? styles.dark : ''].filter(Boolean).join(' ');
  return (
    <div className={cls}>
      <div className={styles['anno-num']}>{num}</div>
      {items.map((it, i) => (
        <div key={i}>
          <b>{it.t}</b>
          {it.d}
        </div>
      ))}
    </div>
  );
}

/* ── Hero Floor ── */

function HeroFloor() {
  const world = 'blueprint';
  const timeOfDay = 'morning';
  const occupancy = 'standard';

  return (
    <div
      id="hero"
      className={`${styles['floor-stage']} ${styles[`world-${world}`]} ${styles[`tod-${timeOfDay}`]} ${styles[`occ-${occupancy}`]}`}
    >
      {/* Circuit traces */}
      <svg
        className={styles['circuit-trace']}
        style={{ top: 0, left: 0, width: '100%', height: '100%' }}
        viewBox="0 0 1280 820"
        preserveAspectRatio="none"
      >
        <path
          d="M 0 60 L 200 60 L 220 80 L 360 80 M 920 80 L 1080 80 L 1100 60 L 1280 60"
          stroke="rgba(56,189,248,0.18)"
          strokeWidth="1"
          fill="none"
        />
        <path
          d="M 40 800 L 320 800 L 340 780 L 600 780 M 720 780 L 980 780 L 1000 800 L 1240 800"
          stroke="rgba(56,189,248,0.18)"
          strokeWidth="1"
          fill="none"
        />
        <circle cx="220" cy="80" r="2" fill="#22d3a9" />
        <circle cx="1080" cy="80" r="2" fill="#22d3a9" />
        <circle cx="340" cy="780" r="2" fill="#fbbf24" />
        <circle cx="980" cy="780" r="2" fill="#fbbf24" />
      </svg>

      {/* Top status bar */}
      <div className={styles['status-bar']}>
        <div>
          <span className={styles.led} />
          <span style={{ color: '#fbbf24', marginRight: 14, fontWeight: 700 }}>VERBAFLOW · AGENCY FLOOR</span>
          <span style={{ color: 'rgba(165,243,252,0.6)' }}>v3.2</span>
        </div>
        <div style={{ display: 'flex', gap: 18 }}>
          <span style={{ color: 'rgba(165,243,252,0.6)' }}>SERVICES</span>
          <span style={{ color: 'rgba(165,243,252,0.6)' }}>AGENTS</span>
          <span style={{ color: 'rgba(165,243,252,0.6)' }}>PRICING</span>
          <span style={{ color: 'rgba(165,243,252,0.6)' }}>BOOK</span>
          <span>
            TIME: <span className={styles['time-box']}>14:23 EST</span>
          </span>
        </div>
      </div>

      {/* Headline strip */}
      <div
        style={{
          position: 'relative',
          zIndex: 5,
          padding: '24px 24px 8px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          gap: 24,
        }}
      >
        <div style={{ maxWidth: 680 }}>
          <Cap green>● Live · 4 agents on the floor · 1 supervisor</Cap>
          <h1 className={styles['hero-headline']} style={{ fontSize: 62, marginTop: 8 }}>
            Step inside
            <br />
            <span className={styles.accent}>the agency.</span>
          </h1>
          <p className={styles['hero-sub']} style={{ maxWidth: 480 }}>
            Watch your AI agents and supervisors work in real time. The floor is always live — drop in, click any room,
            book any slot.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Pill variant="green" style={{ fontSize: 14, padding: '8px 22px' }}>
            Book a Session →
          </Pill>
          <Pill variant="dark" style={{ fontSize: 14, padding: '8px 22px', color: '#fff' }}>
            Meet the agents
          </Pill>
        </div>
      </div>

      {/* HERO: full-width floor plan only */}
      <div className={styles['hero-floor-full']}>
        <div className={`${styles['floor-viewport']} ${styles.edge}`}>
          <div className={styles['floor-viewport-inner']}>
            <div className={styles['vp-title']}>
              <span>▣ FLOOR PLAN · LIVE</span>
              <span style={{ color: 'rgba(165,243,252,0.5)' }}>FLOOR 01 / 03 ◀ ▶</span>
            </div>
            <div className={`${styles['room-grid']} ${styles.wide}`}>
              <div className={`${styles['pix-room-card']} ${styles.span2} ${styles.row2} ${styles.live}`}>
                <div className={styles['pr-head']}>
                  <span>▸ CONFERENCE ROOM</span>
                  <span className={styles['led-dot']} />
                </div>
                <div className={styles['pr-scene']}>
                  <PixScene type="conf" />
                </div>
              </div>
              <div className={`${styles['pix-room-card']} ${styles.live}`}>
                <div className={styles['pr-head']}>
                  <span>▸ ENGINE</span>
                  <span className={styles['led-dot']} />
                </div>
                <div className={styles['pr-scene']}>
                  <PixScene type="engine" />
                </div>
              </div>
              <div className={styles['pix-room-card']}>
                <div className={styles['pr-head']} style={{ color: '#fbbf24' }}>
                  <span>▸ STUDIO</span>
                  <span className={`${styles['led-dot']} ${styles.busy}`} />
                </div>
                <div className={styles['pr-scene']}>
                  <PixScene type="studio" />
                </div>
              </div>
              <div className={`${styles['pix-room-card']} ${styles.live}`}>
                <div className={styles['pr-head']}>
                  <span>▸ COMMAND</span>
                  <span className={styles['led-dot']} />
                </div>
                <div className={styles['pr-scene']}>
                  <PixScene type="cmd" />
                </div>
              </div>
              <div className={styles['pix-room-card']}>
                <div className={styles['pr-head']} style={{ color: '#94a3b8' }}>
                  <span>▸ BOARDROOM</span>
                  <span className={`${styles['led-dot']} ${styles.off}`} />
                </div>
                <div className={styles['pr-scene']}>
                  <PixScene type="board" />
                </div>
              </div>
              <div className={`${styles['pix-room-card']} ${styles.span2}`}>
                <div className={styles['pr-head']} style={{ color: '#22d3a9' }}>
                  <span>▸ KITCHEN</span>
                  <span className={styles['led-dot']} />
                </div>
                <div className={styles['pr-scene']}>
                  <PixScene type="kitchen" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Roster + Services row */}
      <div className={styles['team-services-row']}>
        <div className={styles['roster-panel']}>
          <h3>Team Status</h3>
          <input className={styles['roster-search']} placeholder="Search agents..." readOnly />
          <div className={styles['roster-tabs']}>
            <span className={styles.active}>[ALL]</span>
            <span>[WORK]</span>
            <span>[IDLE]</span>
          </div>
          {([
            { n: 'SAN', s: 'WORKING', c: '#22c55e', av: '#fbbf24' },
            { n: 'TITAN', s: 'WORKING', c: '#22c55e', av: '#3b82f6' },
            { n: 'GUARDIAN', s: 'IDLE', c: 'idle', av: '#a78bfa' },
            { n: 'PROMETHEUS', s: 'BUSY', c: 'busy', av: '#ef4444' },
            { n: 'ATLAS', s: 'WORKING', c: '#22c55e', av: '#22d3a9' },
            { n: 'NOVA', s: 'WORKING', c: '#22c55e', av: '#f472b6' },
            { n: 'ORACLE', s: 'IDLE', c: 'idle', av: '#fbbf24' },
            { n: 'PIXEL', s: 'WORKING', c: '#22c55e', av: '#60a5fa' },
            { n: 'SCRIBE', s: 'IDLE', c: 'idle', av: '#fb923c' },
          ] as const).map((a) => (
            <div key={a.n} className={styles['roster-row']}>
              <div
                className={styles['pix-av']}
                style={{ background: a.av, boxShadow: '0 0 0 1px rgba(0,0,0,0.5) inset' }}
              >
                <div style={{ position: 'absolute', top: 3, left: 5, right: 5, height: 6, background: 'rgba(0,0,0,0.4)' }} />
                <div
                  style={{ position: 'absolute', bottom: 0, left: 3, right: 3, height: 7, background: 'rgba(0,0,0,0.6)' }}
                />
              </div>
              <div className={styles['rname-mono']}>
                {a.n}
                <div className={styles.rstat}>[{a.s}]</div>
              </div>
              <span
                className={`${styles['led-dot']} ${a.c === 'busy' ? styles.busy : a.c === 'idle' ? styles.idle : ''}`}
              />
            </div>
          ))}
        </div>

        <div className={styles['services-rail']}>
          <h3>Services Running</h3>
          <div className={styles['svc-grid']}>
            <div className={`${styles['svc-card']} ${styles.featured}`}>
              <div className={styles['svc-tag']}>★ Most picked</div>
              <div className={styles['svc-name']}>AI Chatbot</div>
              <div className={styles['svc-desc']}>Qualifies leads + books calls 24/7. No humans needed.</div>
            </div>
            <div className={styles['svc-card']}>
              <div className={styles['svc-tag']}>▸ Outreach</div>
              <div className={styles['svc-name']}>Lead Engine</div>
              <div className={styles['svc-desc']}>Cold-to-warm pipeline · 1.2k routed today</div>
            </div>
            <div className={styles['svc-card']}>
              <div className={styles['svc-tag']}>▸ Insight</div>
              <div className={styles['svc-name']}>Predictive Reports</div>
              <div className={styles['svc-desc']}>LLM dashboards · raw data → next action</div>
            </div>
            <div className={styles['svc-card']}>
              <div className={styles['svc-tag']}>▸ Studio</div>
              <div className={styles['svc-name']}>Design Sprint</div>
              <div className={styles['svc-desc']}>Spec → ship in 2 weeks</div>
            </div>
            <div className={styles['svc-card']}>
              <div className={styles['svc-tag']}>▸ Reliability</div>
              <div className={styles['svc-name']}>Guardian Watch</div>
              <div className={styles['svc-desc']}>Always-on uptime + auto-patching</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stat strip */}
      <div className={styles['stat-strip']}>
        <div className={`${styles['sk-box']} ${styles.dark}`} style={{ padding: 18 }}>
          <Cap dark>Active projects</Cap>
          <div style={{ fontFamily: 'Caveat', fontSize: 54, fontWeight: 700, lineHeight: 1, color: '#fff', marginTop: 4 }}>
            7
          </div>
          <div style={{ fontFamily: 'Kalam', fontSize: 12, color: 'rgba(255,255,255,0.55)', marginTop: 4 }}>
            across 4 industries
          </div>
        </div>
        <div className={`${styles['sk-box']} ${styles.dark}`} style={{ padding: 18 }}>
          <Cap dark>On the floor now</Cap>
          <div
            style={{ fontFamily: 'Caveat', fontSize: 54, fontWeight: 700, lineHeight: 1, color: 'var(--accent)', marginTop: 4 }}
          >
            4 + 1
          </div>
          <div style={{ fontFamily: 'Kalam', fontSize: 12, color: 'rgba(255,255,255,0.55)', marginTop: 4 }}>
            4 AI agents · 1 supervisor
          </div>
        </div>
        <div
          className={`${styles['sk-box']} ${styles.dark}`}
          style={{ padding: 18, display: 'flex', flexDirection: 'column' }}
        >
          <Cap dark>Next available slot</Cap>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 6 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'Caveat', fontSize: 34, fontWeight: 700, color: '#fff', lineHeight: 1 }}>
                Today · 14:00 EST
              </div>
              <div style={{ fontFamily: 'Kalam', fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 4 }}>
                15-min discovery · with San
              </div>
            </div>
            <Pill variant="green" style={{ fontSize: 13, padding: '8px 18px' }}>
              Take it →
            </Pill>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Live Ops Section ── */

function LiveOpsSection() {
  return (
    <div id="liveops" className={styles.section}>
      <div className={styles['section-inner']}>
        <div className={styles['sec-head']}>
          <div>
            <Cap>02 — Live Operations</Cap>
            <h2>Two windows into the floor.</h2>
          </div>
          <div className={styles['sec-side']}>
            Two persistent cards that live just below the office. Public metrics on the left. The activity stream on the
            right.
          </div>
        </div>

        <div className={styles.g2}>
          {/* Live Ops Card */}
          <div className={styles['sk-box']} style={{ padding: 22 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div className={styles['sk-h']} style={{ fontSize: 26 }}>
                Live Operations
              </div>
              <Pill variant="green" style={{ fontSize: 10, padding: '2px 10px' }}>
                ● LIVE
              </Pill>
            </div>
            <Cap>Real-time public metrics</Cap>
            <div className={styles.g2} style={{ marginTop: 14 }}>
              <div
                className={styles['sk-box']}
                style={{
                  padding: 14,
                  background: 'rgba(165,214,167,0.18)',
                  borderColor: 'var(--accent-strong)',
                }}
              >
                <div style={{ fontFamily: 'Caveat', fontSize: 42, fontWeight: 700, lineHeight: 0.9 }}>7</div>
                <Cap style={{ marginTop: 4 }}>● Active projects</Cap>
              </div>
              <div className={styles['sk-box']} style={{ padding: 14, background: '#f6f3ea' }}>
                <div style={{ fontFamily: 'Caveat', fontSize: 42, fontWeight: 700, lineHeight: 0.9 }}>247</div>
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
              {([
                ['Autonomous Agents', '4 Online'],
                ['Human Supervisors', '1 Present'],
                ['Avg. response time', '< 90s'],
                ['Slot availability', 'Today 14:00'],
              ] as const).map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'Kalam', fontSize: 13 }}>
                  <span style={{ color: 'var(--ink-2)' }}>{k}</span>
                  <span style={{ fontWeight: 700 }}>{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Feed */}
          <div className={styles['sk-box']} style={{ padding: 22 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div className={styles['sk-h']} style={{ fontSize: 26 }}>
                Agent Activity Feed
              </div>
              <Pill style={{ fontSize: 10, padding: '2px 10px' }}>last 24h</Pill>
            </div>
            <Cap>Stream of what agents did, hour-by-hour</Cap>
            <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 11 }}>
              {([
                { dot: 'green', t: 'just now', e: 'San approved Tensei manifest v2.4' },
                { dot: 'blue', t: '3m ago', e: 'Titan routed Trust One outreach batch (52 leads)' },
                { dot: 'amber', t: '18m ago', e: 'Design Agent finalized Studio White tokens' },
                { dot: 'blue', t: '1h ago', e: 'Client discovery confirmed for 14:00 EST' },
                { dot: 'green', t: '2h ago', e: 'Guardian patched Galaxy webhook timeout' },
                { dot: 'amber', t: '4h ago', e: 'Prometheus shipped Engine Room v0.9.1' },
              ] as const).map((it, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 11 }}>
                  <span
                    className={`${styles.ldot} ${it.dot === 'green' ? '' : styles[it.dot]}`}
                    style={{ marginTop: 7, flexShrink: 0 }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'Kalam', fontSize: 14, lineHeight: 1.4 }}>{it.e}</div>
                    <div style={{ fontFamily: 'DM Mono', fontSize: 10, color: 'var(--ink-3)', marginTop: 1 }}>{it.t}</div>
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
          { t: 'What it is', d: 'Two cards underneath the office, persistent. Public, anonymized.' },
          { t: 'Why', d: 'Visitors see proof of life — the agency is real, work is happening now.' },
          { t: 'Build note', d: 'Cards stack on mobile. Feed truncates after 6 items + “view all”.' },
        ]}
      />
    </div>
  );
}

/* ── Services Section ── */

function ServicesSection() {
  return (
    <div id="services" className={`${styles.section} ${styles.paper}`}>
      <div className={styles['section-inner']}>
        <div className={styles['sec-head']}>
          <div>
            <Cap>03 — Services</Cap>
            <h2>What we run for you.</h2>
          </div>
          <div className={styles['sec-side']}>
            Pulled from Verbaflow LLC offerings. Bento layout — one anchor card, satellites around.
          </div>
        </div>

        <div className={styles.bento}>
          {/* Anchor: Chatbot */}
          <div className={`${styles['b-card']} ${styles.tall} ${styles.green}`}>
            <div>
              <Pill variant="solid-dark" style={{ fontSize: 10, padding: '2px 10px' }}>
                ★ Most popular
              </Pill>
              <div className={styles['sk-h']} style={{ fontSize: 42, marginTop: 14, lineHeight: 1.0 }}>
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
                Deploy intelligent chatbots that qualify leads, answer FAQs, and book appointments — 24/7, without human
                intervention.
              </p>
            </div>
            {/* Sketchy chatbot bubble preview */}
            <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 8 }}>
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
                &quot;I&apos;d like a free audit&quot;
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
              <div className={styles['sk-h']} style={{ fontSize: 24, marginTop: 6 }}>
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
            <Pill style={{ fontSize: 11, alignSelf: 'flex-start', marginTop: 12 }}>1.2k routed today</Pill>
          </div>

          <div className={`${styles['b-card']} ${styles.dark}`}>
            <div>
              <Cap dark>Insight</Cap>
              <div className={styles['sk-h']} style={{ fontSize: 24, marginTop: 6, color: '#fff' }}>
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
            <svg width="100%" height="48" viewBox="0 0 200 48" style={{ marginTop: 10 }}>
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
              <div className={styles['sk-h']} style={{ fontSize: 24, marginTop: 6 }}>
                Design Sprint
              </div>
              <p style={{ fontFamily: 'Kalam', fontSize: 13, color: 'var(--ink-2)', marginTop: 6, lineHeight: 1.5 }}>
                Spec → ship in 2 weeks.
              </p>
            </div>
          </div>

          <div className={styles['b-card']}>
            <div>
              <Cap>Reliability</Cap>
              <div className={styles['sk-h']} style={{ fontSize: 24, marginTop: 6 }}>
                Guardian Watch
              </div>
              <p style={{ fontFamily: 'Kalam', fontSize: 13, color: 'var(--ink-2)', marginTop: 6, lineHeight: 1.5 }}>
                Always-on uptime + auto-patching.
              </p>
            </div>
          </div>
        </div>
      </div>

      <AnnoBar
        num="03"
        items={[
          { t: 'Layout', d: 'Anchor card (3 col span x 2 rows) + 4 satellites. Bento, like Huly.' },
          { t: 'Hover', d: 'Card lifts 4px, accent border, shadow grows.' },
          { t: 'Mobile', d: 'Stacks 1-col; anchor stays first.' },
        ]}
      />
    </div>
  );
}

/* ── Agents Section ── */

function AgentsSection() {
  const agents = [
    { n: 'San', r: 'Supervisor (Human)', s: 'Live · in Command Center', c: 'green', i: 'S', online: 'live' },
    { n: 'Titan', r: 'Outreach AI', s: 'Running batch · 1.2k', c: 'note', i: 'T', online: 'live' },
    { n: 'Guardian', r: 'Reliability AI', s: 'Idle · last fix 12m ago', c: 'blue', i: 'G', online: 'off' },
    { n: 'Prometheus', r: 'Engine Room AI', s: 'Building Galaxy QA · busy', c: 'amber', i: 'P', online: 'busy' },
  ];

  const slots = ['Today 14:00', 'Today 15:30', 'Tom 10:00', 'Tom 11:30', 'Tom 14:00'];

  return (
    <div id="agents" className={`${styles.section} ${styles.dark}`}>
      <div className={styles['section-inner']}>
        <div className={styles['sec-head']}>
          <div>
            <Cap dark>04 — The Roster</Cap>
            <h2 style={{ color: '#fff' }}>Meet the agents running your account.</h2>
          </div>
          <div className={styles['sec-side']}>
            Click an avatar → profile drawer opens. From there: book a call, send a message, see live log.
          </div>
        </div>

        {/* Roster cards (4) */}
        <div className={styles.g4} style={{ marginBottom: 24 }}>
          {agents.map((a) => (
            <div key={a.n} className={`${styles['sk-box']} ${styles.dark}`} style={{ padding: 18, position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <Pawn color={a.c} size={48} dark status={a.online === 'live' ? '' : a.online} />
                <div>
                  <div style={{ fontFamily: 'Caveat', fontSize: 26, fontWeight: 700, lineHeight: 1, color: '#fff' }}>
                    {a.n}
                  </div>
                  <div style={{ fontFamily: 'Kalam', fontSize: 11, color: 'rgba(255,255,255,0.55)' }}>{a.r}</div>
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
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <Pill variant="dark" style={{ fontSize: 10, padding: '2px 10px' }}>
                  Profile
                </Pill>
                <Pill variant="green" style={{ fontSize: 10, padding: '2px 10px' }}>
                  Book →
                </Pill>
                <Pill variant="dark" style={{ fontSize: 10, padding: '2px 10px' }}>
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
            <div className={styles['drawer-bg']} style={{ opacity: 0.5 }} />
            {/* Faded floor underneath */}
            <div style={{ position: 'relative', padding: 20, color: 'rgba(255,255,255,0.4)', fontFamily: 'Kalam', fontSize: 13 }}>
              <span>← agency floor (dimmed when drawer open)</span>
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <Pawn color="green" size={56} dark status="" />
                  <div>
                    <div style={{ fontFamily: 'Caveat', fontSize: 32, fontWeight: 700, color: '#fff', lineHeight: 1 }}>
                      San
                    </div>
                    <div style={{ fontFamily: 'Kalam', fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>
                      Founder + Supervisor · Human · NYC
                    </div>
                  </div>
                </div>
                <Pill variant="dark" style={{ fontSize: 11, padding: '2px 10px' }}>
                  ✕
                </Pill>
              </div>

              {/* Status row */}
              <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
                <Pill variant="green" style={{ fontSize: 10, padding: '2px 10px' }}>
                  ● Available now
                </Pill>
                <Pill variant="dark" style={{ fontSize: 10, padding: '2px 10px' }}>
                  Next free: 14:00 EST
                </Pill>
              </div>

              {/* Three actions */}
              <div className={styles.g3} style={{ marginTop: 18, gap: 8 }}>
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
                  <div style={{ fontFamily: 'Caveat', fontSize: 18, fontWeight: 700, lineHeight: 1 }}>📞 Book</div>
                  <div style={{ fontFamily: 'Kalam', fontSize: 10 }}>15m · 30m · 1h</div>
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
                  <div style={{ fontFamily: 'Caveat', fontSize: 18, fontWeight: 700, lineHeight: 1 }}>💬 Message</div>
                  <div style={{ fontFamily: 'Kalam', fontSize: 10, color: 'rgba(255,255,255,0.5)' }}>async, &lt; 4h</div>
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
                  <div style={{ fontFamily: 'Caveat', fontSize: 18, fontWeight: 700, lineHeight: 1 }}>📊 Activity</div>
                  <div style={{ fontFamily: 'Kalam', fontSize: 10, color: 'rgba(255,255,255,0.5)' }}>last 7 days</div>
                </div>
              </div>

              {/* Mini activity preview */}
              <div style={{ marginTop: 18, paddingTop: 14, borderTop: '1px solid var(--dark-border)' }}>
                <Cap dark>Recent activity</Cap>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
                  <div style={{ fontFamily: 'Kalam', fontSize: 12, color: 'rgba(255,255,255,0.85)' }}>
                    <span className={styles.ldot} style={{ marginRight: 6 }} />
                    Approved Tensei manifest v2.4
                    <span style={{ fontFamily: 'DM Mono', fontSize: 10, color: 'rgba(255,255,255,0.45)', marginLeft: 8 }}>
                      now
                    </span>
                  </div>
                  <div style={{ fontFamily: 'Kalam', fontSize: 12, color: 'rgba(255,255,255,0.85)' }}>
                    <span className={`${styles.ldot} ${styles.blue}`} style={{ marginRight: 6 }} />
                    Confirmed Trust One discovery
                    <span style={{ fontFamily: 'DM Mono', fontSize: 10, color: 'rgba(255,255,255,0.45)', marginLeft: 8 }}>
                      1h
                    </span>
                  </div>
                  <div style={{ fontFamily: 'Kalam', fontSize: 12, color: 'rgba(255,255,255,0.85)' }}>
                    <span className={`${styles.ldot} ${styles.amber}`} style={{ marginRight: 6 }} />
                    Reviewed Engine Room v0.9.1
                    <span style={{ fontFamily: 'DM Mono', fontSize: 10, color: 'rgba(255,255,255,0.45)', marginLeft: 8 }}>
                      3h
                    </span>
                  </div>
                </div>
              </div>

              {/* Booking row preview */}
              <div style={{ marginTop: 18, paddingTop: 14, borderTop: '1px solid var(--dark-border)' }}>
                <Cap dark>Pick a slot</Cap>
                <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
                  {slots.map((s) => (
                    <Pill key={s} variant="dark" style={{ fontSize: 11, padding: '4px 12px' }}>
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
          { t: 'Roster', d: '4 cards: 1 human (San), 3 AI (Titan, Guardian, Prometheus). Status dot on every avatar.' },
          { t: 'Drawer', d: 'Right-side slide-in. Floor stays visible, dimmed. Esc / X to close.' },
          { t: 'Actions', d: 'Book / Message / Activity — three CTAs. Slot pills are clickable inside drawer.' },
        ]}
      />
    </div>
  );
}

/* ── How It Works Section ── */

function HowSection() {
  const steps = [
    { n: '01', t: 'Discovery call', d: '15-minute audit. Free. We listen first, talk second.', f: false },
    { n: '02', t: 'Plan & quote', d: 'Bespoke roadmap within 48h. Fixed scope, fixed price.', f: true },
    { n: '03', t: 'Build & supervise', d: 'Agents deploy. San watches. Slack channel opens.', f: false },
    { n: '04', t: 'See it live', d: 'Right here on the agency floor. Forever.', f: false },
  ];

  return (
    <div id="how" className={`${styles.section} ${styles.paper}`}>
      <div className={styles['section-inner']}>
        <div className={styles['sec-head']}>
          <div>
            <Cap>05 — How it works</Cap>
            <h2>From &quot;hello&quot; to live ops in 4 steps.</h2>
          </div>
          <div className={styles['sec-side']}>Linked steps — dotted line connects them, like a floor-plan corridor.</div>
        </div>

        <div className={styles.steps}>
          {steps.map((s) => (
            <div key={s.n} className={styles.step}>
              <div className={`${styles['step-bubble']} ${s.f ? styles.featured : ''}`}>{s.n}</div>
              <div className={styles['sk-h']} style={{ fontSize: 24, lineHeight: 1.05 }}>
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
          { t: 'Visual', d: 'Steps connected by a dotted line — picks up the blueprint metaphor.' },
          { t: 'Step 02', d: 'Featured (dark bubble) = the moment you commit. Friction kept low.' },
          { t: 'Mobile', d: 'Stacks vertically; line becomes a vertical dotted spine.' },
        ]}
      />
    </div>
  );
}

/* ── Pricing Section ── */

function PricingSection() {
  const tiers = [
    {
      n: 'Coupe',
      p: '$49',
      d: 'Essential website + presence for new businesses.',
      f: ['Custom site dev', 'Landing page opt.', 'Google Business profile', '1 monthly check-in'],
    },
    {
      n: 'Muscle',
      p: '$99',
      d: 'Marketing + automation for growing teams.',
      f: ['Social campaigns', 'Auto lead response', 'Google Ads + SEO', 'Analytics + reports', 'Slack channel'],
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
  ];

  return (
    <div id="pricing" className={`${styles.section} ${styles.cream}`}>
      <div className={styles['section-inner']}>
        <div className={styles['sec-head']}>
          <div>
            <Cap>06 — Membership</Cap>
            <h2>Pick a tier. Get to work.</h2>
          </div>
          <div className={styles['sec-side']}>Same names as your existing tiers. Featured tier scaled up + pinned ribbon.</div>
        </div>

        <div className={styles.g3} style={{ alignItems: 'stretch' }}>
          {tiers.map((p) => (
            <div key={p.n} className={`${styles.pcard} ${p.featured ? styles.featured : ''}`}>
              {p.featured && <div className={styles.pmost}>most picked</div>}
              <div className={styles['sk-h']} style={{ fontSize: 28 }}>
                {p.n}
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 4 }}>
                <span style={{ fontFamily: 'Caveat', fontSize: 48, fontWeight: 700, lineHeight: 0.9 }}>{p.p}</span>
                <span style={{ fontFamily: 'Kalam', fontSize: 14, color: 'var(--ink-3)' }}>/mo</span>
              </div>
              <p
                style={{ fontFamily: 'Kalam', fontSize: 13, color: 'var(--ink-2)', margin: '10px 0 14px', lineHeight: 1.5 }}
              >
                {p.d}
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 7 }}>
                {p.f.map((item) => (
                  <li key={item} style={{ fontFamily: 'Kalam', fontSize: 13, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                    <span style={{ color: 'var(--accent-strong)', fontWeight: 700, flexShrink: 0 }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: 18 }}>
                <Pill
                  variant={p.featured ? 'green' : ''}
                  style={{ fontSize: 13, fontWeight: 700, padding: '8px 18px', width: '100%', justifyContent: 'center' }}
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
          { t: 'Tier names', d: 'Coupe / Muscle / Grand Tourer — kept your existing taxonomy.' },
          { t: 'Featured', d: 'Muscle is highlighted with green tint + ribbon + lift.' },
          { t: 'Future', d: 'Add usage meter (e.g. agent-hours) underneath each tier.' },
        ]}
      />
    </div>
  );
}

/* ── CTA Section ── */

function CTASection() {
  return (
    <div id="cta" className={styles.cta}>
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
        <h2 className={styles['sk-h']} style={{ fontSize: 68, color: '#fff', marginTop: 8, lineHeight: 0.98 }}>
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
          Book a 15-minute discovery call. We&apos;ll show you your future agency floor — populated with agents already
          running for clients like you.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Pill variant="green" style={{ fontSize: 15, padding: '10px 26px', fontWeight: 700 }}>
            Book a Session →
          </Pill>
          <Pill variant="dark" style={{ fontSize: 15, padding: '10px 26px', color: '#fff' }}>
            See pricing
          </Pill>
        </div>
        <div style={{ marginTop: 24, fontFamily: 'DM Mono', fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>
          verbaflowllc.com/agency · est. 2024
        </div>
      </div>
    </div>
  );
}

/* ── Main Component (Default Export) ── */

export default function Proto04WireframeV2() {
  return (
    <>
      <GoogleFonts />

      <div className={styles.root}>
      <div className={styles['ctx-bar']}>
        <div>
          <h1>Agency Page · Wireframe Round 2</h1>
          <div className={styles.meta}>
            Direction <strong>B + D</strong> — top-down blueprint floor with animated task-flow lines. Hero is
            edge-to-edge dark (Huly-style). Sections below: Live Ops · Services · Agents · How it works · Pricing · CTA.
            Includes profile-drawer + booking interaction sketch.
          </div>
        </div>
        <div className={styles.stamp}>Lo-fi · Round 2</div>
      </div>

      {/* Section anchor nav */}
      <div className={styles.secnav}>
        <span className={styles.label}>Jump to →</span>
        <a href="#hero">
          <span className={styles.num}>01</span>Floor (Hero)
        </a>
        <a href="#liveops">
          <span className={styles.num}>02</span>Live Ops
        </a>
        <a href="#services">
          <span className={styles.num}>03</span>Services
        </a>
        <a href="#agents">
          <span className={styles.num}>04</span>Agents + Drawer
        </a>
        <a href="#how">
          <span className={styles.num}>05</span>How it works
        </a>
        <a href="#pricing">
          <span className={styles.num}>06</span>Pricing
        </a>
        <a href="#cta">
          <span className={styles.num}>07</span>CTA
        </a>
      </div>

      <div className={styles.workspace}>
        <div className={styles.mock}>
          {/* Mock browser toolbar */}
          <div className={styles['mock-toolbar']}>
            <span className={styles.dot} style={{ background: '#ff6b6b' }} />
            <span className={styles.dot} style={{ background: '#ffd93d' }} />
            <span className={styles.dot} style={{ background: '#6bcf7f' }} />
            <span className={styles.url}>verbaflowllc.com/agency</span>
            <span style={{ marginLeft: 'auto', fontFamily: 'DM Mono', fontSize: 10, color: 'var(--ink-3)' }}>
              1280 × scroll
            </span>
          </div>

          {/* HERO */}
          <HeroFloor />
          <AnnoBar
            dark
            num="01"
            items={[
              { t: 'Floor plan', d: 'Top-down blueprint with rooms + corridor + door gaps. Animated dashed lines = task flow.' },
              { t: 'Rooms', d: '5 named zones. Each shows live status pill + avatars. Click → join / book.' },
              { t: 'Stat strip', d: '3 cards bolted to bottom of hero — projects · presence · next slot. Booking lives here too.' },
            ]}
          />

          <LiveOpsSection />
          <ServicesSection />
          <AgentsSection />
          <HowSection />
          <PricingSection />
          <CTASection />
        </div>

        <div className={styles.footer}>Round 2 · Direction B + D · Ready for sign-off → hi-fi</div>
      </div>
      </div>
    </>
  );
}
