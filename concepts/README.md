# JavaScript Concepts — Animation Roadmap

Each concept gets its own animation. Work through them in order — later concepts build on earlier ones.

---

## Status Key
- `[ ]` Not started
- `[~]` In progress
- `[x]` Done

---

## 1. Foundations

| # | Concept | Status | Animation File |
|---|---------|--------|----------------|
| 1.1 | Variables & Scoping (`var`, `let`, `const`) | `[x]` | `src/animations/VariablesScoping.jsx` |
| 1.2 | Data Types (primitive vs reference) | `[x]` | `src/animations/DataTypes.jsx` |
| 1.3 | Type Coercion & `==` vs `===` | `[x]` | `src/animations/TypeCoercion.jsx` |
| 1.4 | Hoisting | `[x]` | `src/animations/Hoisting.jsx` |
| 1.5 | Temporal Dead Zone (TDZ) | `[x]` | `src/animations/TemporalDeadZone.jsx` |

---

## 2. Functions

| # | Concept | Status | Animation File |
|---|---------|--------|----------------|
| 2.1 | Function Declaration vs Expression | `[ ]` | — |
| 2.2 | Arrow Functions & `this` binding | `[ ]` | — |
| 2.3 | Closures | `[ ]` | — |
| 2.4 | Higher-Order Functions (`map`, `filter`, `reduce`) | `[ ]` | — |
| 2.5 | Currying & Partial Application | `[ ]` | — |
| 2.6 | Recursion & Call Stack | `[ ]` | — |

---

## 3. Objects & Prototypes

| # | Concept | Status | Animation File |
|---|---------|--------|----------------|
| 3.1 | Object Creation & Property Access | `[ ]` | — |
| 3.2 | Prototype Chain | `[ ]` | — |
| 3.3 | `Object.create()` | `[ ]` | — |
| 3.4 | Classes & Inheritance (`extends`, `super`) | `[ ]` | — |
| 3.5 | `this` in different contexts | `[ ]` | — |
| 3.6 | `call`, `apply`, `bind` | `[ ]` | — |

---

## 4. Asynchronous JavaScript

| # | Concept | Status | Animation File |
|---|---------|--------|----------------|
| 4.1 | The Event Loop | `[ ]` | — |
| 4.2 | Call Stack, Web APIs, Task Queue | `[ ]` | — |
| 4.3 | Callbacks & Callback Hell | `[ ]` | — |
| 4.4 | Promises (states: pending / fulfilled / rejected) | `[ ]` | — |
| 4.5 | Promise Chaining | `[ ]` | — |
| 4.6 | `async` / `await` | `[ ]` | — |
| 4.7 | `Promise.all`, `Promise.race`, `Promise.allSettled` | `[ ]` | — |
| 4.8 | Microtask Queue vs Macrotask Queue | `[ ]` | — |

---

## 5. Arrays & Iterables

| # | Concept | Status | Animation File |
|---|---------|--------|----------------|
| 5.1 | Array Methods deep-dive (`map`, `filter`, `reduce`, `flat`, `flatMap`) | `[ ]` | — |
| 5.2 | Spread & Rest operators | `[ ]` | — |
| 5.3 | Destructuring (arrays & objects) | `[ ]` | — |
| 5.4 | Iterators & `Symbol.iterator` | `[ ]` | — |
| 5.5 | Generators (`function*`, `yield`) | `[ ]` | — |

---

## 6. Memory & Performance

| # | Concept | Status | Animation File |
|---|---------|--------|----------------|
| 6.1 | Stack vs Heap | `[ ]` | — |
| 6.2 | Garbage Collection (mark-and-sweep) | `[ ]` | — |
| 6.3 | Memory Leaks (common causes) | `[ ]` | — |
| 6.4 | Debounce & Throttle | `[ ]` | — |

---

## 7. Modern JavaScript (ES6+)

| # | Concept | Status | Animation File |
|---|---------|--------|----------------|
| 7.1 | Modules (`import` / `export`) | `[ ]` | — |
| 7.2 | Symbols | `[ ]` | — |
| 7.3 | WeakMap & WeakSet | `[ ]` | — |
| 7.4 | Proxy & Reflect | `[ ]` | — |
| 7.5 | Optional Chaining `?.` & Nullish Coalescing `??` | `[ ]` | — |

---

## 8. Browser & Runtime

| # | Concept | Status | Animation File |
|---|---------|--------|----------------|
| 8.1 | DOM & CSSOM construction | `[ ]` | — |
| 8.2 | Event Bubbling & Capturing | `[ ]` | — |
| 8.3 | Event Delegation | `[ ]` | — |
| 8.4 | `setTimeout` / `setInterval` internals | `[ ]` | — |
| 8.5 | `requestAnimationFrame` | `[ ]` | — |

---

## Suggested Starting Order

For the biggest "aha moment" per animation, start here:

1. **Event Loop** (4.1 + 4.2) — the most visual concept in JS
2. **Closures** (2.3) — unlocks understanding of most patterns
3. **Prototype Chain** (3.2) — demystifies `class` syntax
4. **Promises** (4.4 + 4.5) — builds directly on Event Loop
5. **Hoisting** (1.4) — short but often misunderstood

---

> Update `Status` and `Animation File` columns as you build each animation.
