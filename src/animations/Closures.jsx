import { motion, AnimatePresence } from 'motion/react'
import { useStepper, StepControls, StepExplain, CodePanel } from './stepKit.jsx'
import './Closures.css'

const CODE = [
  'function makeCounter() {',
  '  let count = 0;',
  '  return function () {',
  '    count++;',
  '    return count;',
  '  };',
  '}',
  '',
  'const counter = makeCounter();',
  'counter(); // 1',
  'counter(); // 2',
]

const STEPS = [
  {
    lines: [8],
    title: 'A factory creates a private variable',
    text: '`makeCounter()` runs, creating a local `count = 0`. It returns the inner function. Normally `count` would be discarded now — but it is not.',
    count: 0,
    closed: true,
    log: [],
  },
  {
    lines: [2, 5],
    title: 'The returned function closes over count',
    text: 'The inner function keeps a reference to `count`. This bundle of function + remembered variables is the *closure* — its private backpack.',
    count: 0,
    closed: true,
    log: [],
  },
  {
    lines: [9],
    title: 'First call remembers the state',
    text: '`counter()` increments the captured `count` to 1 and returns it. The variable lives on between calls, hidden from the outside.',
    count: 1,
    closed: true,
    log: [{ t: '1' }],
  },
  {
    lines: [10],
    title: 'State persists across calls',
    text: 'Calling again continues from where it left off → 2. Each closure keeps its *own* independent `count`; a second `makeCounter()` would start fresh at 0.',
    count: 2,
    closed: true,
    log: [{ t: '1' }, { t: '2' }],
  },
]

export default function Closures() {
  const s = useStepper(STEPS.length, 3000)
  const st = STEPS[s.step]
  return (
    <div className="a-wrap">
      <div className="a-grid">
        <CodePanel code={CODE} active={st.lines} />

        <div className="a-panel">
          <span className="a-panel-label">The closure</span>
          <div className="cl-stage">
            <div className="cl-fn">
              <span className="cl-fn-title">counter()</span>
              <div className="cl-backpack">
                <span className="cl-backpack-label">🎒 closed-over scope</span>
                <div className="cl-var">
                  <code>count</code>
                  <span className="cl-eq">=</span>
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span
                      key={st.count}
                      className="cl-count"
                      initial={{ opacity: 0, y: 10, scale: 0.7 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ type: 'spring', stiffness: 460, damping: 24 }}
                    >
                      {st.count}
                    </motion.span>
                  </AnimatePresence>
                </div>
              </div>
            </div>

            <div className="a-console cl-console">
              {st.log.length === 0 ? (
                <span className="a-console-empty">(no calls yet)</span>
              ) : (
                st.log.map((l, i) => (
                  <motion.div key={i} className="a-log" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}>
                    <span className="a-log-caret">›</span> counter() → {l.t}
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <StepExplain s={s} title={st.title} text={st.text} />
      <StepControls s={s} />

      <div className="a-cards">
        <div className="a-card" style={{ borderTopColor: '#86efac' }}>
          <h4>What is a closure?</h4>
          <p>A function plus the variables it captured from where it was defined. The captured scope survives as long as the function does.</p>
        </div>
        <div className="a-card" style={{ borderTopColor: '#93c5fd' }}>
          <h4>Why it matters</h4>
          <p>Powers private state, function factories, memoization, event handlers, and the module pattern — data hiding without classes.</p>
        </div>
        <div className="a-card" style={{ borderTopColor: '#fcd34d' }}>
          <h4>Classic gotcha</h4>
          <p><code>var</code> in a loop shares one binding across closures; <code>let</code> creates a fresh one per iteration — the usual fix.</p>
        </div>
      </div>
    </div>
  )
}
