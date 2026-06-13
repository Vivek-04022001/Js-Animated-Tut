import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ProgressTree from './ProgressTree.jsx'

export default function Sidebar({ groups, activeId, onSelect, open, done, total }) {
  const navRef = useRef(null)

  // Stagger the nav groups in on first mount for a lively entrance.
  useGSAP(
    () => {
      gsap.from('.nav-group', {
        x: -16,
        opacity: 0,
        duration: 0.4,
        stagger: 0.06,
        ease: 'power2.out',
      })
    },
    { scope: navRef }
  )

  // Brief pulse on whichever item just became active.
  useGSAP(
    () => {
      const el = navRef.current?.querySelector('.nav-item.active')
      if (el) {
        gsap.fromTo(
          el,
          { backgroundColor: 'rgba(247,223,30,0.35)' },
          { backgroundColor: 'rgba(247,223,30,0.12)', duration: 0.5, ease: 'power2.out' }
        )
      }
    },
    { dependencies: [activeId], scope: navRef }
  )

  // Subtle nudge on hover — a quick GSAP slide that snaps back on leave.
  const handleEnter = (e) =>
    gsap.to(e.currentTarget, { x: 4, duration: 0.2, ease: 'power2.out' })
  const handleLeave = (e) =>
    gsap.to(e.currentTarget, { x: 0, duration: 0.25, ease: 'power2.out' })

  return (
    <aside className={`sidebar ${open ? 'open' : ''}`} ref={navRef}>
      <nav>
        {groups.map((group) => (
          <div key={group.category} className="nav-group">
            <h2 className="nav-heading">{group.category}</h2>
            <ul>
              {group.items.map((item) => (
                <li key={item.id}>
                  <button
                    className={`nav-item ${item.id === activeId ? 'active' : ''}`}
                    onClick={() => onSelect(item.id)}
                    onMouseEnter={handleEnter}
                    onMouseLeave={handleLeave}
                  >
                    <span className="nav-title">{item.title}</span>
                    {!item.component && <span className="nav-badge">soon</span>}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <ProgressTree done={done} total={total} />
      </div>
    </aside>
  )
}
