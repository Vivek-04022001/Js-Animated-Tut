import { motion, AnimatePresence } from 'motion/react'
import { useStepper, StepControls, StepExplain, CodePanel } from './stepKit.jsx'
import './Currying.css'

const CODE = [
  'const add = a => b => c => a + b + c;',
  '',
  'add(1)(2)(3); // 6',
  '',
  '// partial application:',
  'const add5 = add(5);',
  'add5(10)(20);  // 35',
]

const STEPS = [
  {
    lines: [0],
    title: 'A curried function',
    text: '`add` takes one argument and returns a function that takes the next, and so on. One arg per call instead of all at once.',
    collected: [],
    pending: 'b => c => …',
    done: null,
  },
  {
    lines: [2],
    title: 'add(1) — collect the first arg',
    text: '`add(1)` runs and returns a new function. The `1` is captured in a closure, waiting for the rest.',
    collected: [1],
    pending: 'c => …',
    done: null,
  },
  {
    lines: [2],
    title: 'add(1)(2) — collect the second',
    text: 'Calling the returned function with `2` captures it too, and returns the final function still waiting for `c`.',
    collected: [1, 2],
    pending: 'c => …',
    done: null,
  },
  {
    lines: [2],
    title: 'add(1)(2)(3) — final call resolves',
    text: 'The last call supplies `3`. Now all three args are known, so the body runs: `1 + 2 + 3` → 6.',
    collected: [1, 2, 3],
    pending: null,
    done: 6,
  },
]

export default function Currying() {
  const s = useStepper(STEPS.length, 2800)
  const st = STEPS[s.step]
  return (
    <div className="a-wrap">
      <div className="a-grid">
        <CodePanel code={CODE} active={st.lines} />

        <div className="a-panel">
          <span className="a-panel-label">Collecting arguments</span>
          <div className="cu-slots">
            {['a', 'b', 'c'].map((name, i) => {
              const v = st.collected[i]
              const filled = v != null
              return (
                <div key={name} className={`cu-slot ${filled ? 'filled' : ''}`}>
                  <span className="cu-slot-name">{name}</span>
                  <AnimatePresence mode="popLayout">
                    {filled && (
                      <motion.span
                        key={v}
                        className="cu-slot-val"
                        initial={{ opacity: 0, scale: 0.5, y: 8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 480, damping: 22 }}
                      >
                        {v}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>

          <AnimatePresence mode="wait">
            {st.pending ? (
              <motion.div key="p" className="cu-pending" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                returns <code>{st.pending}</code>
              </motion.div>
            ) : (
              <motion.div key="d" className="cu-done" initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}>
                {st.collected.join(' + ')} = <strong>{st.done}</strong>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <StepExplain s={s} title={st.title} text={st.text} />
      <StepControls s={s} />

      <div className="a-cards">
        <div className="a-card" style={{ borderTopColor: '#93c5fd' }}>
          <h4>Currying</h4>
          <p>Turning <code>f(a, b, c)</code> into <code>f(a)(b)(c)</code> — a chain of one-argument functions, each closing over the previous arg.</p>
        </div>
        <div className="a-card" style={{ borderTopColor: '#86efac' }}>
          <h4>Partial application</h4>
          <p>Fix some args now, supply the rest later: <code>const add5 = add(5)</code>. Great for making specialized functions.</p>
        </div>
        <div className="a-card" style={{ borderTopColor: '#fcd34d' }}>
          <h4>Why use it</h4>
          <p>Reusable, configurable helpers and clean point-free composition in functional pipelines.</p>
        </div>
      </div>
    </div>
  )
}
