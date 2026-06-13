import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, LayoutGroup } from 'motion/react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import './VariablesScoping.css'

// --- Variable metadata (kind + value), referenced by the steps below ---
const VARS = {
  x: { kind: 'var', value: '1' },
  y: { kind: 'let', value: '2' },
  a: { kind: 'var', value: '10' },
  b: { kind: 'var', value: '20' },
  c: { kind: 'let', value: '30' },
  d: { kind: 'const', value: '40' },
}

// --- The code we walk through, line by line ---
const CODE = [
  'var x = 1;',
  'let y = 2;',
  '',
  'function demo() {',
  '  var a = 10;',
  '  if (true) {',
  '    var b = 20;   // function-scoped',
  '    let c = 30;   // block-scoped',
  '    const d = 40; // block-scoped',
  '  }',
  '  console.log(b); // 20  ✓',
  '  // c, d here → ReferenceError ✗',
  '}',
  '',
  'demo();',
]

// --- Each step = which lines are active, the narration, and the live
//     scope contents (null scope = it doesn't exist yet / destroyed). ---
const STEPS = [
  {
    lines: [0, 1],
    title: 'Global scope is created',
    text: 'When the script runs, a global scope exists. `var x` and `let y` are declared here, so both live in the global scope.',
    global: ['x', 'y'],
    fn: null,
    block: null,
    focus: ['x', 'y'],
  },
  {
    lines: [14, 3],
    title: 'demo() is called → function scope',
    text: 'Calling `demo()` creates a brand-new function scope. It starts empty and sits inside the global scope.',
    global: ['x', 'y'],
    fn: [],
    block: null,
    focus: [],
  },
  {
    lines: [4],
    title: 'var a lives in the function scope',
    text: '`var a = 10` is declared inside the function, so it belongs to the function scope.',
    global: ['x', 'y'],
    fn: ['a'],
    block: null,
    focus: ['a'],
  },
  {
    lines: [5],
    title: 'Entering the if-block → block scope',
    text: 'The `{ }` of the `if` statement opens a block scope. This is where `let` and `const` will be confined.',
    global: ['x', 'y'],
    fn: ['a'],
    block: [],
    focus: [],
  },
  {
    lines: [6],
    title: 'var IGNORES the block!',
    text: 'Even though `var b` is written inside the block, `var` is function-scoped. It "escapes" the block and attaches to the function scope alongside `a`.',
    global: ['x', 'y'],
    fn: ['a', 'b'],
    block: [],
    focus: ['b'],
  },
  {
    lines: [7, 8],
    title: 'let and const stay in the block',
    text: '`let c` and `const d` respect the block. They live in the block scope and cannot be seen from outside it.',
    global: ['x', 'y'],
    fn: ['a', 'b'],
    block: ['c', 'd'],
    focus: ['c', 'd'],
  },
  {
    lines: [9],
    title: 'Block ends → block scope destroyed',
    text: 'The block closes. Its scope is thrown away, taking `c` and `d` with it. But `b` survives — it was never in the block.',
    global: ['x', 'y'],
    fn: ['a', 'b'],
    block: null,
    focus: ['b'],
  },
  {
    lines: [10, 11],
    title: 'Accessing variables after the block',
    text: '`console.log(b)` prints 20 — `b` is still in the function scope. Trying to read `c` or `d` now throws a ReferenceError: they no longer exist.',
    global: ['x', 'y'],
    fn: ['a', 'b'],
    block: null,
    focus: ['b'],
  },
]

const KIND_LABEL = { var: 'var', let: 'let', const: 'const' }

const chipTransition = { type: 'spring', stiffness: 480, damping: 32 }

