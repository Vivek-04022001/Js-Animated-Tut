// Central registry of all JS concepts.
//
// To add an animation later: import its component and set `component`
// on the matching concept. Until then it stays `null` and the UI shows
// a "coming soon" placeholder. Nothing else needs to change.

import VariablesScoping from './animations/VariablesScoping.jsx'
import DataTypes from './animations/DataTypes.jsx'
import TypeCoercion from './animations/TypeCoercion.jsx'
import Hoisting from './animations/Hoisting.jsx'
import TemporalDeadZone from './animations/TemporalDeadZone.jsx'
import DeclarationVsExpression from './animations/DeclarationVsExpression.jsx'
import ArrowThis from './animations/ArrowThis.jsx'
import Closures from './animations/Closures.jsx'
import HigherOrder from './animations/HigherOrder.jsx'
import Currying from './animations/Currying.jsx'
import Recursion from './animations/Recursion.jsx'

export const concepts = [
  {
    category: 'Foundations',
    items: [
      { id: 'variables-scoping', title: 'Variables & Scoping', blurb: 'var, let, const and how scope boundaries work.', component: VariablesScoping },
      { id: 'data-types', title: 'Data Types', blurb: 'Primitive vs reference types in memory.', component: DataTypes },
      { id: 'type-coercion', title: 'Type Coercion', blurb: '== vs === and implicit conversions.', component: TypeCoercion },
      { id: 'hoisting', title: 'Hoisting', blurb: 'How declarations move to the top of scope.', component: Hoisting },
      { id: 'tdz', title: 'Temporal Dead Zone', blurb: 'Why let/const throw before declaration.', component: TemporalDeadZone },
    ],
  },
  {
    category: 'Functions',
    items: [
      { id: 'declaration-vs-expression', title: 'Declaration vs Expression', blurb: 'Two ways to define functions.', component: DeclarationVsExpression },
      { id: 'arrow-this', title: 'Arrow Functions & this', blurb: 'Lexical this binding.', component: ArrowThis },
      { id: 'closures', title: 'Closures', blurb: 'Functions remembering their birthplace.', component: Closures },
      { id: 'higher-order', title: 'Higher-Order Functions', blurb: 'map, filter, reduce in motion.', component: HigherOrder },
      { id: 'currying', title: 'Currying', blurb: 'Partial application step by step.', component: Currying },
      { id: 'recursion', title: 'Recursion & Call Stack', blurb: 'Frames pushing and popping.', component: Recursion },
    ],
  },
  {
    category: 'Objects & Prototypes',
    items: [
      { id: 'object-creation', title: 'Object Creation', blurb: 'Building and accessing properties.', component: null },
      { id: 'prototype-chain', title: 'Prototype Chain', blurb: 'How lookups walk the chain.', component: null },
      { id: 'object-create', title: 'Object.create()', blurb: 'Explicit prototype linking.', component: null },
      { id: 'classes', title: 'Classes & Inheritance', blurb: 'extends and super under the hood.', component: null },
      { id: 'this-contexts', title: 'this in Contexts', blurb: 'What this points to, and when.', component: null },
      { id: 'call-apply-bind', title: 'call, apply, bind', blurb: 'Controlling this manually.', component: null },
    ],
  },
  {
    category: 'Asynchronous JS',
    items: [
      { id: 'event-loop', title: 'The Event Loop', blurb: 'The heartbeat of async JavaScript.', component: null },
      { id: 'callbacks', title: 'Callbacks', blurb: 'Passing functions to run later.', component: null },
      { id: 'promises', title: 'Promises', blurb: 'pending → fulfilled / rejected.', component: null },
      { id: 'promise-chaining', title: 'Promise Chaining', blurb: 'Threading .then() calls.', component: null },
      { id: 'async-await', title: 'async / await', blurb: 'Synchronous-looking async code.', component: null },
      { id: 'promise-combinators', title: 'Promise Combinators', blurb: 'all, race, allSettled.', component: null },
      { id: 'micro-vs-macro', title: 'Microtask vs Macrotask', blurb: 'Queue priority explained.', component: null },
    ],
  },
  {
    category: 'Arrays & Iterables',
    items: [
      { id: 'array-methods', title: 'Array Methods', blurb: 'map, filter, reduce, flat, flatMap.', component: null },
      { id: 'spread-rest', title: 'Spread & Rest', blurb: 'Expanding and collecting values.', component: null },
      { id: 'destructuring', title: 'Destructuring', blurb: 'Unpacking arrays and objects.', component: null },
      { id: 'iterators', title: 'Iterators', blurb: 'Symbol.iterator protocol.', component: null },
      { id: 'generators', title: 'Generators', blurb: 'function* and yield, paused functions.', component: null },
    ],
  },
  {
    category: 'Memory & Performance',
    items: [
      { id: 'stack-vs-heap', title: 'Stack vs Heap', blurb: 'Where values actually live.', component: null },
      { id: 'garbage-collection', title: 'Garbage Collection', blurb: 'Mark-and-sweep visualized.', component: null },
      { id: 'memory-leaks', title: 'Memory Leaks', blurb: 'Common causes and detection.', component: null },
      { id: 'debounce-throttle', title: 'Debounce & Throttle', blurb: 'Rate-limiting function calls.', component: null },
    ],
  },
  {
    category: 'Modern JS (ES6+)',
    items: [
      { id: 'modules', title: 'Modules', blurb: 'import / export wiring.', component: null },
      { id: 'symbols', title: 'Symbols', blurb: 'Unique, hidden keys.', component: null },
      { id: 'weak-collections', title: 'WeakMap & WeakSet', blurb: 'GC-friendly references.', component: null },
      { id: 'proxy-reflect', title: 'Proxy & Reflect', blurb: 'Intercepting object operations.', component: null },
      { id: 'optional-nullish', title: 'Optional & Nullish', blurb: '?. and ?? operators.', component: null },
    ],
  },
  {
    category: 'Browser & Runtime',
    items: [
      { id: 'dom-cssom', title: 'DOM & CSSOM', blurb: 'Building the render tree.', component: null },
      { id: 'event-bubbling', title: 'Bubbling & Capturing', blurb: 'How events travel the DOM.', component: null },
      { id: 'event-delegation', title: 'Event Delegation', blurb: 'One listener, many targets.', component: null },
      { id: 'timers', title: 'Timers', blurb: 'setTimeout / setInterval internals.', component: null },
      { id: 'raf', title: 'requestAnimationFrame', blurb: 'Painting in sync with the screen.', component: null },
    ],
  },
  {
    category: 'Modern JS (ES2025)',
    items: [
      { id: 'temporal-api', title: 'Temporal API', blurb: 'The immutable replacement for Date.', component: null },
      { id: 'set-methods', title: 'Set Methods', blurb: 'union, intersection, difference.', component: null },
      { id: 'json-modules', title: 'JSON Modules', blurb: 'import data from "./x.json" with type.', component: null },
      { id: 'iterator-helpers', title: 'Iterator Helpers', blurb: 'map, filter, take on any iterator.', component: null },
      { id: 'promise-withresolvers', title: 'Promise.withResolvers', blurb: 'Resolve/reject from outside the executor.', component: null },
      { id: 'regexp-escape', title: 'RegExp.escape', blurb: 'Safely escape strings for regex.', component: null },
    ],
  },
  {
    category: 'Cutting-Edge (ES2026 / TC39)',
    items: [
      { id: 'resource-management', title: 'Explicit Resource Management', blurb: 'using & await using auto-cleanup.', component: null },
      { id: 'array-fromasync', title: 'Array.fromAsync', blurb: 'Collect an async iterator into an array.', component: null },
      { id: 'pattern-matching', title: 'Pattern Matching', blurb: 'match expressions over data shapes.', component: null },
      { id: 'pipeline-operator', title: 'Pipeline Operator', blurb: 'Left-to-right data flow with |>.', component: null },
      { id: 'decorators', title: 'Decorators', blurb: 'Declarative class & method metaprogramming.', component: null },
      { id: 'records-tuples', title: 'Records & Tuples', blurb: 'Deeply immutable, compared by value.', component: null },
      { id: 'math-sumprecise', title: 'Math.sumPrecise', blurb: 'Float-accurate summation.', component: null },
      { id: 'error-iserror', title: 'Error.isError', blurb: 'Reliable cross-realm error checks.', component: null },
      { id: 'uint8-base64', title: 'Uint8Array base64 / hex', blurb: 'Bytes ↔ base64/hex without libraries.', component: null },
    ],
  },
]

// Flat lookup by id — handy for routing.
export const conceptById = Object.fromEntries(
  concepts.flatMap((group) => group.items.map((item) => [item.id, item]))
)
