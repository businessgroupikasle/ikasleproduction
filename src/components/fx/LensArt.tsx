/**
 * Concentric lens rings with a spinning focus ring, tick marks and a radar-style sweep.
 * Decorative artwork for page heroes; position and size it from CSS (`.fx-lens`).
 */
export function LensArt({
  className = '',
  image,
  spin = true,
  imagePosition,
}: {
  className?: string
  image?: string
  spin?: boolean
  imagePosition?: string
}) {
  return (
    <div className={`fx-lens ${className}`.trim()} aria-hidden="true">
      {image && (
        <img
          src={image}
          alt=""
          className={`fx-lens-img ${spin ? '' : 'is-static'}`.trim()}
          style={imagePosition ? { objectPosition: imagePosition } : undefined}
          decoding="async"
          draggable={false}
        />
      )}
      <i className="fx-lens-ring" />
      <i className="fx-lens-dash" />
      <i className="fx-lens-ticks" />
      <i className="fx-lens-sweep" />
      <i className="fx-lens-core" />
    </div>
  )
}
