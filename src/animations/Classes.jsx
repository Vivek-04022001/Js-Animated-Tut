import { useStepper, StepControls, StepExplain, CodePanel } from './stepKit.jsx'
import { ProtoChain } from './ProtoChain.jsx'

const CODE = [
  'class Animal {',
  '  constructor(name) { this.name = name; }',
  '  speak() { return `${this.name} makes a sound`; }',
  '}',
  '',
  'class Dog extends Animal {',
  '  speak() { return `${super.speak()} — woof!`; }',
  '}',
  '',
  'const d = new Dog("Rex");',
  'd.speak();',
]

const LEVELS = [
  { title: 'd', sub: 'new Dog("Rex")', members: ['name: "Rex"'] },
  { title: 'Dog.prototype', sub: 'subclass', members: ['speak()'] },
  { title: 'Animal.prototype', sub: 'superclass', members: ['speak()', 'constructor'] },
  { title: 'Object.prototype', sub: '', members: ['toString()'] },
]

const STEPS = [
  {
    lines: [9],
    title: 'class is sugar over prototypes',
    text: '`new Dog("Rex")` builds an instance. `d`\'s `[[Prototype]]` is `Dog.prototype`, whose prototype is `Animal.prototype` — the same chain you saw before, just nicer syntax.',
    checkedUpto: 0,
    foundLevel: 0,
    member: 'name: "Rex"',
  },
  {
    lines: [10, 6],
    title: 'Method found on the subclass',
    text: '`d.speak()` is found on `Dog.prototype` first (it overrides the parent). Subclass methods shadow the ones higher up.',
    checkedUpto: 1,
    foundLevel: 1,
    member: 'speak()',
  },
  {
    lines: [6, 2],
    title: 'super reaches up the chain',
    text: '`super.speak()` explicitly calls the *next* `speak` up the chain — `Animal.prototype.speak` — then `Dog` appends "— woof!" to the result.',
    checkedUpto: 2,
    foundLevel: 2,
    member: 'speak()',
  },
]

export default function Classes() {
  const s = useStepper(STEPS.length, 3200)
  const st = STEPS[s.step]
  return (
    <div className="a-wrap">
      <div className="a-grid">
        <CodePanel code={CODE} active={st.lines} />
        <div className="a-panel">
          <span className="a-panel-label">Instance &amp; class chain</span>
          <ProtoChain levels={LEVELS} checkedUpto={st.checkedUpto} foundLevel={st.foundLevel} member={st.member} />
        </div>
      </div>

      <StepExplain s={s} title={st.title} text={st.text} />
      <StepControls s={s} />

      <div className="a-cards">
        <div className="a-card" style={{ borderTopColor: '#93c5fd' }}>
          <h4>extends</h4>
          <p>Links <code>Dog.prototype</code> to <code>Animal.prototype</code>. Instances inherit parent methods through the chain.</p>
        </div>
        <div className="a-card" style={{ borderTopColor: '#5eead4' }}>
          <h4>super</h4>
          <p>In a subclass constructor you must call <code>super(...)</code> before using <code>this</code>. In methods, <code>super.m()</code> calls the parent version.</p>
        </div>
        <div className="a-card" style={{ borderTopColor: '#fcd34d' }}>
          <h4>Still prototypes</h4>
          <p>Classes don't add a new inheritance model — they're a clean syntax over the prototype chain, plus <code>#private</code> fields and <code>static</code> members.</p>
        </div>
      </div>
    </div>
  )
}
