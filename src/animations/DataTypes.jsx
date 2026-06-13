import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, LayoutGroup } from 'motion/react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import './DataTypes.css'

// --- The code we walk through, line by line ---
const CODE = [
  'let a = 5;',
  'let b = a;             // copy the VALUE',
  'b = 10;               // a is untouched',
  '',
  "let user = { name: 'Ada' };",
  'let admin = user;      // copy the REFERENCE',
  "admin.name = 'Grace';  // mutate the shared object",
]

// Stack entries: primitives carry `val`, references carry `ref` (a heap id).
// Heap entries: an id badge + a list of [key, value] props.
const STEPS = [
  {
    lines: [0],
    title: 'A primitive holds its value',
    text: '`let a = 5` stores the number 5 directly inside the variable `a`, on the stack. No indirection.',
    stack: [{ name: 'a', val: '5' }],
    heap: [],
    focus: ['a'],
  },
  {
    lines: [1],
    title: 'Copying a primitive copies the value',
    text: '`let b = a` gives `b` its own independent copy of 5. Two separate boxes that happen to hold the same number.',
    stack: [{ name: 'a', val: '5' }, { name: 'b', val: '5' }],
    heap: [],
    focus: ['b'],
  },
  {
    lines: [2],
    title: 'Primitive copies are independent',
    text: '`b = 10` changes only `b`. `a` is still 5 — they never shared storage. This is "copy by value".',
    stack: [{ name: 'a', val: '5' }, { name: 'b', val: '10' }],
    heap: [],
    focus: ['b'],
  },
  {
    lines: [4],
    title: 'An object lives in the heap',
    text: "`let user = { name: 'Ada' }` creates an object in the heap. `user` only holds a reference (an arrow) to it — not the object itself.",
    stack: [{ name: 'a', val: '5' }, { name: 'b', val: '10' }, { name: 'user', ref: '1' }],
    heap: [{ id: '1', props: [['name', "'Ada'"]] }],
    focus: ['user', 'h1'],
  },
  {
    lines: [5],
    title: 'Copying a reference shares the object',
    text: '`let admin = user` copies the arrow, not the object. Both `user` and `admin` now point to the SAME heap object #1.',
    stack: [
      { name: 'a', val: '5' },
      { name: 'b', val: '10' },
      { name: 'user', ref: '1' },
      { name: 'admin', ref: '1' },
    ],
    heap: [{ id: '1', props: [['name', "'Ada'"]] }],
    focus: ['admin', 'h1'],
  },
  {
    lines: [6],
    title: 'Mutating through one is seen by all',
    text: "`admin.name = 'Grace'` mutates the shared object. Read `user.name` now and it's also 'Grace' — they're the same object.",
    stack: [
      { name: 'a', val: '5' },
      { name: 'b', val: '10' },
      { name: 'user', ref: '1' },
      { name: 'admin', ref: '1' },
    ],
    heap: [{ id: '1', props: [['name', "'Grace'"]] }],
    focus: ['user', 'admin', 'h1'],
  },
]

// Stable color per heap id so a reference chip and its object visually match.
const HEAP_COLORS = ['#5eead4', '#fca5a5', '#fcd34d', '#c4b5fd']
const heapColor = (id) => HEAP_COLORS[(Number(id) - 1) % HEAP_COLORS.length]

const chipSpring = { type: 'spring', stiffness: 460, damping: 30 }

function StackItem({ item, focused }) {
  const isRef = item.ref != null
  const color = isRef ? heapColor(item.ref) : undefined
  return (
    <motion.div
      layout
      layoutId={`stack-${item.name}`}
      className={`dt-cell ${isRef ? 'is-ref' : 'is-prim'} ${focused ? 'focused' : ''}`}
      style={isRef ? { borderColor: color } : undefined}
      initial={{ opacity: 0, y: 10, scale: 0.85 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={chipSpring}
    >
      <span className="dt-cell-name">{item.name}</span>
      {isRef ? (
        <span className="dt-cell-ref" style={{ color }}>
          → #{item.ref}
        </span>
      ) : (
        <span className="dt-cell-val">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={item.val}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22 }}
            >
              {item.val}
            </motion.span>
          </AnimatePresence>
        </span>
      )}
    </motion.div>
  )
}

