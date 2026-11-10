/** Soft purple glows and film grain behind a page (styles: service-detail.css). */
export function PageAtmosphere() {
  return (
    <div className="service-detail-atmosphere" aria-hidden="true">
      <div className="svc-ambient-glow svc-ambient-glow-1" />
      <div className="svc-ambient-glow svc-ambient-glow-2" />
      <div className="svc-ambient-glow svc-ambient-glow-3" />
      <div className="svc-ambient-grain" />
    </div>
  )
}

/** Thin labelled rule between page sections; reveals on scroll via useReveal. */
export function SectionDivider({ label }: { label: string }) {
  return (
    <div className="svc-section-divider" aria-hidden="true" data-reveal>
      <div className="svc-divider-line" />
      <div className="svc-divider-center">
        <span className="svc-divider-dot" />
        <span className="svc-divider-text">{label}</span>
        <span className="svc-divider-dot" />
      </div>
      <div className="svc-divider-line is-reverse" />
    </div>
  )
}
