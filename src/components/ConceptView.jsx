import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { Spotlight } from './ui/spotlight-new.jsx'
import { Meteors } from './ui/meteors.jsx'

export default function ConceptView({ concept }) {
  const Animation = concept.component
  const rootRef = useRef(null)

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

      <div className={`concept-canvas ${Animation ? 'has-animation' : ''}`}>
        {Animation ? (
          <Animation />
        ) : (
          <>
            {/* Real Aceternity Spotlight beams behind the placeholder. */}
            <Spotlight />
            <div className="placeholder">
              {/* Real Aceternity Meteors. */}
              <Meteors number={20} />
              <div className="placeholder-icon">▶</div>
              <p className="placeholder-title">Animation coming soon</p>
              <p className="placeholder-text">
                This concept doesn't have an animation yet. We'll build it next.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
