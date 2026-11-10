/**
 * Concentric lens rings with a spinning focus ring, tick marks and a radar-style sweep.
 * Decorative artwork for page heroes; position and size it from CSS (`.fx-lens`).
 */
export function LensArt({ className = '' }: { className?: string }) {
  return (
    <div className={`fx-lens ${className}`.trim()} aria-hidden="true">
      <i className="fx-lens-ring" />
      <i className="fx-lens-dash" />
      <i className="fx-lens-ticks" />
      <i className="fx-lens-sweep" />
      <i className="fx-lens-core" />
    </div>
  )
}
