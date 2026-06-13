import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import './ProgressTree.css'

// Geometry for the bottom-up "growth" reveal.
const PLANT_TOP = 16
const GROUND = 126
const SPAN = GROUND - PLANT_TOP

// The tree shapes, reused twice: once as a faint ghost (the not-yet-grown
// outline) and once as the vivid fill that a clip-path reveals from the soil up.
function Tree({ variant }) {
  const c = variant // 'ghost' | 'fill'
  return (
    <g className={`ptree-${c}`}>
      {/* trunk */}
      <path
        d="M58 126 C57 108 57 98 60 86 C63 98 63 108 62 126 Z"
        className="ptree-trunk"
      />
      {/* canopy */}
      <g className="ptree-canopy">
        <circle cx="60" cy="52" r="22" />
        <circle cx="42" cy="66" r="16" />
        <circle cx="78" cy="66" r="16" />
        <circle cx="60" cy="72" r="18" />
      </g>
      {/* little fruit accents */}
      <circle cx="50" cy="58" r="3.2" className="ptree-fruit" />
      <circle cx="72" cy="60" r="3.2" className="ptree-fruit" />
      <circle cx="61" cy="46" r="3.2" className="ptree-fruit" />
    </g>
  )
}

export default function ProgressTree({ done, total }) {
  const ratio = total ? Math.min(1, done / total) : 0
  const pct = Math.round(ratio * 100)
  const complete = done >= total && total > 0

  const rootRef = useRef(null)
  const clipRef = useRef(null)
  const fillRef = useRef(null)

  // Animate the clip rectangle upward whenever progress changes, and give the
  // whole tree a little celebratory pop on each gain.
  useGSAP(
    () => {
      const h = SPAN * ratio
      gsap.to(clipRef.current, {
        attr: { y: GROUND - h, height: h },
        duration: 1,
        ease: 'power3.out',
      })
      if (ratio > 0) {
        gsap.fromTo(
          fillRef.current,
          { transformOrigin: '50% 100%', scale: 0.94 },
          { scale: 1, duration: 0.7, ease: 'back.out(2)' }
        )
      }
    },
    { dependencies: [ratio], scope: rootRef }
  )

  return (
    <div className={`ptree ${complete ? 'is-complete' : ''}`} ref={rootRef}>
      <svg viewBox="0 0 120 140" className="ptree-svg" aria-hidden="true">
        <defs>
          <clipPath id="ptree-grow">
            <rect ref={clipRef} x="0" y={GROUND} width="120" height="0" />
          </clipPath>
          <radialGradient id="ptree-leaf" cx="50%" cy="35%" r="75%">
            <stop offset="0%" stopColor="#7be88a" />
            <stop offset="60%" stopColor="#34c759" />
            <stop offset="100%" stopColor="#1f9d4d" />
          </radialGradient>
        </defs>

        {/* soil mound */}
        <ellipse cx="60" cy="128" rx="34" ry="7" className="ptree-soil" />

        {/* faint outline of the full-grown tree */}
        <Tree variant="ghost" />

        {/* vivid tree, revealed from the soil up as progress grows */}
        <g clipPath="url(#ptree-grow)">
          <g ref={fillRef}>
            <Tree variant="fill" />
          </g>
        </g>
      </svg>

      <div className="ptree-meta">
        <div className="ptree-pct">{pct}%</div>
        <div className="ptree-label">
          {complete ? '🎉 All explored!' : `${done} / ${total} explored`}
        </div>
      </div>
    </div>
  )
}
