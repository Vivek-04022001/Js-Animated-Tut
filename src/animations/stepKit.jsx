import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import './_common.css'

// Shared step state machine used by every step-based animation.
export function useStepper(length, interval = 2600) {
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(false)
  const atEnd = step === length - 1

  useEffect(() => {
    if (!playing) return
    if (atEnd) {
      setPlaying(false)
      return
    }
    const t = setTimeout(() => setStep((n) => n + 1), interval)
    return () => clearTimeout(t)
  }, [playing, step, atEnd, interval])

  const pause = () => setPlaying(false)
  return { step, setStep, playing, setPlaying, atEnd, pause, length }
}

// Render inline `code` spans inside narration text.
function renderInline(text) {
  return text.split(/`([^`]+)`/).map((part, i) =>
    i % 2 ? <code key={i}>{part}</code> : <span key={i}>{part}</span>
  )
}

export function StepControls({ s }) {
  const { step, setStep, playing, setPlaying, atEnd, pause, length } = s
  return (
    <div className="a-controls">
      <button onClick={() => { pause(); setStep(0) }} disabled={step === 0 && !playing}>⟲ Reset</button>
      <button onClick={() => { pause(); setStep((n) => Math.max(0, n - 1)) }} disabled={step === 0}>‹ Prev</button>
      {atEnd ? (
        <button className="primary" onClick={() => { setStep(0); setPlaying(true) }}>↻ Replay</button>
      ) : (
        <button className="primary" onClick={() => (playing ? pause() : setPlaying(true))}>
          {playing ? '❚❚ Pause' : '▶ Play'}
        </button>
      )}
      <button onClick={() => { pause(); setStep((n) => Math.min(length - 1, n + 1)) }} disabled={atEnd}>Next ›</button>
    </div>
  )
}

export function StepExplain({ s, title, text }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={s.step}
        className="a-explain"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.25 }}
      >
        <div className="a-explain-head">
          <span className="a-step-num">{s.step + 1} / {s.length}</span>
          <h3>{title}</h3>
        </div>
        <p>{renderInline(text)}</p>
      </motion.div>
    </AnimatePresence>
  )
}

export function CodePanel({ code, active = [] }) {
  const ref = useRef(null)
  useGSAP(
    () => {
      const els = ref.current?.querySelectorAll('.a-line.active')
      if (els && els.length) {
        gsap.fromTo(
          els,
          { backgroundColor: 'rgba(247,223,30,0.32)' },
          { backgroundColor: 'rgba(247,223,30,0.12)', duration: 0.7, ease: 'power2.out' }
        )
      }
    },
    { dependencies: [active.join(',')], scope: ref }
  )
  return (
    <pre className="a-code" ref={ref}>
      {code.map((line, i) => (
        <div key={i} className={`a-line ${active.includes(i) ? 'active' : ''}`}>
          <span className="a-gutter">{i + 1}</span>
          <code>{line || ' '}</code>
        </div>
      ))}
    </pre>
  )
}
