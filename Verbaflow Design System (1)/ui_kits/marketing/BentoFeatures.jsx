// "Why Verbaflow" bento — 5 glass cards with inner mint glow.
// Layout mirrors the reference: 3 across the top, 2 wider across the bottom.

function GlassCard({ tall, span, glowFrom = 'top-left', children, title, sub }) {
  return (
    <div className={`vf-glass2 ${tall ? 'is-tall' : ''} ${span ? `is-span-${span}` : ''} vf-glass2--${glowFrom}`}>
      <div className="vf-glass2__head">
        <h3 className="vf-glass2__title">{title}</h3>
        <p className="vf-glass2__sub">{sub}</p>
      </div>
      <div className="vf-glass2__body">{children}</div>
    </div>
  );
}

function BentoFeatures() {
  return (
    <section className="vf-bento">
      <div className="vf-bento__glow-wall"></div>
      <div className="vf-container vf-bento__inner">
        <div className="vf-bento__eyebrow">
          Why teams pick Verbaflow over hiring three more contractors
        </div>

        <div className="vf-bento__grid">
          {/* TOP ROW — three cards */}
          <GlassCard
            title="Production-Grade"
            sub="Shipped, observable, auditable."
            glowFrom="top-left"
          >
            <div className="vf-bento__icon-tile">
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#A5D6A7" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 18 22 12 16 6"/>
                <polyline points="8 6 2 12 8 18"/>
              </svg>
            </div>
            <div className="vf-bento__icon-rings"></div>
          </GlassCard>

          <GlassCard
            title="Multi-Agent Crew"
            sub="A CEO agent that delegates."
            glowFrom="top-center"
          >
            <div className="vf-bento__crew">
              <div className="vf-bento__crew-node vf-bento__crew-node--user">
                <div className="vf-bento__avatar">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                    <circle cx="12" cy="8" r="4"/>
                    <path d="M4 21a8 8 0 0116 0"/>
                  </svg>
                </div>
                <span className="vf-bento__crew-label">CEO Agent</span>
              </div>
              <div className="vf-bento__crew-line"></div>
              <div className="vf-bento__crew-node vf-bento__crew-node--btn">
                <div className="vf-bento__pill-chip">Dispatch</div>
              </div>
              <div className="vf-bento__crew-cursor">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="#A5D6A7">
                  <path d="M5 3l3.5 15 3-6 6-3z"/>
                </svg>
              </div>
            </div>
          </GlassCard>

          <GlassCard
            title="Telegram HITL"
            sub="Humans on call, not in the loop."
            glowFrom="top-right"
          >
            <div className="vf-bento__chat">
              <div className="vf-bento__chat-row vf-bento__chat-row--in">
                <div className="vf-bento__chat-avatar"></div>
                <div className="vf-bento__chat-bubble">Approve denial appeal for claim&nbsp;#48217?</div>
              </div>
              <div className="vf-bento__chat-row vf-bento__chat-row--out">
                <div className="vf-bento__chat-bubble vf-bento__chat-bubble--out">✓ Approved · agent will file by 2pm</div>
                <div className="vf-bento__chat-avatar vf-bento__chat-avatar--you"></div>
              </div>
            </div>
          </GlassCard>

          {/* BOTTOM ROW — two wide cards */}
          <GlassCard
            title="Workflow Automation"
            sub="Routes, retries, escalates."
            glowFrom="bottom-left"
            span={2}
            tall
          >
            <div className="vf-bento__board">
              <div className="vf-bento__board-grid">
                {Array.from({ length: 36 }).map((_, i) => {
                  const isOrder = i === 8;
                  const isSolved = i === 21;
                  return (
                    <div key={i} className={`vf-bento__tile ${isOrder ? 'is-chip-order' : ''} ${isSolved ? 'is-chip-solved' : ''}`}>
                      {isOrder && <span>Routed</span>}
                      {isSolved && <span>Resolved</span>}
                    </div>
                  );
                })}
              </div>
            </div>
          </GlassCard>

          <GlassCard
            title="Modern AI Stack"
            sub="Frontier models. Boring-on-purpose plumbing."
            glowFrom="bottom-right"
            span={2}
            tall
          >
            <div className="vf-bento__stack">
              {[
                { name: 'OpenAI',    tag: 'Reasoning & tool-use orchestration',  letter: 'O', tint: '#10A37F' },
                { name: 'Anthropic', tag: 'Long-context agent planning',          letter: 'A', tint: '#D97757' },
                { name: 'Llama',     tag: 'On-prem inference for sensitive data', letter: 'L', tint: '#7C3AED' },
                { name: 'Gemini',    tag: 'Multimodal intake & document parsing', letter: 'G', tint: '#4285F4' },
              ].map((m, i) =>
                <div key={m.name} className={`vf-bento__stack-card vf-bento__stack-card--${i}`}>
                  <div className="vf-bento__stack-logo" style={{ background: `${m.tint}33`, color: m.tint }}>{m.letter}</div>
                  <div className="vf-bento__stack-name">{m.name}</div>
                  <div className="vf-bento__stack-tag">{m.tag}</div>
                </div>
              )}
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  );
}

window.BentoFeatures = BentoFeatures;
