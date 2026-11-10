import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { Link } from 'react-router'
import { ArrowRight, ChevronDown, ChevronUp } from 'lucide-react'
import gsap from 'gsap'
import {
  FRAME_FORMATS,
  type FrameFormat,
  type ServiceDetailConfig,
  type ServiceDiscipline,
} from '../../data/serviceDetails'
import { Timecode } from '../page/Timecode'

export function ServiceDisciplines({ config }: { config: ServiceDetailConfig }) {
  const { items, title, subtitle } = config.disciplines
  const { previewStyle } = config
  const PreviewIcon = config.previewIcon
  const total = items.length
  const totalLabel = String(total).padStart(2, '0')

  const [activeId, setActiveId] = useState(items[0].id)
  const [expandedMobileId, setExpandedMobileId] = useState<string | null>(items[0].id)
  // Viewer's own format pick; only applies to the discipline it was made on.
  const [formatChoice, setFormatChoice] = useState<{ id: string; format: FrameFormat } | null>(null)

  const previewImgRef = useRef<HTMLImageElement>(null)
  const previewInfoRef = useRef<HTMLDivElement>(null)

  const active: ServiceDiscipline = items.find((item) => item.id === activeId) ?? items[0]
  const format: FrameFormat = formatChoice?.id === active.id ? formatChoice.format : (active.format ?? '9:16')
  const frameRatio = FRAME_FORMATS.find((f) => f.value === format)?.ratio ?? 9 / 16
  const formatLabel = FRAME_FORMATS.find((f) => f.value === format)?.label ?? ''

  // Preload every discipline image so switching on hover is instant.
  useEffect(() => {
    items.forEach((item) => {
      const img = new Image()
      img.src = item.image
    })
  }, [items])

  // Entrance animation whenever the active discipline changes.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    if (previewImgRef.current) {
      gsap.fromTo(
        previewImgRef.current,
        { opacity: 0.15, scale: 1.05 },
        { opacity: 1, scale: 1, duration: 0.48, ease: 'power2.out', clearProps: 'transform' },
      )
    }

    if (previewInfoRef.current) {
      gsap.fromTo(
        previewInfoRef.current,
        { opacity: 0.2, y: 8 },
        { opacity: 1, y: 0, duration: 0.38, ease: 'power2.out', clearProps: 'transform' },
      )
    }
  }, [active.id])

  const handleSelect = (id: string) => {
    if (id !== activeId) setActiveId(id)
  }

  const handleMobileToggle = (id: string) => {
    setExpandedMobileId((prev) => (prev === id ? null : id))
  }

  const contactHref = (disciplineId: string) => `/contact?service=${config.slug}&discipline=${disciplineId}`

  const hudStatus = {
    camera: `${active.index} / ${totalLabel}`,
    cinema: null,
    format: `LIVE · ${active.index} / ${totalLabel}`,
    studio: `IDEA ${active.index} / ${totalLabel}`,
  }[previewStyle]

  const imageStyle: CSSProperties | undefined = active.focus ? { objectPosition: active.focus } : undefined

  return (
    <section className="svc-disciplines-section" aria-labelledby="svc-disciplines-heading">
      {/* Section Header */}
      <div className="disciplines-header" data-reveal>
        <div className="disciplines-eyebrow-row">
          <p className="eyebrow">02 / SPECIALISED DISCIPLINES</p>
          <span className="disciplines-count-pill">{total} CAPABILITIES</span>
        </div>
        <h2 id="svc-disciplines-heading" className="disciplines-title">
          {title}
        </h2>
        <p className="disciplines-subtitle">{subtitle}</p>
      </div>

      {/* Desktop View: vertical list (left) + dynamic preview (right) */}
      <div className="disciplines-interactive-container">
        <div
          className="disciplines-list"
          role="tablist"
          aria-orientation="vertical"
          aria-label={`${config.title.toLowerCase()} services list`}
        >
          {items.map((item, i) => {
            const isActive = item.id === active.id
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                id={`tab-${item.id}`}
                aria-selected={isActive}
                aria-controls="discipline-panel"
                data-reveal
                style={{ '--reveal-delay': i } as CSSProperties}
                className={`discipline-item-btn ${isActive ? 'is-active' : ''}`}
                onMouseEnter={() => handleSelect(item.id)}
                onFocus={() => handleSelect(item.id)}
                onClick={() => handleSelect(item.id)}
              >
                <div className="discipline-item-indicator" aria-hidden="true" />
                <span className="discipline-item-index">{item.index}</span>
                <div className="discipline-item-info">
                  <h3 className="discipline-item-title">{item.title}</h3>
                  <span className="discipline-item-tagline">{item.tagline}</span>
                </div>
                <div className="discipline-item-arrow" aria-hidden="true">
                  <ArrowRight size={16} />
                </div>
              </button>
            )
          })}
        </div>

        {/* Dynamic Preview Area (sticky on desktop) */}
        <div
          id="discipline-panel"
          role="tabpanel"
          aria-labelledby={`tab-${active.id}`}
          className="disciplines-preview-area"
          aria-live="polite"
          data-reveal
          style={{ '--reveal-delay': 2 } as CSSProperties}
        >
          <div className="preview-sticky-wrap">
            <div className={`preview-glass-frame is-${previewStyle}`}>
              {/* HUD top bar */}
              <div className="preview-hud-top">
                <div className="hud-lens-data">
                  <PreviewIcon size={13} className="accent" aria-hidden="true" />
                  <span>{active.specs}</span>
                </div>
                <div className="hud-badge-rec">
                  <span className="hud-rec-dot" aria-hidden="true" />
                  {previewStyle === 'cinema' ? (
                    <span>
                      REC <Timecode key={active.id} />
                    </span>
                  ) : (
                    <span>{hudStatus}</span>
                  )}
                </div>
              </div>

              {/* Dynamic image viewport */}
              <div className={`preview-image-viewport is-${previewStyle}`}>
                {previewStyle === 'format' ? (
                  <div className="preview-format-stage">
                    <img
                      key={`backdrop-${active.id}`}
                      src={active.image}
                      alt=""
                      aria-hidden="true"
                      className="preview-backdrop"
                      style={imageStyle}
                    />
                    <div className="preview-format-frame" style={{ '--ratio': frameRatio } as CSSProperties}>
                      <img
                        ref={previewImgRef}
                        key={active.id}
                        src={active.image}
                        alt={active.alt}
                        className="preview-image"
                        style={imageStyle}
                        loading="eager"
                      />
                      <span className="preview-format-tag">
                        {format} · {formatLabel}
                      </span>
                    </div>
                  </div>
                ) : (
                  <img
                    ref={previewImgRef}
                    key={active.id}
                    src={active.image}
                    alt={active.alt}
                    className="preview-image"
                    style={imageStyle}
                    loading="eager"
                  />
                )}
                <div className="preview-image-overlay" aria-hidden="true" />

                {/* Style-specific HUD overlays */}
                <div className="preview-hud-overlay" aria-hidden="true">
                  <div className="preview-hud-corner top-left" />
                  <div className="preview-hud-corner top-right" />
                  <div className="preview-hud-corner bottom-left" />
                  <div className="preview-hud-corner bottom-right" />
                  {previewStyle === 'camera' && <div className="preview-hud-crosshair" />}
                  {previewStyle === 'cinema' && (
                    <div key={active.id} className="cinema-bars">
                      <span className="cinema-bar is-top" />
                      <span className="cinema-bar is-bottom" />
                    </div>
                  )}
                  {previewStyle === 'studio' && (
                    <div key={active.id} className="studio-grid">
                      <i className="studio-line is-v1" />
                      <i className="studio-line is-v2" />
                      <i className="studio-line is-h1" />
                      <i className="studio-line is-h2" />
                      <b className="studio-pin is-p1" />
                      <b className="studio-pin is-p2" />
                      <b className="studio-pin is-p3" />
                      <b className="studio-pin is-p4" />
                    </div>
                  )}
                </div>

                {previewStyle === 'format' && (
                  <div className="preview-format-switcher" role="group" aria-label="Preview format">
                    {FRAME_FORMATS.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        className={`format-chip ${option.value === format ? 'is-active' : ''}`}
                        aria-pressed={option.value === format}
                        onClick={() => setFormatChoice({ id: active.id, format: option.value })}
                      >
                        <span className="format-chip-ratio">{option.value}</span>
                        <span className="format-chip-label">{option.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Info drawer for the active discipline */}
              <div ref={previewInfoRef} className="preview-info-drawer">
                <span className="preview-index-label">{active.index} / SERVICE OVERVIEW</span>
                <h4 className="preview-service-title">{active.title}</h4>
                <p className="preview-service-desc">{active.description}</p>

                <div className="preview-deliverables-strip">
                  <span className="strip-label">KEY DELIVERABLES:</span>
                  <div className="strip-tags">
                    {active.deliverables.map((item) => (
                      <span key={item} className="strip-tag">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <Link
                  to={contactHref(active.id)}
                  className="preview-enquire-btn"
                  aria-label={`Enquire about ${active.title}`}
                >
                  <span>Enquire about {active.title}</span>
                  <ArrowRight size={15} aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile View: tap-to-expand accordion (< 940px) */}
      <div className="disciplines-mobile-accordion" aria-label={`${config.title.toLowerCase()} services list`}>
        {items.map((item, i) => {
          const isExpanded = expandedMobileId === item.id
          return (
            <div
              key={item.id}
              data-reveal
              style={{ '--reveal-delay': i } as CSSProperties}
              className={`mobile-discipline-card glass ${isExpanded ? 'is-expanded' : ''}`}
            >
              <button
                type="button"
                className="mobile-card-trigger"
                onClick={() => handleMobileToggle(item.id)}
                aria-expanded={isExpanded}
                aria-controls={`mobile-panel-${item.id}`}
              >
                <span className="mobile-card-index">{item.index}</span>
                <span className="mobile-card-title">{item.title}</span>
                <span className="mobile-card-toggle-icon" aria-hidden="true">
                  {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </span>
              </button>

              {isExpanded && (
                <div id={`mobile-panel-${item.id}`} className="mobile-card-body">
                  <div className="mobile-card-img-wrap">
                    <img
                      src={item.image}
                      alt={item.alt}
                      className="mobile-card-img"
                      style={item.focus ? { objectPosition: item.focus } : undefined}
                      loading="lazy"
                    />
                    <div className="mobile-hud-badge">{item.specs}</div>
                  </div>

                  <p className="mobile-card-desc">{item.description}</p>

                  <div className="mobile-card-deliverables">
                    <span className="mobile-subhead">Key Deliverables:</span>
                    <div className="strip-tags">
                      {item.deliverables.map((deliverable) => (
                        <span key={deliverable} className="strip-tag">
                          {deliverable}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Link to={contactHref(item.id)} className="button mobile-enquire-btn">
                    <span>Discuss {item.title}</span>
                    <ArrowRight size={15} aria-hidden="true" />
                  </Link>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