/* ---------- Inline SVG illustrations (inherit currentColor) ---------- */
const Icon = {
  globe: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18" />
    </svg>
  ),
  func: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 4h-1.5A2.5 2.5 0 0 0 10 6.5V9M7 13h6" />
      <path d="M10 9v8.5A2.5 2.5 0 0 1 7.5 20H6" />
    </svg>
  ),
  braces: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 4c-2 0-2 2-2 4s0 3-2 4c2 1 2 2 2 4s0 4 2 4" />
      <path d="M16 4c2 0 2 2 2 4s0 3 2 4c-2 1-2 2-2 4s0 4-2 4" />
    </svg>
  ),
  recycle: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 7l2-3 3 1M5 14l-1.5 3 3 1.5M19 11l1.5 3-3 1.5" />
      <path d="M9 4l4 7M4.5 17h8M20 14.5l-4 7" />
    </svg>
  ),
  pencil: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 5l4 4L8 20H4v-4L15 5z" />
      <path d="M13.5 6.5l4 4" />
    </svg>
  ),
  lock: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  ),
}

const KIND_ICON = { var: Icon.recycle, let: Icon.pencil, const: Icon.lock }
const KIND_TAGLINE = {
  var: 'Function-scoped • reassignable',
  let: 'Block-scoped • reassignable',
  const: 'Block-scoped • locked',
}

function Chip({ name, focused }) {
  const v = VARS[name]
  return (
    <motion.div
      layout
      layoutId={`chip-${name}`}
      className={`vs-chip kind-${v.kind} ${focused ? 'focused' : ''}`}
      initial={{ opacity: 0, scale: 0.7, y: 10 }}
      animate={{
        opacity: 1,
        scale: 1,
        y: 0,
        boxShadow: focused
          ? '0 0 0 2px rgba(247,223,30,0.55)'
          : '0 0 0 0px rgba(247,223,30,0)',
      }}
      exit={{ opacity: 0, scale: 0.6, y: -10 }}
      transition={chipTransition}
    >
      <span className="vs-chip-kind">{KIND_LABEL[v.kind]}</span>
      <span className="vs-chip-name">{name}</span>
      <span className="vs-chip-eq">=</span>
      <span className="vs-chip-val">{v.value}</span>
    </motion.div>
  )
}

// Animated scope container that grows/shrinks as it is created/destroyed.
// Note: we animate opacity only (not scale) — `layout` already animates the
// size change, and mixing a manual scale transform distorts the children.
const scopeMotion = {
  layout: true,
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { type: 'spring', stiffness: 320, damping: 30 },
}

function ScopeBody({ vars, focus, showEmpty }) {
  return (
    <div className="vs-scope-body">
      <AnimatePresence mode="popLayout">
        {vars.length === 0 && showEmpty && (
          <motion.span
            key="__empty"
            className="vs-scope-empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            empty
          </motion.span>
        )}
        {vars.map((name) => (
          <Chip key={name} name={name} focused={focus.includes(name)} />
        ))}
      </AnimatePresence>
    </div>
  )
}

