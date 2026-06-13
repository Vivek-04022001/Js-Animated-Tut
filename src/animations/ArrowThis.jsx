import { motion, AnimatePresence } from 'motion/react'
import { useStepper, StepControls, StepExplain, CodePanel } from './stepKit.jsx'
import './ArrowThis.css'

const CODE = [
  'const timer = {',
  '  label: "⏱",',
  '  startRegular() {',
  '    setTimeout(function () {',
  '      console.log(this.label); // ?',
  '    }, 0);',
  '  },',
  '  startArrow() {',
  '    setTimeout(() => {',
  '      console.log(this.label); // ?',
  '    }, 0);',
  '  },',
  '};',
]

const STEPS = [
  {
    lines: [2],
    title: 'A method is called on the object',
    text: '`timer.startRegular()` runs. Inside the method, `this` correctly points to the `timer` object.',
    bind: 'timer',
    kind: 'method',
  },
  {
    lines: [3, 4],
    title: 'A regular function gets its own this',
    text: 'The callback passed to `setTimeout` is a *regular* function. When the timer fires, it is called with no owner — so `this` is `undefined` (strict) or the global object, not `timer`.',
    bind: 'global',
    kind: 'regular',
  },
  {
    lines: [8, 9],
    title: 'An arrow function inherits this',
    text: 'The arrow callback has no `this` of its own. It uses the `this` of the surrounding `startArrow` method — which is `timer`. So `this.label` works as expected.',
    bind: 'timer',
    kind: 'arrow',
  },
]

function ThisBox({ bind, kind }) {
  const toTimer = bind === 'timer'
  return (
    <div className="at-stage">
      <div className={`at-node fn ${kind}`}>
        <span className="at-node-label">
          {kind === 'method' && 'method'}
          {kind === 'regular' && 'regular fn callback'}
          {kind === 'arrow' && 'arrow callback'}
        </span>
        <code>this</code>
      </div>

      <svg className="at-arrow" viewBox="0 0 200 60" preserveAspectRatio="none">
        <motion.line
          x1="10" y1="30"
          x2="190"
          y2={toTimer ? 30 : 56}
          stroke={toTimer ? '#86efac' : '#fca5a5'}
          strokeWidth="2.5"
          strokeDasharray="6 5"
          animate={{ y2: toTimer ? 30 : 56 }}
          transition={{ type: 'spring', stiffness: 200, damping: 24 }}
        />
      </svg>

      <div className="at-targets">
        <div className={`at-node target ${toTimer ? 'hit' : ''}`}>
          <span className="at-node-label">timer object</span>
          <code>{'{ label: "⏱" }'}</code>
        </div>
        <div className={`at-node target ghost ${!toTimer ? 'hit' : ''}`}>
          <span className="at-node-label">global / undefined</span>
          <code>this.label → undefined</code>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={bind + kind}
          className={`at-result ${toTimer ? 'ok' : 'bad'}`}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
        >
          {toTimer ? 'logs  "⏱"' : 'logs  undefined  (or throws)'}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default function ArrowThis() {
  const s = useStepper(STEPS.length, 3000)
  const st = STEPS[s.step]
  return (
    <div className="a-wrap">
      <div className="a-grid">
        <CodePanel code={CODE} active={st.lines} />
        <div className="a-panel">
          <span className="a-panel-label">Where does <code>this</code> point?</span>
          <ThisBox bind={st.bind} kind={st.kind} />
        </div>
      </div>

      <StepExplain s={s} title={st.title} text={st.text} />
      <StepControls s={s} />

      <div className="a-cards">
        <div className="a-card" style={{ borderTopColor: '#fca5a5' }}>
          <h4>Regular functions</h4>
          <p><code>this</code> is set by *how they're called* (the caller). Detached callbacks lose their object — a classic bug source.</p>
        </div>
        <div className="a-card" style={{ borderTopColor: '#86efac' }}>
          <h4>Arrow functions</h4>
          <p>No own <code>this</code>, <code>arguments</code>, or <code>prototype</code>. They capture <code>this</code> *lexically* from where they're defined.</p>
        </div>
        <div className="a-card" style={{ borderTopColor: '#fcd34d' }}>
          <h4>Rule of thumb</h4>
          <p>Use arrows for callbacks that should keep the surrounding <code>this</code>. Use regular functions for object methods &amp; constructors.</p>
        </div>
      </div>
    </div>
  )
}
