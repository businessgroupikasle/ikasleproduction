import type { CSSProperties } from 'react'
import { aboutProcess } from '../../data/about'
import { process as steps } from '../../data/site'

/**
 * The six stages as a strip of film frames. When it scrolls into view a "playhead" sweeps across and
 * each frame lights up as it passes; hovering or focusing a frame dims the others (see about.css).
 * On small screens the strip scrolls sideways with snap points.
 */
export function AboutProcess() {
  return (
    <section className="about-process" aria-labelledby="about-process-heading">
      <div className="disciplines-header" data-reveal>
        <div className="disciplines-eyebrow-row">
          <p className="eyebrow">{aboutProcess.eyebrow}</p>
          <span className="disciplines-count-pill">{steps.length} STAGES</span>
        </div>
        <h2 id="about-process-heading" className="disciplines-title">
          {aboutProcess.title}
        </h2>
        <p className="disciplines-subtitle">{aboutProcess.subtitle}</p>
      </div>

      <div className="about-strip-wrap" data-reveal role="region" aria-label="Project process stages" tabIndex={0}>
        <div className="about-strip-inner">
          <ol className="about-strip">
            {steps.map(([index, title, text], i) => (
              <li
                key={index}
                className="about-frame-card"
                data-reveal
                tabIndex={0}
                style={{ '--reveal-delay': i * 5, '--frame': i } as CSSProperties}
              >
                <span className="about-sprockets is-top" aria-hidden="true" />
                <div className="about-frame-body">
                  <span className="about-frame-index" aria-hidden="true">
                    {index}
                  </span>
                  <h3>{title}</h3>
                  <p>{text}</p>
                  <span className="about-frame-meter" aria-hidden="true">
                    <i />
                  </span>
                </div>
                <span className="about-sprockets is-bottom" aria-hidden="true" />
              </li>
            ))}
          </ol>
          <span className="about-playhead" aria-hidden="true" />
        </div>
      </div>
    </section>
  )
}
