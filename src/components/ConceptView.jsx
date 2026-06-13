import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

// A handful of meteors with staggered timing for the placeholder backdrop.
const METEORS = Array.from({ length: 12 }, (_, i) => ({
  left: `${(i * 8.5) % 100}%`,
  delay: `${(i * 0.7).toFixed(1)}s`,
  duration: `${3 + (i % 4)}s`,
}))

export default function ConceptView({ concept }) {
  const Animation = concept.component
  const rootRef = useRef(null)
  const canvasRef = useRef(null)

  // Feed the cursor position into CSS vars so the spotlight follows the pointer.
  const handleMouseMove = (e) => {
    const el = canvasRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    el.style.setProperty('--mx', `${e.clientX - r.left}px`)
    el.style.setProperty('--my', `${e.clientY - r.top}px`)
  }

  // Re-runs every time the selected concept changes (the component stays
  // mounted, so we key the animation off concept.id rather than a remount).
  // Header text slides up, then the canvas fades/scales in just behind it.
  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.from('.concept-header > *', {
        y: 14,
        opacity: 0,
        duration: 0.45,
        stagger: 0.08,
      })
      tl.from(
        '.concept-canvas',
        { y: 18, opacity: 0, scale: 0.985, duration: 0.5 },
        '-=0.3'
      )

      // Gentle, continuous pulse on the placeholder play icon (only present
      // when there's no animation yet).
      const icon = rootRef.current?.querySelector('.placeholder-icon')
      if (icon) {
        gsap.to(icon, {
          scale: 1.12,
          repeat: -1,
          yoyo: true,
          duration: 1.1,
          ease: 'sine.inOut',
        })
      }
    },
    { dependencies: [concept.id], scope: rootRef }
  )

  return (
    <div className="concept-view" ref={rootRef}>
      <div className="concept-header">
        <h1>{concept.title}</h1>
        <p className="concept-blurb">{concept.blurb}</p>
      </div>

      <div
        className={`concept-canvas ${Animation ? 'has-animation' : ''}`}
        ref={canvasRef}
        onMouseMove={handleMouseMove}
      >
        {Animation ? (
          <Animation />
        ) : (
          <div className="placeholder">
            <div className="meteors" aria-hidden="true">
              {METEORS.map((m, i) => (
                <span
                  className="meteor"
                  key={i}
                  style={{
                    left: m.left,
                    animationDelay: m.delay,
                    animationDuration: m.duration,
                  }}
                />
              ))}
            </div>
            <div className="placeholder-icon">▶</div>
            <p className="placeholder-title">Animation coming soon</p>
            <p className="placeholder-text">
              This concept doesn't have an animation yet. We'll build it next.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
