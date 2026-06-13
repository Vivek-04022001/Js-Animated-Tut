import { motion, AnimatePresence } from 'motion/react'
import { useStepper, StepControls, StepExplain, CodePanel } from './stepKit.jsx'
import './Recursion.css'

const CODE = [
  'function fact(n) {',
  '  if (n === 1) return 1;   // base case',
  '  return n * fact(n - 1);  // recursive case',
  '}',
  'fact(3);',
]

// Each step: the live stack (bottom→top) and an optional returned value.
const STEPS = [
  {
    lines: [4],
    title: 'Call fact(3)',
    text: '`fact(3)` is pushed onto the call stack. It needs `fact(2)` before it can multiply, so it pauses and calls down.',
    stack: [{ n: 3 }],
    phase: 'push',
  },
  {
    lines: [2],
    title: 'fact(3) calls fact(2)',
    text: 'A new frame `fact(2)` is pushed on top. It in turn needs `fact(1)`. The stack grows downward into the recursion.',
    stack: [{ n: 3 }, { n: 2 }],
    phase: 'push',
  },
  {
    lines: [2],
    title: 'fact(2) calls fact(1)',
    text: '`fact(1)` is pushed. This one hits the *base case* — it can return immediately without recursing further.',
    stack: [{ n: 3 }, { n: 2 }, { n: 1 }],
    phase: 'push',
  },
  {
    lines: [1],
    title: 'Base case returns 1',
    text: '`fact(1)` returns 1 and its frame pops off the stack. The result flows back up to the waiting `fact(2)`.',
    stack: [{ n: 3 }, { n: 2, ret: 1 }],
    phase: 'pop',
    popped: '1',
  },
  {
    lines: [2],
    title: 'fact(2) resolves: 2 × 1 = 2',
    text: '`fact(2)` now has its value: `2 * 1 = 2`. It returns 2 and pops, handing the result up to `fact(3)`.',
    stack: [{ n: 3, ret: 2 }],
    phase: 'pop',
    popped: '2',
  },
  {
    lines: [2],
    title: 'fact(3) resolves: 3 × 2 = 6',
    text: 'The last frame computes `3 * 2 = 6` and pops. The stack is empty and `fact(3)` evaluates to 6.',
    stack: [],
    phase: 'pop',
    popped: '6',
    final: 6,
  },
]

export default function Recursion() {
  const s = useStepper(STEPS.length, 2800)
  const st = STEPS[s.step]
  return (
    <div className="a-wrap">
      <div className="a-grid">
        <CodePanel code={CODE} active={st.lines} />

        <div className="a-panel rc-panel">
          <span className="a-panel-label">Call stack</span>
          <div className="rc-stack">
            <AnimatePresence mode="popLayout">
              {st.stack.length === 0 ? (
                <motion.div key="empty" className="rc-empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  stack empty
                </motion.div>
              ) : (
                // Render top frame first (visually stacked from top).
                [...st.stack].reverse().map((f) => (
                  <motion.div
                    key={f.n}
                    layout
                    className={`rc-frame ${f.ret != null ? 'resolved' : ''}`}
                    initial={{ opacity: 0, y: -16, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 40, scale: 0.85 }}
                    transition={{ type: 'spring', stiffness: 420, damping: 28 }}
                  >
                    <code>fact({f.n})</code>
                    {f.ret != null && <span className="rc-ret">waiting → {f.n} × {f.ret}</span>}
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {st.popped && (
              <motion.div
                key={s.step}
                className={`rc-return ${st.final != null ? 'final' : ''}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                {st.final != null ? `fact(3) === ${st.final}` : `↑ returns ${st.popped}`}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <StepExplain s={s} title={st.title} text={st.text} />
      <StepControls s={s} />

      <div className="a-cards">
        <div className="a-card" style={{ borderTopColor: '#fca5a5' }}>
          <h4>Base case</h4>
          <p>The stop condition that returns without recursing. Forget it and the stack grows forever → <code>RangeError: Maximum call stack size exceeded</code>.</p>
        </div>
        <div className="a-card" style={{ borderTopColor: '#93c5fd' }}>
          <h4>Recursive case</h4>
          <p>Each call solves a smaller subproblem and combines it. Frames pause on the stack until the deeper calls return.</p>
        </div>
        <div className="a-card" style={{ borderTopColor: '#fcd34d' }}>
          <h4>Stack frames</h4>
          <p>Every call gets its own frame with its own `n`. They unwind in reverse (LIFO) as values bubble back up.</p>
        </div>
      </div>
    </div>
  )
}
