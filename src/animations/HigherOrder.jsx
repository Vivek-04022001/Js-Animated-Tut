import { motion, AnimatePresence } from 'motion/react'
import { useStepper, StepControls, StepExplain } from './stepKit.jsx'
import './HigherOrder.css'

const SOURCE = [1, 2, 3, 4]

const STEPS = [
  {
    title: 'Start with an array',
    text: 'Higher-order functions take a function as an argument. We will run three of them over `[1, 2, 3, 4]`.',
    expr: 'const nums = [1, 2, 3, 4]',
    items: SOURCE.map((n) => ({ key: n, val: n })),
    out: null,
  },
  {
    title: 'map — transform every element',
    text: '`nums.map(n => n * 2)` returns a *new* array where each element is doubled. Same length, every item transformed.',
    expr: 'nums.map(n => n * 2)',
    items: SOURCE.map((n) => ({ key: n, val: n, to: n * 2 })),
    out: SOURCE.map((n) => n * 2),
  },
  {
    title: 'filter — keep some elements',
    text: '`nums.filter(n => n % 2 === 0)` keeps only items where the test is true. The odds are dropped; the array can shrink.',
    expr: 'nums.filter(n => n % 2 === 0)',
    items: SOURCE.map((n) => ({ key: n, val: n, keep: n % 2 === 0 })),
    out: SOURCE.filter((n) => n % 2 === 0),
  },
  {
    title: 'reduce — collapse to one value',
    text: '`nums.reduce((sum, n) => sum + n, 0)` folds the array into a single value by accumulating — here, the total 10.',
    expr: 'nums.reduce((sum, n) => sum + n, 0)',
    items: SOURCE.map((n) => ({ key: n, val: n })),
    out: SOURCE.reduce((a, n) => a + n, 0),
    reduce: true,
  },
]

export default function HigherOrder() {
  const s = useStepper(STEPS.length, 3200)
  const st = STEPS[s.step]
  return (
    <div className="a-wrap">
      <div className="a-panel ho-panel">
        <span className="a-panel-label">{st.expr}</span>

        <div className="ho-row">
          {st.items.map((it) => (
            <motion.div
              key={it.key}
              layout
              className={`ho-cell ${it.keep === false ? 'dropped' : ''}`}
              animate={{ opacity: it.keep === false ? 0.25 : 1, scale: 1 }}
            >
              <span className="ho-val">{it.val}</span>
              {it.to != null && (
                <motion.span className="ho-to" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                  →{it.to}
                </motion.span>
              )}
            </motion.div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {st.out != null && (
            <motion.div
              key={s.step}
              className="ho-out"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.3 }}
            >
              <span className="ho-out-label">result</span>
              <span className="ho-out-val">
                {st.reduce ? st.out : `[ ${[].concat(st.out).join(', ')} ]`}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <StepExplain s={s} title={st.title} text={st.text} />
      <StepControls s={s} />

      <div className="a-cards">
        <div className="a-card" style={{ borderTopColor: '#93c5fd' }}>
          <h4>map</h4>
          <p>1 → 1 mapping. Returns a new array of the same length with each item transformed. Never mutates the original.</p>
        </div>
        <div className="a-card" style={{ borderTopColor: '#5eead4' }}>
          <h4>filter</h4>
          <p>Keeps items whose callback returns truthy. Result is the same length or shorter.</p>
        </div>
        <div className="a-card" style={{ borderTopColor: '#fcd34d' }}>
          <h4>reduce</h4>
          <p>Folds many values into one using an accumulator. The Swiss-army knife — map and filter can both be built from it.</p>
        </div>
      </div>

      <div className="a-example">
        <h4>Chaining</h4>
        <pre>
{`[1, 2, 3, 4, 5]
  .filter(n => n % 2)      // [1, 3, 5]
  .map(n => n * n)         // [1, 9, 25]
  .reduce((a, b) => a + b) // 35`}
        </pre>
      </div>
    </div>
  )
}
