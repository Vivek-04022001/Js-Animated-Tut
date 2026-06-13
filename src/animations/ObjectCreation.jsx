import { motion, AnimatePresence } from 'motion/react'
import { useStepper, StepControls, StepExplain, CodePanel } from './stepKit.jsx'
import './ObjectCreation.css'

const CODE = [
  'const user = {',
  '  name: "Ada",',
  '  age: 30,',
  '};',
  '',
  'user.name;        // "Ada"',
  'user["age"];      // 30',
  'user.role = "dev"; // add',
  'delete user.age;   // remove',
]

const STEPS = [
  {
    lines: [0, 1, 2, 3],
    title: 'Object literal',
    text: 'The `{ }` literal is the most common way to make an object — a set of key/value pairs created in one expression.',
    props: [['name', '"Ada"'], ['age', '30']],
    access: null,
  },
  {
    lines: [5],
    title: 'Dot access',
    text: '`user.name` reads a property by its literal key. Clean and the most common form.',
    props: [['name', '"Ada"'], ['age', '30']],
    access: 'name',
    result: '"Ada"',
  },
  {
    lines: [6],
    title: 'Bracket access',
    text: '`user["age"]` uses a string key. Required when the key is dynamic or not a valid identifier: `user[someVar]`.',
    props: [['name', '"Ada"'], ['age', '30']],
    access: 'age',
    result: '30',
  },
  {
    lines: [7],
    title: 'Add a property',
    text: 'Assigning to a new key adds it. Objects are mutable — `user.role = "dev"` grows the object in place.',
    props: [['name', '"Ada"'], ['age', '30'], ['role', '"dev"']],
    access: 'role',
    added: 'role',
  },
  {
    lines: [8],
    title: 'Remove a property',
    text: '`delete user.age` removes the key entirely. Reading it afterwards yields `undefined`.',
    props: [['name', '"Ada"'], ['role', '"dev"']],
    access: null,
    removed: true,
  },
]

export default function ObjectCreation() {
  const s = useStepper(STEPS.length, 2800)
  const st = STEPS[s.step]
  return (
    <div className="a-wrap">
      <div className="a-grid">
        <CodePanel code={CODE} active={st.lines} />

        <div className="a-panel">
          <span className="a-panel-label">user</span>
          <div className="oc-obj">
            <span className="oc-brace">{'{'}</span>
            <AnimatePresence mode="popLayout">
              {st.props.map(([k, v]) => (
                <motion.div
                  key={k}
                  layout
                  className={`oc-prop ${st.access === k ? 'hit' : ''} ${st.added === k ? 'added' : ''}`}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 40, height: 0 }}
                  transition={{ type: 'spring', stiffness: 420, damping: 30 }}
                >
                  <span className="oc-key">{k}</span>
                  <span className="oc-colon">:</span>
                  <span className="oc-val">{v}</span>
                </motion.div>
              ))}
            </AnimatePresence>
            <span className="oc-brace">{'}'}</span>
          </div>

          <AnimatePresence mode="wait">
            {st.result && (
              <motion.div key={s.step} className="oc-result" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                returns <code>{st.result}</code>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <StepExplain s={s} title={st.title} text={st.text} />
      <StepControls s={s} />

      <div className="a-cards">
        <div className="a-card" style={{ borderTopColor: '#93c5fd' }}>
          <h4>Ways to create</h4>
          <p>Literal <code>{'{}'}</code>, <code>new Object()</code>, <code>Object.create(proto)</code>, a constructor, or a <code>class</code>.</p>
        </div>
        <div className="a-card" style={{ borderTopColor: '#5eead4' }}>
          <h4>dot vs bracket</h4>
          <p><code>obj.key</code> for fixed names; <code>obj[expr]</code> for dynamic or unusual keys. Both read &amp; write.</p>
        </div>
        <div className="a-card" style={{ borderTopColor: '#fcd34d' }}>
          <h4>Handy methods</h4>
          <p><code>Object.keys</code>, <code>.values</code>, <code>.entries</code>, <code>.freeze</code>, and the <code>in</code> operator to test membership.</p>
        </div>
      </div>
    </div>
  )
}
