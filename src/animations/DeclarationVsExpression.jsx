import { motion, AnimatePresence } from 'motion/react'
import { useStepper, StepControls, StepExplain, CodePanel } from './stepKit.jsx'

const CODE = [
  'sayHi();        // ✅ works',
  'sayBye();       // ❌ error',
  '',
  'function sayHi() {        // DECLARATION',
  "  console.log('Hi!');",
  '}',
  '',
  'const sayBye = function () {  // EXPRESSION',
  "  console.log('Bye!');",
  '}',
]

const STEPS = [
  {
    lines: [3, 7],
    title: 'Two ways to define a function',
    text: '`function sayHi()` is a *declaration*. `const sayBye = function(){}` is a function *expression* assigned to a variable. They look similar but hoist very differently.',
    log: [],
  },
  {
    lines: [0],
    title: 'Declarations are fully hoisted',
    text: '`sayHi()` is called on line 1 — before its definition — and works. The whole declaration was hoisted to the top of the scope.',
    log: [{ t: 'Hi!' }],
  },
  {
    lines: [1],
    title: 'Expressions are not',
    text: "`sayBye` is a `const`, so it's hoisted but uninitialized (TDZ). Calling it before line 8 throws `ReferenceError`. (With `var` it'd be `undefined` → TypeError instead.)",
    log: [{ t: 'Hi!' }, { t: "ReferenceError: Cannot access 'sayBye' before initialization", err: true }],
  },
]

export default function DeclarationVsExpression() {
  const s = useStepper(STEPS.length)
  const st = STEPS[s.step]
  return (
    <div className="a-wrap">
      <div className="a-grid">
        <CodePanel code={CODE} active={st.lines} />
        <div className="a-panel">
          <span className="a-panel-label">Console</span>
          <div className="a-console">
            <AnimatePresence initial={false}>
              {st.log.length === 0 ? (
                <motion.span key="e" className="a-console-empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  (run order: top to bottom)
                </motion.span>
              ) : (
                st.log.map((l, i) => (
                  <motion.div key={i + l.t} className={`a-log ${l.err ? 'err' : ''}`} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25 }}>
                    <span className="a-log-caret">›</span> {l.t}
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <StepExplain s={s} title={st.title} text={st.text} />
      <StepControls s={s} />

      <div className="a-cards">
        <div className="a-card" style={{ borderTopColor: '#93c5fd' }}>
          <h4>Declaration</h4>
          <p><code>function f(){}</code> — hoisted whole, callable anywhere in scope. Best for top-level named helpers.</p>
        </div>
        <div className="a-card" style={{ borderTopColor: '#fcd34d' }}>
          <h4>Expression</h4>
          <p><code>const f = function(){}</code> or <code>{'() => {}'}</code>. Defined where it sits; only usable after that line. Great for callbacks &amp; conditional definitions.</p>
        </div>
        <div className="a-card" style={{ borderTopColor: '#86efac' }}>
          <h4>Named expression</h4>
          <p><code>const f = function inner(){}</code> — the inner name is visible only inside the function, handy for recursion &amp; stack traces.</p>
        </div>
      </div>
    </div>
  )
}
