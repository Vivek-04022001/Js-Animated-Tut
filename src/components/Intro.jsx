import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import './Intro.css'

const TITLE = 'JS Animations'

// Themed code fragments that drift in the background — placed around the edges
// so they never crowd the centred title.
const TOKENS = [
  { t: 'const', l: 8, top: 16 },
  { t: '=>', l: 19, top: 70 },
  { t: 'async', l: 13, top: 43 },
  { t: '{ }', l: 31, top: 12 },
  { t: 'await', l: 6, top: 84 },
  { t: '( )', l: 79, top: 18 },
  { t: 'let', l: 89, top: 58 },
  { t: '...', l: 72, top: 82 },
  { t: 'this', l: 91, top: 33 },
  { t: 'null', l: 25, top: 88 },
  { t: '[ ]', l: 84, top: 88 },
  { t: 'new', l: 4, top: 58 },
  { t: 'yield', l: 61, top: 9 },
  { t: '=>', l: 49, top: 92 },
]

// One-time cinematic opener. A fixed overlay that plays a GSAP timeline and
// then calls onFinish() so the app underneath takes over.
export default function Intro({ onFinish }) {
  const rootRef = useRef(null)
  const tlRef = useRef(null)

  useGSAP(
    () => {
      const reduce = window.matchMedia?.(
        '(prefers-reduced-motion: reduce)'
      ).matches

      // Respect reduced-motion: a quick, calm fade instead of the full show.
      if (reduce) {
        gsap
          .timeline({ onComplete: onFinish })
          .from('.intro-content', { opacity: 0, duration: 0.4 })
          .to('.intro', { opacity: 0, duration: 0.4, delay: 0.6 })
        return
      }

      // --- Ambient loops (run for the whole intro, independent of the line) ---
      // Floating code tokens.
      gsap.fromTo(
        '.intro-token',
        { opacity: 0, y: 24 },
        { opacity: 0.16, y: 0, duration: 1.2, stagger: 0.07, ease: 'power2.out' }
      )
      gsap.to('.intro-token', {
        y: '-=16',
        duration: 3.4,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        stagger: { each: 0.25, from: 'random' },
      })
      // Sonar rings pulsing out from behind the badge.
      gsap.fromTo(
        '.intro-ring',
        { scale: 0.25, opacity: 0.55 },
        {
          scale: 1.9,
          opacity: 0,
          duration: 2.6,
          ease: 'power2.out',
          repeat: -1,
          stagger: 0.85,
        }
      )
      // Slow drift on the perspective grid for parallax.
      gsap.to('.intro-grid', {
        backgroundPositionY: '+=48px',
        duration: 6,
        ease: 'none',
        repeat: -1,
      })

      // --- Main cinematic line ---
      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        onComplete: onFinish,
      })
      tlRef.current = tl

      // 0 — camera push-in on the whole stage for depth.
      tl.from('.intro-content', { scale: 1.14, duration: 2.6, ease: 'power2.out' }, 0)
      tl.to('.intro-grid', { opacity: 1, duration: 1.4 }, 0)

      // 1 — spotlight blooms out of the dark.
      tl.to('.intro-glow', { opacity: 1, scale: 1, duration: 1.3, ease: 'power2.out' }, 0.1)

      // 2 — the JS badge punches in with an overshoot + flares.
      tl.from(
        '.intro-badge',
        { scale: 0.1, opacity: 0, rotate: -50, duration: 0.9, ease: 'back.out(1.9)' },
        0.35
      )
      tl.to('.intro-badge', { boxShadow: '0 0 70px rgba(247,223,30,0.8)', duration: 0.5 }, '>-0.2')

      // 3 — title letters rise and unblur, one after another.
      tl.from(
        '.intro-char',
        {
          yPercent: 130,
          opacity: 0,
          rotateX: -90,
          filter: 'blur(14px)',
          stagger: 0.045,
          duration: 0.8,
          ease: 'power4.out',
        },
        0.75
      )

      // 4 — a light sweep glints across the title (twice).
      tl.fromTo(
        '.intro-sweep',
        { xPercent: -160, opacity: 0 },
        { xPercent: 260, opacity: 1, duration: 1.1, ease: 'power2.inOut', repeat: 1, repeatDelay: 0.3 },
        1.4
      )

      // 5 — tagline settles in from a wide letter-spacing.
      tl.from(
        '.intro-tagline',
        { opacity: 0, y: 16, letterSpacing: '0.7em', duration: 0.9, ease: 'power2.out' },
        1.55
      )

      // 6 — loading bar fills, selling the "experience is booting" feel.
      tl.fromTo(
        '.intro-bar-fill',
        { scaleX: 0 },
        { scaleX: 1, duration: 2.0, ease: 'power1.inOut' },
        0.7
      )
      tl.to('.intro-bar', { opacity: 0, duration: 0.4 }, '>-0.1')

      // 7 — a quick white flash, then the cinema doors split open.
      tl.fromTo(
        '.intro-flash',
        { opacity: 0 },
        { opacity: 0.9, duration: 0.12, ease: 'power2.in' },
        '+=0.35'
      )
      tl.to('.intro-flash', { opacity: 0, duration: 0.5, ease: 'power2.out' })
      tl.to('.intro-content', { scale: 1.12, opacity: 0, duration: 0.6, ease: 'power2.in' }, '<')
      tl.to('.intro-seam', { opacity: 0, duration: 0.3 }, '<')
      tl.to('.intro-half.top', { yPercent: -100, duration: 0.9, ease: 'power4.inOut' }, '<0.05')
      tl.to('.intro-half.bottom', { yPercent: 100, duration: 0.9, ease: 'power4.inOut' }, '<')
      tl.set('.intro', { pointerEvents: 'none' })
    },
    { scope: rootRef }
  )

  // Let impatient visitors jump straight to the app.
  const skip = () => tlRef.current?.progress(1)

  return (
    <div className="intro" ref={rootRef}>
      <div className="intro-half top" />
      <div className="intro-half bottom" />
      <div className="intro-seam" />

      <div className="intro-content">
        {/* Background atmosphere */}
        <div className="intro-grid" />
        <div className="intro-tokens" aria-hidden="true">
          {TOKENS.map((tok, i) => (
            <span
              className="intro-token"
              key={i}
              style={{ left: `${tok.l}%`, top: `${tok.top}%` }}
            >
              {tok.t}
            </span>
          ))}
        </div>

        {/* Centerpiece */}
        <div className="intro-stage">
          <div className="intro-glow" />
          <span className="intro-ring" />
          <span className="intro-ring" />
          <span className="intro-ring" />
          <div className="intro-badge">JS</div>

          <div className="intro-title-wrap">
            <h1 className="intro-title" aria-label={TITLE}>
              {TITLE.split('').map((ch, i) => (
                <span className="intro-char" key={i} aria-hidden="true">
                  {ch === ' ' ? ' ' : ch}
                </span>
              ))}
            </h1>
            <span className="intro-sweep" aria-hidden="true" />
          </div>

          <p className="intro-tagline">Learn JavaScript visually</p>

          <div className="intro-bar" aria-hidden="true">
            <span className="intro-bar-fill" />
          </div>
        </div>
      </div>

      <div className="intro-flash" aria-hidden="true" />

      <button className="intro-skip" onClick={skip}>
        Skip intro ›
      </button>
    </div>
  )
}
