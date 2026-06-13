import './Aurora.css'

// Aceternity-style aurora: slow, flowing gradient blobs drifting behind the
// whole app. Pure CSS keyframes so it stays smooth and costs no JS per frame.
export default function Aurora() {
  return (
    <div className="aurora" aria-hidden="true">
      <span className="aurora-blob b1" />
      <span className="aurora-blob b2" />
      <span className="aurora-blob b3" />
      <div className="aurora-grain" />
    </div>
  )
}
