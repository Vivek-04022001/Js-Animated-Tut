import { motion, AnimatePresence } from 'motion/react'
import { useStepper, StepControls, StepExplain, CodePanel } from './stepKit.jsx'
import './CallApplyBind.css'

const CODE = [
  'function intro(greet) {',
  '  return `${greet}, I am ${this.name}`;',
  '}',
  'const user = { name: "Ada" };',
  '',
  'intro.call(user, "Hi");      // now',
  'intro.apply(user, ["Hey"]);  // now',
  'const f = intro.bind(user);  // later',
  'f("Yo");',
]

const STEPS = [
  {
    lines: [0, 3],
    title: 'A function and a separate object',
    text: '`intro` uses `this.name`, but it is not attached to any object. `user` has the data. We need to run `intro` *with* `this = user`.',
    method: null,
    when: null,
    args: '',
    result: null,
  },
  {
    lines: [5],
    title: 'call — invoke now, args listed',
    text: '`intro.call(user, "Hi")` runs `intro` immediately with `this = user` and arguments passed one by one.',
    method: 'call',
    when: 'invokes now',
    args: '"Hi"',
    result: 'Hi, I am Ada',
  },
  {
    lines: [6],
    title: 'apply — invoke now, args as array',
    text: 'Identical to `call`, but arguments come as a single array: `intro.apply(user, ["Hey"])`. Handy when args are already in an array.',
    method: 'apply',
    when: 'invokes now',
    args: '["Hey"]',
    result: 'Hey, I am Ada',
  },
  {
    lines: [7, 8],
    title: 'bind — return a new bound function',
    text: '`intro.bind(user)` does *not* run it. It returns a new function permanently locked to `this = user`, callable later as `f("Yo")`.',
    method: 'bind',
    when: 'returns a function',
    args: '"Yo"  (later)',
    result: 'Yo, I am Ada',
  },
]

export default function CallApplyBind() {
  const s = useStepper(STEPS.length, 3000)
  const st = STEPS[s.step]
  return (
    <div className="a-wrap">
      <div className="a-grid">
        <CodePanel code={CODE} active={st.lines} />

        <div className="a-panel">
          <span className="a-panel-label">Binding this</span>
          <div className="cab-stage">
            <div className="cab-pair">
              <div className="cab-node fn">intro()<small>uses this.name</small></div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={s.step}
                  className={`cab-bind ${st.method || 'none'}`}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {st.method ? `.${st.method}()` : 'this = ?'}
                </motion.div>
              </AnimatePresence>
              <div className="cab-node obj">user<small>{'{ name: "Ada" }'}</small></div>
            </div>

            {st.method && (
              <motion.div key={'w' + s.step} className="cab-when" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <span className={`cab-when-tag ${st.method === 'bind' ? 'later' : 'now'}`}>{st.when}</span>
                <span className="cab-args">args: <code>{st.args}</code></span>
              </motion.div>
            )}

            <AnimatePresence mode="wait">
              {st.result && (
                <motion.div key={'r' + s.step} className="cab-result" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  → "{st.result}"
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <StepExplain s={s} title={st.title} text={st.text} />
      <StepControls s={s} />

      <div className="a-cards">
        <div className="a-card" style={{ borderTopColor: '#93c5fd' }}>
          <h4>call(thisArg, …args)</h4>
          <p>Runs the function right away with an explicit <code>this</code> and comma-separated arguments.</p>
        </div>
        <div className="a-card" style={{ borderTopColor: '#5eead4' }}>
          <h4>apply(thisArg, [args])</h4>
          <p>Same, but arguments are an array. (Modern spread <code>fn(...arr)</code> often replaces it.)</p>
        </div>
        <div className="a-card" style={{ borderTopColor: '#fcd34d' }}>
          <h4>bind(thisArg, …args)</h4>
          <p>Returns a <em>new</em> function with <code>this</code> (and optionally some args) fixed forever. Call it whenever you like.</p>
        </div>
      </div>
    </div>
  )
}