function HeapObject({ obj, focused }) {
  const color = heapColor(obj.id)
  return (
    <motion.div
      layout
      layoutId={`heap-${obj.id}`}
      className={`dt-heap-obj ${focused ? 'focused' : ''}`}
      style={{ borderColor: color }}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={chipSpring}
    >
      <span className="dt-heap-badge" style={{ background: color }}>
        #{obj.id}
      </span>
      <div className="dt-heap-props">
        {obj.props.map(([k, v]) => (
          <div key={k} className="dt-heap-prop">
            <span className="dt-prop-key">{k}:</span>
            <span className="dt-prop-val">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={v}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                >
                  {v}
                </motion.span>
              </AnimatePresence>
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

export default function DataTypes() {
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
    const t = setTimeout(() => setStep((n) => n + 1), 2600)
    return () => clearTimeout(t)
  }, [playing, step, atEnd])

  const pause = () => setPlaying(false)

  // GSAP: flash the active code line(s) on each step change.
  useGSAP(
    () => {
      const active = codeRef.current?.querySelectorAll('.dt-line.active')
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
    <div className="dt">
      <div className="dt-grid">
        {/* Code panel */}
        <pre className="dt-code" ref={codeRef}>
          {CODE.map((line, i) => (
            <div key={i} className={`dt-line ${s.lines.includes(i) ? 'active' : ''}`}>
              <span className="dt-gutter">{i + 1}</span>
              <code>{line || ' '}</code>
            </div>
          ))}
        </pre>

        {/* Memory: stack + heap */}
        <LayoutGroup>
          <div className="dt-memory">
            <div className="dt-region">
              <span className="dt-region-label">Stack</span>
              <div className="dt-region-body">
                <AnimatePresence mode="popLayout">
                  {s.stack.map((item) => (
                    <StackItem key={item.name} item={item} focused={s.focus.includes(item.name)} />
                  ))}
                </AnimatePresence>
              </div>
            </div>

            <div className="dt-region heap">
              <span className="dt-region-label">Heap</span>
              <div className="dt-region-body">
                <AnimatePresence mode="popLayout">
                  {s.heap.length === 0 ? (
                    <motion.span
                      key="__empty"
                      className="dt-region-empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      empty
                    </motion.span>
                  ) : (
                    s.heap.map((obj) => (
                      <HeapObject key={obj.id} obj={obj} focused={s.focus.includes(`h${obj.id}`)} />
                    ))
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </LayoutGroup>
      </div>

      {/* Narration */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          className="dt-explain"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
        >
          <div className="dt-explain-head">
            <span className="dt-step-num">{step + 1} / {STEPS.length}</span>
            <h3>{s.title}</h3>
          </div>
          <p>{s.text}</p>
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      <div className="dt-controls">
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

      {/* Reference cards */}
      <div className="dt-cards">
        <div className="dt-card prim">
          <h4>Primitives — copied by value</h4>
          <p><code>string</code>, <code>number</code>, <code>boolean</code>, <code>null</code>, <code>undefined</code>, <code>symbol</code>, <code>bigint</code>. Immutable; each copy is independent.</p>
        </div>
        <div className="dt-card ref">
          <h4>References — copied by reference</h4>
          <p><code>object</code>, <code>array</code>, <code>function</code>. Live in the heap; copies share one object, so mutations are visible everywhere.</p>
        </div>
        <div className="dt-card gotcha">
          <h4>Function arguments</h4>
          <p>Primitives are passed by value (safe). Objects are passed by reference — mutating a parameter's properties leaks out to the caller.</p>
        </div>
      </div>

      <div className="dt-example">
        <h4>Quick example</h4>
        <pre>
{`let a = 1, b = a;  b++;        // a === 1  (independent copies)
const o = { v: 1 }, p = o; p.v++; // o.v === 2  (shared object)

[1, 2] === [1, 2]   // false — two different references
NaN === NaN         // false — the famous primitive quirk`}
        </pre>
      </div>
    </div>
  )
}
