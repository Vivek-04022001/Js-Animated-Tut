import { useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { concepts, conceptById } from './concepts.js'
import Sidebar from './components/Sidebar.jsx'
import ConceptView from './components/ConceptView.jsx'
import Intro from './components/Intro.jsx'
import Aurora from './components/Aurora.jsx'
import { loadVisited, saveVisited } from './lib/progress.js'
import './index.css'

const INTRO_KEY = 'js-anim-intro-v1'
const TOTAL = Object.keys(conceptById).length

export default function App() {
  // Default to the first concept so the stage is never empty.
  const [activeId, setActiveId] = useState(concepts[0].items[0].id)
  const [menuOpen, setMenuOpen] = useState(false)
  const topbarRef = useRef(null)

  // Concepts the visitor has opened — restored from a cookie, and the
  // default-open concept counts as their first explored item.
  const [visited, setVisited] = useState(() => {
    const set = loadVisited()
    set.add(concepts[0].items[0].id)
    return set
  })

  // Only count ids that still exist in the registry (guards against stale cookies).
  const doneCount = [...visited].filter((id) => conceptById[id]).length

  const markVisited = (id) => {
    setVisited((prev) => {
      if (prev.has(id)) return prev
      const next = new Set(prev)
      next.add(id)
      saveVisited(next)
      return next
    })
  }

  // Show the cinematic opener only on a visitor's first arrival.
  const [showIntro, setShowIntro] = useState(() => {
    try {
      return localStorage.getItem(INTRO_KEY) !== '1'
    } catch {
      return true
    }
  })

  const finishIntro = () => {
    try {
      localStorage.setItem(INTRO_KEY, '1')
    } catch {
      /* ignore storage failures (private mode, etc.) */
    }
    setShowIntro(false)
  }

  // One-time topbar reveal on load: brand badge + text ease down in sequence.
  useGSAP(
    () => {
      gsap.from('.topbar > *', {
        y: -12,
        opacity: 0,
        duration: 0.5,
        stagger: 0.08,
        ease: 'power3.out',
      })
    },
    { scope: topbarRef }
  )

  const active = conceptById[activeId]

  const handleSelect = (id) => {
    setActiveId(id)
    setMenuOpen(false)
    markVisited(id)
  }

  return (
    <div className="app">
      <Aurora />
      {showIntro && <Intro onFinish={finishIntro} />}

      <header className="topbar" ref={topbarRef}>
        <button
          className="menu-toggle"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          ☰
        </button>
        <span className="brand">JS Animations</span>
        <span className="tagline">Learn JavaScript visually</span>
      </header>

      <div className="layout">
        <Sidebar
          groups={concepts}
          activeId={activeId}
          onSelect={handleSelect}
          open={menuOpen}
          done={doneCount}
          total={TOTAL}
        />
        <main className="stage">
          <ConceptView concept={active} />
        </main>
      </div>
    </div>
  )
}
