import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import './TypeCoercion.css'

// Each case compares the same two operands with === and ==, exposing the
// coercion the loose operator performs before comparing.
const CASES = [
  {
    left: "'5'",
    right: '5',
    leftType: 'string',
    rightType: 'number',
    strict: false,
    strictReason: 'string vs number — types differ, so === is false immediately.',
    loose: true,
    steps: ["Types differ → == coerces.", "ToNumber('5') → 5", '5 === 5  →  true'],
  },
  {
    left: 'true',
    right: '1',
    leftType: 'boolean',
    rightType: 'number',
    strict: false,
    strictReason: 'boolean vs number — different types.',
    loose: true,
    steps: ['A boolean is coerced to a number.', 'ToNumber(true) → 1', '1 === 1  →  true'],
  },
  {
    left: 'null',
    right: 'undefined',
    leftType: 'null',
    rightType: 'undefined',
    strict: false,
    strictReason: 'null and undefined are distinct types.',
    loose: true,
    steps: ['Special-cased in the spec.', 'null == undefined is defined as true.', '(but null == 0 is false!)'],
  },
  {
    left: '0',
    right: "''",
    leftType: 'number',
    rightType: 'string',
    strict: false,
    strictReason: 'number vs string — different types.',
    loose: true,
    steps: ['The string is coerced to a number.', "ToNumber('') → 0", '0 === 0  →  true'],
  },
  {
    left: '[]',
    right: 'false',
    leftType: 'object',
    rightType: 'boolean',
    strict: false,
    strictReason: 'object vs boolean — different types.',
    loose: true,
    steps: ['ToNumber(false) → 0', "ToPrimitive([]) → '' , then ToNumber('') → 0", '0 === 0  →  true (!)'],
  },
]

function Operand({ value, type, label }) {
  return (
    <div className="tc-operand">
      <span className="tc-operand-side">{label}</span>
      <span className="tc-operand-val">{value}</span>
      <span className={`tc-type t-${type}`}>{type}</span>
    </div>
  )
}

function ResultBadge({ value }) {
  return (
    <motion.span
      key={String(value)}
      className={`tc-badge ${value ? 'true' : 'false'}`}
      initial={{ scale: 0.6, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 500, damping: 24 }}
    >
      {String(value)}
    </motion.span>
  )
}

export default function TypeCoercion() {
  const [i, setI] = useState(0)
  const [playing, setPlaying] = useState(false)
  const c = CASES[i]
  const atEnd = i === CASES.length - 1

  useEffect(() => {
    if (!playing) return
    if (atEnd) {
      setPlaying(false)
      return
    }
    const t = setTimeout(() => setI((n) => n + 1), 3200)
    return () => clearTimeout(t)
  }, [playing, i, atEnd])

  const pause = () => setPlaying(false)

  return (
    <div className="tc">
      {/* Case selector */}
      <div className="tc-tabs">
        {CASES.map((cc, idx) => (
          <button
            key={idx}
            className={`tc-tab ${idx === i ? 'active' : ''}`}
            onClick={() => { pause(); setI(idx) }}
          >
            {cc.left} <span className="tc-tab-op">==</span> {cc.right}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={i}
          className="tc-stage"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.28 }}
        >
          {/* Operands */}
          <div className="tc-operands">
            <Operand value={c.left} type={c.leftType} label="left" />
            <span className="tc-vs">vs</span>
            <Operand value={c.right} type={c.rightType} label="right" />
          </div>

          {/* Strict === row */}
          <div className="tc-row strict">
            <div className="tc-row-head">
              <code className="tc-expr">{c.left} === {c.right}</code>
              <span className="tc-op-tag">strict — no coercion</span>
            </div>
            <div className="tc-row-body">
              <span className="tc-reason">{c.strictReason}</span>
              <ResultBadge value={c.strict} />
            </div>
          </div>

          {/* Loose == row, with the coercion pipeline */}
          <div className="tc-row loose">
            <div className="tc-row-head">
              <code className="tc-expr">{c.left} == {c.right}</code>
              <span className="tc-op-tag warn">loose — coerces first</span>
            </div>
            <div className="tc-row-body">
              <div className="tc-pipeline">
                {c.steps.map((step, idx) => (
                  <motion.div
                    key={step}
                    className="tc-pipe-step"
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 + idx * 0.45, duration: 0.3 }}
                  >
                    <span className="tc-pipe-dot" />
                    <code>{step}</code>
                  </motion.div>
                ))}
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 + c.steps.length * 0.45 }}
              >
                <ResultBadge value={c.loose} />
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      <div className="tc-controls">
        <button onClick={() => { pause(); setI(0) }} disabled={i === 0 && !playing}>⟲ Reset</button>
        <button onClick={() => { pause(); setI((n) => Math.max(0, n - 1)) }} disabled={i === 0}>‹ Prev</button>
        {atEnd ? (
          <button className="primary" onClick={() => { setI(0); setPlaying(true) }}>↻ Replay</button>
        ) : (
          <button className="primary" onClick={() => (playing ? pause() : setPlaying(true))}>
            {playing ? '❚❚ Pause' : '▶ Play'}
          </button>
        )}
        <button onClick={() => { pause(); setI((n) => Math.min(CASES.length - 1, n + 1)) }} disabled={atEnd}>Next ›</button>
      </div>

      {/* Reference cards */}
      <div className="tc-cards">
        <div className="tc-card good">
          <h4>✓ The rule</h4>
          <p>Default to <code>===</code> and <code>!==</code>. They compare type <em>and</em> value with no surprises. Reserve <code>==</code> for the deliberate <code>x == null</code> null/undefined check.</p>
        </div>
        <div className="tc-card">
          <h4>How == decides</h4>
          <p>Same type → compares directly. Different types → it coerces toward <strong>number</strong> (booleans, strings, and objects via <code>ToPrimitive</code>), except <code>null == undefined</code>.</p>
        </div>
        <div className="tc-card">
          <h4>Falsy values</h4>
          <p><code>false</code>, <code>0</code>, <code>-0</code>, <code>0n</code>, <code>''</code>, <code>null</code>, <code>undefined</code>, <code>NaN</code>. Everything else is truthy — including <code>[]</code> and <code>{'{}'}</code>.</p>
        </div>
      </div>

      <div className="tc-example">
        <h4>Notorious cases</h4>
        <pre>
{`'' == 0          // true     '0' == 0         // true
'' == '0'        // false    [] == ![]        // true  (!)
NaN === NaN      // false    null == 0        // false
null == undefined// true     undefined == 0   // false`}
        </pre>
      </div>
    </div>
  )
}
