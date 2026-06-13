import { useStepper, StepControls, StepExplain, CodePanel } from './stepKit.jsx'
import { ProtoChain } from './ProtoChain.jsx'

const CODE = [
  'const animal = {',
  '  eats: true,',
  '  walk() { return "step"; },',
  '};',
  '',
  'const rabbit = Object.create(animal);',
  'rabbit.jumps = true;',
  '',
  'rabbit.jumps;  // own → true',
  'rabbit.walk(); // inherited → "step"',
]

const LEVELS = [
  { title: 'rabbit', sub: 'created from animal', members: ['jumps: true'] },
  { title: 'animal', sub: 'the explicit prototype', members: ['eats: true', 'walk()'] },
  { title: 'Object.prototype', sub: '', members: ['toString()'] },
  { title: 'null', sub: '', members: [] },
]

const STEPS = [
  {
    lines: [5],
    title: 'Object.create sets the prototype directly',
    text: '`Object.create(animal)` makes a new empty object whose `[[Prototype]]` *is* `animal`. No constructor, no class — just an explicit link.',
    checkedUpto: 1,
    foundLevel: -1,
    member: null,
  },
  {
    lines: [6, 8],
    title: 'Own properties live on the object',
    text: '`rabbit.jumps = true` adds an own property. Reading `rabbit.jumps` finds it immediately on `rabbit` itself.',
    checkedUpto: 0,
    foundLevel: 0,
    member: 'jumps: true',
  },
  {
    lines: [9],
    title: 'Inherited members come from the prototype',
    text: "`rabbit.walk()` isn't on `rabbit`, so lookup climbs to `animal` and runs its method — even though `rabbit` was never given one.",
    checkedUpto: 1,
    foundLevel: 1,
    member: 'walk()',
  },
]

export default function ObjectCreate() {
  const s = useStepper(STEPS.length, 3000)
  const st = STEPS[s.step]
  return (
    <div className="a-wrap">
      <div className="a-grid">
        <CodePanel code={CODE} active={st.lines} />
        <div className="a-panel">
          <span className="a-panel-label">rabbit's chain</span>
          <ProtoChain levels={LEVELS} checkedUpto={st.checkedUpto} foundLevel={st.foundLevel} member={st.member} />
        </div>
      </div>

      <StepExplain s={s} title={st.title} text={st.text} />
      <StepControls s={s} />

      <div className="a-cards">
        <div className="a-card" style={{ borderTopColor: '#93c5fd' }}>
          <h4>Object.create(proto)</h4>
          <p>The most direct way to set an object's prototype at creation — useful for pure prototypal inheritance without classes.</p>
        </div>
        <div className="a-card" style={{ borderTopColor: '#5eead4' }}>
          <h4>No prototype at all</h4>
          <p><code>Object.create(null)</code> makes a "bare" object with no inherited members — a clean map/dictionary.</p>
        </div>
        <div className="a-card" style={{ borderTopColor: '#fcd34d' }}>
          <h4>Related</h4>
          <p><code>Object.getPrototypeOf(obj)</code> reads the link; <code>Object.setPrototypeOf</code> changes it (slow — avoid in hot paths).</p>
        </div>
      </div>
    </div>
  )
}
