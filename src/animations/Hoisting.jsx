import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, LayoutGroup } from 'motion/react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import './Hoisting.css'

const CODE = [
  'console.log(x);   // ?',
  'greet();          // ?',
  '',
  'var x = 5;',
  "function greet() { console.log('Hi!'); }",
  '',
  'console.log(y);   // ?',
  'let y = 10;',
]

// state: 'undefined' | 'tdz' | 'ƒ' | a literal value string
const M = (x, greet, y) => [
  { name: 'x', kind: 'var', state: x },
  { name: 'greet', kind: 'function', state: greet },
  { name: 'y', kind: 'let', state: y },
]

const STEPS = [
  {
    phase: 'Creation phase',
    lines: [],
    title: 'Creation phase — declarations are hoisted',
    text: "Before any line runs, JS scans the scope. `var x` is created and set to `undefined`. `function greet` is created in full. `let y` is created but left uninitialized — the Temporal Dead Zone.",
    mem: M('undefined', 'ƒ', 'tdz'),
    log: [],
    focus: ['x', 'greet', 'y'],
  },
  {
    phase: 'Execution',
    lines: [0],
    title: 'var is readable before its line',
    text: '`console.log(x)` runs. `x` was hoisted and initialized to `undefined`, so it prints `undefined` — not an error.',
    mem: M('undefined', 'ƒ', 'tdz'),
    log: [{ t: 'undefined' }],
    focus: ['x'],
  },
  {
    phase: 'Execution',
    lines: [1],
    title: 'Function declarations are fully hoisted',
    text: "`greet()` is called on line 2 — before its definition on line 5 — yet it works. The whole function was hoisted, body and all.",
    mem: M('undefined', 'ƒ', 'tdz'),
    log: [{ t: 'undefined' }, { t: 'Hi!' }],
    focus: ['greet'],
  },
  {
    phase: 'Execution',
    lines: [3],
    title: 'Now the assignment actually runs',
    text: 'Execution reaches `var x = 5`. Only at this line does `x` receive the value 5. Hoisting moved the *declaration*, never the assignment.',
    mem: M('5', 'ƒ', 'tdz'),
    log: [{ t: 'undefined' }, { t: 'Hi!' }],
    focus: ['x'],
  },
  {
    phase: 'Execution',
    lines: [6],
    title: 'let in the TDZ throws',
    text: "`console.log(y)` runs before `let y` is initialized. `y` exists but sits in the Temporal Dead Zone, so reading it throws a ReferenceError.",
    mem: M('5', 'ƒ', 'tdz'),
    log: [
      { t: 'undefined' },
      { t: 'Hi!' },
      { t: "ReferenceError: Cannot access 'y' before initialization", err: true },
    ],
    focus: ['y'],
  },
  {
    phase: 'Execution',
    lines: [7],
    title: 'let y is finally initialized',
    text: 'Reaching `let y = 10` would end the TDZ and give `y` its value. (In reality the error above halts the script — shown here so you can see initialization completing the lifecycle.)',
    mem: M('5', 'ƒ', '10'),
    log: [
      { t: 'undefined' },
      { t: 'Hi!' },
      { t: "ReferenceError: Cannot access 'y' before initialization", err: true },
    ],
    focus: ['y'],
  },
]

const KIND_TAG = { var: 'var', function: 'fn', let: 'let' }

function stateView(state) {
  if (state === 'undefined') return { label: 'undefined', cls: 'undef' }
  if (state === 'tdz') return { label: '⛔ TDZ', cls: 'tdz' }
  if (state === 'ƒ') return { label: 'ƒ ()', cls: 'fn' }
  return { label: state, cls: 'value' }
}

function MemRow({ item, focused }) {
  const v = stateView(item.state)
  return (
    <motion.div
      layout
      layoutId={`mem-${item.name}`}
      className={`hs-mem-row ${focused ? 'focused' : ''}`}
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: 'spring', stiffness: 420, damping: 30 }}
    >
      <span className={`hs-mem-kind k-${item.kind}`}>{KIND_TAG[item.kind]}</span>
      <span className="hs-mem-name">{item.name}</span>
      <span className="hs-mem-arrow">→</span>
      <span className={`hs-mem-state s-${v.cls}`}>
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={v.label}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22 }}
          >
            {v.label}
          </motion.span>
        </AnimatePresence>
      </span>
    </motion.div>
  )
}

export default function Hoisting() {
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
      const active = codeRef.current?.querySelectorAll('.hs-line.active')
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
    <div className="hs">
      <div className="hs-grid">
        {/* Code panel */}
        <pre className="hs-code" ref={codeRef}>
          {CODE.map((line, i) => (
            <div key={i} className={`hs-line ${s.lines.includes(i) ? 'active' : ''}`}>
              <span className="hs-gutter">{i + 1}</span>
              <code>{line || ' '}</code>
            </div>
          ))}
        </pre>

        <div className="hs-side">
          {/* Memory / scope */}
          <div className="hs-panel">
            <span className="hs-panel-label">
              Scope memory
              <span className={`hs-phase ${s.phase === 'Creation phase' ? 'create' : 'exec'}`}>
                {s.phase}
              </span>
            </span>
            <LayoutGroup>
              <div className="hs-mem">
                {s.mem.map((item) => (
                  <MemRow key={item.name} item={item} focused={s.focus.includes(item.name)} />
                ))}
              </div>
            </LayoutGroup>
          </div>

          {/* Console */}
          <div className="hs-panel">
            <span className="hs-panel-label">Console</span>
            <div className="hs-console">
              <AnimatePresence initial={false}>
                {s.log.length === 0 ? (
                  <motion.span key="__empty" className="hs-console-empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    (no output yet)
                  </motion.span>
                ) : (
                  s.log.map((l, idx) => (
                    <motion.div
                      key={idx + l.t}
                      className={`hs-log ${l.err ? 'err' : ''}`}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <span className="hs-log-caret">›</span> {l.t}
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Narration */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          className="hs-explain"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
        >
          <div className="hs-explain-head">
            <span className="hs-step-num">{step + 1} / {STEPS.length}</span>
            <h3>{s.title}</h3>
          </div>
          <p>{s.text}</p>
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      <div className="hs-controls">
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
      <div className="hs-cards">
        <div className="hs-card v">
          <h4>var</h4>
          <p>Declaration hoisted and initialized to <code>undefined</code>. Usable before its line (returns <code>undefined</code>), never throws.</p>
        </div>
        <div className="hs-card f">
          <h4>function declaration</h4>
          <p>Hoisted <em>entirely</em> — callable before it appears. (Function <em>expressions</em> assigned to a var are not.)</p>
        </div>
        <div className="hs-card l">
          <h4>let / const</h4>
          <p>Hoisted but uninitialized. Reading them before the declaration throws — the Temporal Dead Zone.</p>
        </div>
      </div>
    </div>
  )
}