function NestedScopes({ s }) {
  return (
    <div className="vs-nested">
      <LayoutGroup>
        <motion.div layout className="vs-scope tone-global">
          <span className="vs-scope-label"><span className="vs-scope-ico">{Icon.globe}</span>Global scope</span>
          <div className="vs-scope-body">
            <AnimatePresence mode="popLayout">
              {s.global.map((name) => (
                <Chip key={name} name={name} focused={s.focus.includes(name)} />
              ))}
            </AnimatePresence>

            <AnimatePresence>
              {s.fn !== null && (
                <motion.div key="fn-scope" className="vs-scope tone-fn" {...scopeMotion}>
                  <span className="vs-scope-label"><span className="vs-scope-ico">{Icon.func}</span>demo() — function scope</span>
                  <div className="vs-scope-body">
                    <AnimatePresence mode="popLayout">
                      {s.fn.map((name) => (
                        <Chip key={name} name={name} focused={s.focus.includes(name)} />
                      ))}
                    </AnimatePresence>

                    <AnimatePresence>
                      {s.block !== null && (
                        <motion.div key="block-scope" className="vs-scope tone-block" {...scopeMotion}>
                          <span className="vs-scope-label"><span className="vs-scope-ico">{Icon.braces}</span>if (true) — block scope</span>
                          <ScopeBody vars={s.block} focus={s.focus} showEmpty />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {s.fn.length === 0 && s.block === null && (
                      <span className="vs-scope-empty">empty</span>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </LayoutGroup>
    </div>
  )
}

export default function VariablesScoping() {
  const [step, setStep] = useState(0)
  const [playing, setPlaying] = useState(false)
  const codeRef = useRef(null)

  const s = STEPS[step]
  const atEnd = step === STEPS.length - 1

  // Auto-advance while playing; stop at the end.
  useEffect(() => {
    if (!playing) return
    if (atEnd) {
      setPlaying(false)
      return
    }
    const t = setTimeout(() => setStep((n) => n + 1), 2300)
    return () => clearTimeout(t)
  }, [playing, step, atEnd])

  const pause = () => setPlaying(false)

  // GSAP: flash the active code line(s) on each step change.
  useGSAP(
    () => {
      const active = codeRef.current?.querySelectorAll('.vs-line.active')
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
    <div className="vs">
      {/* Illustrated legend — the three keyword "personalities" */}
      <div className="vs-legend">
        {['var', 'let', 'const'].map((k) => (
          <div key={k} className={`vs-legend-item kind-${k}`}>
            <span className="vs-legend-ico">{KIND_ICON[k]}</span>
            <span className="vs-legend-text">
              <strong>{k}</strong>
              <small>{KIND_TAGLINE[k]}</small>
            </span>
          </div>
        ))}
      </div>

      <div className="vs-grid">
        {/* Code panel */}
        <pre className="vs-code" ref={codeRef}>
          {CODE.map((line, i) => (
            <div
              key={i}
              className={`vs-line ${s.lines.includes(i) ? 'active' : ''}`}
            >
              <span className="vs-gutter">{i + 1}</span>
              <code>{line || ' '}</code>
            </div>
          ))}
        </pre>

        {/* Scope visualization — truly nested boxes, animated */}
        <NestedScopes s={s} />
      </div>

      {/* Narration */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          className="vs-explain"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
        >
          <div className="vs-explain-head">
            <span className="vs-step-num">
              {step + 1} / {STEPS.length}
            </span>
            <h3>{s.title}</h3>
          </div>
          <p>{s.text}</p>
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      <div className="vs-controls">
        <button onClick={() => { pause(); setStep(0) }} disabled={step === 0 && !playing}>
          ⟲ Reset
        </button>
        <button onClick={() => { pause(); setStep((n) => Math.max(0, n - 1)) }} disabled={step === 0}>
          ‹ Prev
        </button>
        {atEnd ? (
          <button className="primary" onClick={() => { setStep(0); setPlaying(true) }}>
            ↻ Replay
          </button>
        ) : (
          <button className="primary" onClick={() => (playing ? pause() : setPlaying(true))}>
            {playing ? '❚❚ Pause' : '▶ Play'}
          </button>
        )}
        <button onClick={() => { pause(); setStep((n) => Math.min(STEPS.length - 1, n + 1)) }} disabled={atEnd}>
          Next ›
        </button>
      </div>

      {/* Static reference: examples & takeaways */}
      <div className="vs-cards">
        <div className="vs-card kind-var">
          <h4><span className="vs-card-ico">{Icon.recycle}</span> var</h4>
          <p>Function-scoped. Hoisted and initialized as <code>undefined</code>. Can be redeclared and reassigned. Ignores <code>{'{ }'}</code> blocks.</p>
        </div>
        <div className="vs-card kind-let">
          <h4><span className="vs-card-ico">{Icon.pencil}</span> let</h4>
          <p>Block-scoped. Can be reassigned but not redeclared in the same scope. Lives only inside its nearest <code>{'{ }'}</code>.</p>
        </div>
        <div className="vs-card kind-const">
          <h4><span className="vs-card-ico">{Icon.lock}</span> const</h4>
          <p>Block-scoped like <code>let</code>, but cannot be reassigned. Note: object/array <em>contents</em> can still change.</p>
        </div>
      </div>

      <div className="vs-example">
        <h4>Quick example</h4>
        <pre>
{`const user = { name: 'Ada' };
user.name = 'Grace';   // ✅ allowed — mutating contents
// user = {};          // ❌ TypeError — reassigning a const

for (let i = 0; i < 3; i++) { /* i is fresh each loop */ }
// console.log(i);     // ❌ ReferenceError — i was block-scoped`}
        </pre>
      </div>
    </div>
  )
}
