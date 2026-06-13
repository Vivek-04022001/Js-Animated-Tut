import { motion } from 'motion/react'
import './ProtoChain.css'

// Reusable prototype-chain visual.
// levels: [{ title, sub, members: string[] }]
// checkedUpto: highest index the lookup has climbed to (inclusive)
// foundLevel: index where the property was found (or -1 for "not found")
// member: the member string to highlight at foundLevel
export function ProtoChain({ levels, checkedUpto = -1, foundLevel = -1, member }) {
  return (
    <div className="pc-chain">
      {levels.map((lv, i) => (
        <div key={i} className="pc-row">
          <motion.div
            layout
            className={`pc-level ${i <= checkedUpto ? 'checked' : ''} ${i === foundLevel ? 'found' : ''}`}
          >
            <div className="pc-level-head">
              <strong>{lv.title}</strong>
              {lv.sub && <span>{lv.sub}</span>}
              {i <= checkedUpto && i !== foundLevel && <span className="pc-miss">✗ not here</span>}
              {i === foundLevel && <span className="pc-found-tag">✓ found</span>}
            </div>
            <div className="pc-members">
              {lv.members.map((m) => (
                <code key={m} className={`pc-member ${i === foundLevel && m === member ? 'hit' : ''}`}>
                  {m}
                </code>
              ))}
            </div>
          </motion.div>
          {i < levels.length - 1 && (
            <div className={`pc-link ${i < checkedUpto ? 'lit' : ''}`}>
              <span>[[Prototype]]</span> ↓
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
