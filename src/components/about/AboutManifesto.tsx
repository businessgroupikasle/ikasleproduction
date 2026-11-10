import type { CSSProperties } from 'react'
import { ABOUT_PRINCIPLES, aboutManifesto } from '../../data/about'
import { trackPointer } from '../../utils/pointerGlow'

const step = (n: number) => ({ '--reveal-delay': n }) as CSSProperties

export function AboutManifesto() {
  const words = aboutManifesto.statement.split(' ')

  return (
    <section className="about-manifesto" aria-labelledby="about-manifesto-heading">
      <div className="about-manifesto-grid">
        <div className="about-manifesto-lead">
          <div className="about-manifesto-mark" data-reveal aria-hidden="true">
            <span className="about-manifesto-number">01</span>
            <span className="about-manifesto-rule" />
          </div>
          <p className="eyebrow" data-reveal>
            {aboutManifesto.eyebrow}
          </p>
          {/* Each word reveals in turn as the statement scrolls into view. The words are hidden from
              assistive tech and the heading carries the full sentence, so it is never read as fragments. */}
          <h2 id="about-manifesto-heading" className="about-manifesto-statement" aria-label={aboutManifesto.statement}>
            {words.map((word, i) => (
              <span key={`${word}-${i}`} aria-hidden="true">
                {i > 0 && ' '}
                <span
                  className={`about-word ${i === words.length - 1 ? 'is-accent' : ''}`}
                  data-reveal
                  style={step(i)}
                >
                  {word}
                </span>
              </span>
            ))}
          </h2>
        </div>

        <div className="about-manifesto-body">
          {aboutManifesto.paragraphs.map((paragraph, i) => (
            <p key={i} data-reveal style={step(words.length + i * 2)}>
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      <ul className="about-principles" aria-label="How we think">
        {ABOUT_PRINCIPLES.map((principle, i) => {
          const Icon = principle.icon
          return (
            <li
              key={principle.index}
              className="about-principle"
              data-reveal
              style={step(i * 2)}
              onPointerMove={trackPointer}
            >
              <span className="about-principle-glow" aria-hidden="true" />
              <div className="about-principle-top">
                <span className="about-principle-icon" aria-hidden="true">
                  <Icon size={20} />
                </span>
                <span className="about-principle-index" aria-hidden="true">
                  {principle.index}
                </span>
              </div>
              <h3>{principle.title}</h3>
              <p>{principle.text}</p>
              <span className="about-principle-line" aria-hidden="true" />
            </li>
          )
        })}
      </ul>
    </section>
  )
}
