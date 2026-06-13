import { useStepper, StepControls, StepExplain, CodePanel } from './stepKit.jsx'
import { ProtoChain } from './ProtoChain.jsx'

const CODE = [
  'const arr = [1, 2];',
  '',
  'arr.push(3);     // own? no → Array.prototype',
  'arr.toString();  // → Object.prototype',
  'arr.foo;         // nowhere → undefined',
]

const LEVELS = [
  { title: 'arr', sub: 'the instance', members: ['0: 1', '1: 2', 'length'] },
  { title: 'Array.prototype', sub: '', members: ['push()', 'map()', 'filter()'] },
  { title: 'Object.prototype', sub: '', members: ['toString()', 'hasOwnProperty()'] },
  { title: 'null', sub: 'end of the chain', members: [] },
]

const STEPS = [
  {
    lines: [0],
    title: 'An object and its chain',
    text: 'Every object has a hidden link, `[[Prototype]]`, to another object. `arr` → `Array.prototype` → `Object.prototype` → `null`.',
    checkedUpto: 0,
    foundLevel: -1,
    member: null,
  },
  {
    lines: [2],
    title: 'Lookup walks up the chain',
    text: '`arr.push` is not an *own* property of `arr`. JS climbs the link to `Array.prototype`, finds `push` there, and uses it.',
    checkedUpto: 1,
    foundLevel: 1,
    member: 'push()',
  },
  {
    lines: [3],
    title: 'Further up for shared methods',
    text: '`arr.toString` is not on `arr` or `Array.prototype`, so the search continues to `Object.prototype` — the root that nearly everything inherits from.',
    checkedUpto: 2,
    foundLevel: 2,
    member: 'toString()',
  },
  {
    lines: [4],
    title: 'Not found → undefined',
    text: '`arr.foo` is found nowhere. The chain ends at `null`, so the lookup gives up and returns `undefined` (it does not throw).',
    checkedUpto: 3,
    foundLevel: -1,
    member: null,
  },
]

export default function PrototypeChain() {
  const s = useStepper(STEPS.length, 3000)
  const st = STEPS[s.step]
  return (
    <div className="a-wrap">
      <div className="a-grid">
        <CodePanel code={CODE} active={st.lines} />
        <div className="a-panel">
          <span className="a-panel-label">Property lookup</span>
          <ProtoChain levels={LEVELS} checkedUpto={st.checkedUpto} foundLevel={st.foundLevel} member={st.member} />
        </div>
      </div>

      <StepExplain s={s} title={st.title} text={st.text} />
      <StepControls s={s} />

      <div className="a-cards">
        <div className="a-card" style={{ borderTopColor: '#93c5fd' }}>
          <h4>The chain</h4>
          <p>Reading a property checks the object, then its prototype, then its prototype's prototype — until found or <code>null</code>.</p>
        </div>
        <div className="a-card" style={{ borderTopColor: '#5eead4' }}>
          <h4>Own vs inherited</h4>
          <p><code>obj.hasOwnProperty(k)</code> and <code>Object.hasOwn(obj, k)</code> test for *own* keys, ignoring the chain.</p>
        </div>
        <div className="a-card" style={{ borderTopColor: '#fcd34d' }}>
          <h4>Writes don't climb</h4>
          <p>Assigning <code>obj.x =</code> always creates an *own* property — it never modifies the prototype.</p>
        </div>
      </div>
    </div>
  )
}
