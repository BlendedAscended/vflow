// Strand A (purple): weaves right from left start
// Strand B (teal):   mirror weave from right start
// Rungs at 40px intervals, connectors to card anchor points

const STRAND_A = 'M 240 0 C 340 66 440 133 440 200 C 440 266 240 333 240 400 C 240 466 440 533 440 600 C 440 666 240 733 240 800'
const STRAND_B = 'M 440 0 C 340 66 240 133 240 200 C 240 266 440 333 440 400 C 440 466 240 533 240 600 C 240 666 440 733 440 800'

// Pre-computed rung endpoints at 40px intervals (y = 40, 80, …, 760)
// At each y we interpolate x positions on each strand.
// Instead of solving bezier math at runtime, we use a lookup via canvas-free
// linear approximation of the strand sine-wave: x ≈ 340 ± 100*sin(π*y/200)
function getRungEndpoints() {
  const rungs: { y: number; x1: number; x2: number }[] = []
  for (let y = 40; y < 800; y += 40) {
    // Sine period = 400px (half-period = 200px), amplitude = 100px
    const xA = 340 + 100 * Math.sin((Math.PI * y) / 200)
    const xB = 340 - 100 * Math.sin((Math.PI * y) / 200)
    rungs.push({ y, x1: Math.min(xA, xB), x2: Math.max(xA, xB) })
  }
  return rungs
}

// Card anchor points — where connector lines terminate on the card edge
// Left cards terminate at their right edge (~260px), right cards at left edge (~420px)
const CARD_ANCHORS = [
  { y: 110, side: 'left', cx: 260 },    // Revenue card mid-y (top:60, height:100 → mid=110)
  { y: 290, side: 'right', cx: 420 },   // Clients (top:240 → mid=290)
  { y: 470, side: 'left', cx: 260 },    // Conversion (top:420 → mid=470)
  { y: 650, side: 'right', cx: 420 },   // Performance (top:600 → mid=650)
]

export default function HelixBackbone() {
  const rungs = getRungEndpoints()

  return (
    <svg
      className="helix-svg"
      viewBox="0 0 680 800"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* ── Shadow depth strokes ─────────────────────────────────────────── */}
      <path
        d={STRAND_A}
        fill="none"
        stroke="var(--helix-strand-purple)"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.15"
      />
      <path
        d={STRAND_B}
        fill="none"
        stroke="var(--helix-strand-teal)"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.15"
      />

      {/* ── Primary strands ──────────────────────────────────────────────── */}
      <path
        d={STRAND_A}
        fill="none"
        stroke="var(--helix-strand-purple)"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.45"
      />
      <path
        d={STRAND_B}
        fill="none"
        stroke="var(--helix-strand-teal)"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.45"
      />

      {/* ── Base pair rungs ──────────────────────────────────────────────── */}
      {rungs.map(({ y, x1, x2 }) => (
        <line
          key={y}
          x1={x1}
          y1={y}
          x2={x2}
          y2={y}
          stroke="var(--helix-rung)"
          strokeWidth="0.5"
          opacity="0.2"
        />
      ))}

      {/* ── Card connectors ──────────────────────────────────────────────── */}
      {CARD_ANCHORS.map(({ y, side, cx }) => {
        // Find nearest rung y
        const nearestRung = rungs.reduce((prev, curr) =>
          Math.abs(curr.y - y) < Math.abs(prev.y - y) ? curr : prev
        )
        const rungX = side === 'left' ? nearestRung.x1 : nearestRung.x2
        return (
          <line
            key={`connector-${y}`}
            x1={rungX}
            y1={nearestRung.y}
            x2={cx}
            y2={y}
            stroke="var(--helix-connector)"
            strokeWidth="0.5"
            strokeDasharray="4 4"
            opacity="0.2"
          />
        )
      })}
    </svg>
  )
}
