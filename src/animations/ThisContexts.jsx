import { motion, AnimatePresence } from 'motion/react'
import { useStepper, StepControls, StepExplain } from './stepKit.jsx'
import './ThisContexts.css'

const STEPS = [
  {
    call: 'fn()',
    title: 'Plain function call',
    text: 'Called with no owner, `this` is `undefined` in strict mode / modules (or the global object in sloppy mode). A frequent source of bugs.',
    target: 'undefined',
    tone: 'bad',
  },
  {
    call: 'obj.fn()',
    title: 'Method call',
    text: 'Called as a property of `obj`, `this` is whatever is left of the dot — here, `obj`. The call site decides, not where the function was defined.',
    target: 'obj',
    tone: 'ok',
  },
  {
    call: 'new Fn()',
    title: 'Constructor call',
    text: 'With `new`, a fresh object is created and `this` points to it. The constructor populates and (implicitly) returns it.',
    target: 'new instance',
    tone: 'ok',
  },
  {
    call: '() => this',
    title: 'Arrow function',
    text: "An arrow has no own `this` — it uses the `this` of the scope where it was *defined*. Immune to how it's later called.",
    target: 'enclosing this',
    tone: 'ok',
  },
  {
    call: 'fn.call(x)',
    title: 'Explicit binding',
    text: '`call` / `apply` / `bind` set `this` directly. `fn.call(x)` forces `this` to be `x`, overriding the call-site rules above.',
    target: 'x',
    tone: 'ok',
  },
  {
    call: 'btn.onclick = fn',
    title: 'DOM event handler',
    text: 'A regular function used as an event listener gets `this` = the element that fired it. (An arrow handler keeps the surrounding `this` instead.)',
    target: 'the element',
    tone: 'ok',
  },
]

export default function ThisContexts() {
  const s = useStepper(STEPS.length, 2800)
  const st = STEPS[s.step]
  return (
    <div className="a-wrap">
      <div className="a-panel tc-ctx-panel">
        <span className="a-panel-label">Call site → what is <code>this</code>?</span>

        <div className="tcx-tabs">
          {STEPS.map((c, i) => (
            <button key={i} className={`tcx-tab ${i === s.step ? 'active' : ''}`} onClick={() => { s.pause(); s.setStep(i) }}>
              {c.call}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={s.step}
            className="tcx-flow"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.26 }}
          >
            <div className="tcx-call"><code>{st.call}</code></div>
            <div className="tcx-arrow">this →</div>
            <div className={`tcx-target ${st.tone}`}>{st.target}</div>
          </motion.div>
        </AnimatePresence>
      </div>

      <StepExplain s={s} title={st.title} text={st.text} />
      <StepControls s={s} />

      <div className="a-cards">
        <div className="a-card" style={{ borderTopColor: '#fca5a5' }}>
          <h4>The golden rule</h4>
          <p><code>this</code> is decided by *how a function is called*, not where it's written — except arrow functions, which capture it lexically.</p>
        </div>
        <div className="a-card" style={{ borderTopColor: '#93c5fd' }}>
          <h4>Losing this</h4>
          <p>Passing <code>obj.method</code> as a callback detaches it. Fix with <code>.bind(obj)</code> or an arrow wrapper <code>{'() => obj.method()'}</code>.</p>
        </div>
        <div className="a-card" style={{ borderTopColor: '#fcd34d' }}>
          <h4>Precedence</h4>
          <p><code>new</code> &gt; explicit <code>bind/call/apply</code> &gt; method call &gt; plain call. Arrows ignore all of it.</p>
        </div>
      </div>
    </div>
  )
}
