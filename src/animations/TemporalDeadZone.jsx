import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import './TemporalDeadZone.css'

const CODE = [
  '{',
  '  // scope starts here',
  '  console.log(age); // ❌ ReferenceError',
  '',
  '  const age = 30;   // TDZ ends here',
  '',
  '  console.log(age); // ✅ 30',
  '}',
]

// progress = how far down the lifecycle the marker sits (0..1)
const STEPS = [
  {
    lines: [0, 1],
    marker: 0,
    zone: 'tdz',
    title: 'The scope opens — TDZ begins',
    text: '`age` is hoisted to the top of the block, so it already exists. But it is uninitialized: it has entered the Temporal Dead Zone.',
  },
  {
    lines: [2],
    marker: 0.34,
    zone: 'tdz',
    title: 'Accessing inside the TDZ throws',
    text: 'Reading `age` here — before its declaration line — throws `ReferenceError: Cannot access \'age\' before initialization`. The binding exists but cannot be touched.',
  },
  {
    lines: [4],
    marker: 0.62,
    zone: 'edge',
    title: 'The declaration ends the TDZ',
    text: 'Execution reaches `const age = 30`. The binding is initialized, and the Temporal Dead Zone closes right here.',
  },
  {
    lines: [6],
    marker: 1,
    zone: 'live',
    title: 'Now it is safe to use',
    text: 'After initialization, `age` behaves normally — `console.log(age)` prints 30. Everything past the declaration is the "live" zone.',
  },
]

const PHASES = [
  { key: 'hoist', label: 'Hoisted', sub: 'binding created' },
  { key: 'tdz', label: 'TDZ', sub: 'exists, unreadable' },
  { key: 'init', label: 'Initialized', sub: 'value assigned' },
  { key: 'live', label: 'Usable', sub: 'safe to read' },
]

export default function TemporalDeadZone() {
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(false)
  const codeRef = useRef(null)
  const s = STEPS[step]
  const atEnd = step === STEPS.length - 1

  useEffect(() => {
    if (!playing) return
    if (atEnd) {
      setPlaying(false)
      return
    }
    const t = setTimeout(() => setStep((n) => n + 1), 3000)
    return () => clearTimeout(t)
  }, [playing, step, atEnd])

  const pause = () => setPlaying(false)

  useGSAP(
    () => {
      const active = codeRef.current?.querySelectorAll('.tz-line.active')
      if (active && active.length) {
        gsap.fromTo(
          active,
          { backgroundColor: 'rgba(247,223,30,0.32)' },
          { backgroundColor: 'rgba(247,223,30,0.12)', duration: 0.7, ease: 'power2.out' }
        )
      }
    },
    { dependencies: [step], scope: codeRef }
  )

  return (
    <div className="tz">
      <div className="tz-grid">
        {/* Code panel */}
        <pre className="tz-code" ref={codeRef}>
          {CODE.map((line, i) => (
            <div key={i} className={`tz-line ${s.lines.includes(i) ? 'active' : ''}`}>
              <span className="tz-gutter">{i + 1}</span>
              <code>{line || ' '}</code>
            </div>
          ))}
        </pre>

        {/* Lifecycle timeline */}
        <div className="tz-timeline">
          <span className="tz-timeline-label">Lifecycle of <code>const age</code></span>

          <div className="tz-track">
            {/* TDZ shaded band covers the first portion of the track */}
            <div className="tz-band" />
            <div className="tz-band-line" />

            {/* Travelling marker */}
            <motion.div
              className={`tz-marker zone-${s.zone}`}
              animate={{ top: `calc(${s.marker * 100}% )` }}
              transition={{ type: 'spring', stiffness: 200, damping: 26 }}
            >
              <span className="tz-marker-dot" />
              <span className="tz-marker-tip">execution</span>
            </motion.div>

            {/* Phase milestones down the track */}
            <div className="tz-phases">
              {PHASES.map((p) => (
                <div key={p.key} className={`tz-phase ph-${p.key}`}>
                  <span className="tz-phase-node" />
                  <span className="tz-phase-text">
                    <strong>{p.label}</strong>
                    <small>{p.sub}</small>
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className={`tz-status zone-${s.zone}`}>
            {s.zone === 'tdz' && '⛔ In the Temporal Dead Zone — reads throw'}
            {s.zone === 'edge' && '✳ Initialized — TDZ closes'}
            {s.zone === 'live' && '✅ Live — safe to read & use'}
          </div>
        </div>
      </div>

      {/* Narration */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          className="tz-explain"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
        >
          <div className="tz-explain-head">
            <span className="tz-step-num">{step + 1} / {STEPS.length}</span>
            <h3>{s.title}</h3>
          </div>
          <p>{s.text}</p>
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      <div className="tz-controls">
        <button onClick={() => { pause(); setStep(0) }} disabled={step === 0 && !playing}>⟲ Reset</button>
        <button onClick={() => { pause(); setStep((n) => Math.max(0, n - 1)) }} disabled={step === 0}>‹ Prev</button>
        {atEnd ? (
          <button className="primary" onClick={() => { setStep(0); setPlaying(true) }}>↻ Replay</button>
        ) : (
          <button className="primary" onClick={() => (playing ? pause() : setPlaying(true))}>
            {playing ? '❚❚ Pause' : '▶ Play'}
          </button>
        )}
        <button onClick={() => { pause(); setStep((n) => Math.min(STEPS.length - 1, n + 1)) }} disabled={atEnd}>Next ›</button>
      </div>

      {/* Cards */}
      <div className="tz-cards">
        <div className="tz-card">
          <h4>Why it exists</h4>
          <p>The TDZ turns "use before declaration" into a loud error instead of a silent <code>undefined</code>, catching real bugs early.</p>
        </div>
        <div className="tz-card">
          <h4>Who has a TDZ</h4>
          <p><code>let</code>, <code>const</code>, and <code>class</code>. <code>var</code> does not — it reads as <code>undefined</code> before its line instead of throwing.</p>
        </div>
        <div className="tz-card">
          <h4>Temporal, not spatial</h4>
          <p>The zone is about <em>when</em> code runs, not where it sits. A closure defined in the TDZ is fine as long as it's <em>called</em> after initialization.</p>
        </div>
      </div>
    </div>
  )
}
