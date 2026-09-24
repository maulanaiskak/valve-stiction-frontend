import './ValveAnimation.css'

// A sticking valve's stem moves in flat-then-jump steps (the classic
// stick-slip signature the ellipse/Kano detectors and RF model all score
// for) instead of tracking its setpoint smoothly. Modeled as explicit
// keyframes (hold, then a fast snap) rather than CSS steps() timing --
// steps() just reads as choppy/low-framerate motion, not "stuck"; a real
// pause plus a visible jump (with a flash and a pulsing "stuck" badge
// during the hold) reads as sticking at a glance.
export function ValveAnimation({ sticking }: { sticking: boolean }) {
  return (
    <div className="valve" role="img" aria-label={sticking ? 'Sticking valve' : 'Healthy valve'}>
      <svg viewBox="0 0 200 160" width="100%" height="160">
        {/* actuator housing */}
        <rect x="65" y="4" width="70" height="26" rx="4" fill="#475569" />
        <rect x="65" y="4" width="70" height="8" rx="4" fill="#64748b" />

        {/* stem + plug travel together */}
        <g className={sticking ? 'stem stem-sticking' : 'stem stem-healthy'}>
          <rect x="96" y="30" width="8" height="30" fill="#334155" />
          <polygon points="80,60 120,60 100,84" fill={sticking ? '#dc2626' : '#16a34a'} />
          <circle className="stuck-badge" cx="100" cy="70" r="5" fill="#dc2626" />
        </g>

        {/* valve body */}
        <path
          d="M50,60 L150,60 L150,100 Q150,116 134,116 L66,116 Q50,116 50,100 Z"
          fill="none"
          stroke="#94a3b8"
          strokeWidth="6"
        />

        {/* inlet / outlet pipes */}
        <line x1="0" y1="88" x2="50" y2="88" stroke="#94a3b8" strokeWidth="10" />
        <line x1="150" y1="88" x2="200" y2="88" stroke="#94a3b8" strokeWidth="10" />

        {/* flow indicator chevrons -- stall visibly during a sticking hold */}
        <g className={sticking ? 'flow flow-sticking' : 'flow flow-healthy'} stroke="#38bdf8" strokeWidth="3" fill="none" strokeLinecap="round">
          <polyline points="10,84 16,88 10,92" />
          <polyline points="24,84 30,88 24,92" />
          <polyline points="160,84 166,88 160,92" />
          <polyline points="174,84 180,88 174,92" />
        </g>
      </svg>
      <div className={sticking ? 'valve-caption caption-sticking' : 'valve-caption caption-healthy'}>
        {sticking ? 'stem sticking, then snapping' : 'stem tracking smoothly'}
      </div>
    </div>
  )
}
