import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import { Link } from 'react-router'
import {
  ArrowRight,
  ArrowUpRight,
  Camera,
  Eye,
  Film,
  Layers,
  LayoutGrid,
  MonitorPlay,
  SlidersHorizontal,
  Volume2,
  X,
} from 'lucide-react'
import { createPortal } from 'react-dom'
import { LensArt } from '../components/fx/LensArt'
import { Marquee } from '../components/fx/Marquee'
import { SplitTitle } from '../components/fx/SplitTitle'
import { SectionDivider } from '../components/page/PageChrome'
import { ButtonLink } from '../components/ui/ButtonLink'
import FlipCard from '../components/ui/FlipCard'
import { usePageSEO } from '../hooks/usePageMeta'
import { PAGE_SEO } from '../data/seo'
import { revealDelay, useReveal } from '../hooks/useReveal'
import {
  WORK_PROJECTS,
  WORK_CATEGORIES,
  type WorkProject,
} from '../data/workProjects'
import { playCameraShutterSound } from '../utils/cameraShutter'
import { trackPointer } from '../utils/pointerGlow'

type ViewMode = 'grid' | 'spotlight' | 'strip'

const VIEW_MODES = [
  { id: 'grid', label: 'Cinema Tiles', title: 'Cinema Tiles View', icon: LayoutGrid },
  { id: 'spotlight', label: 'Spotlight', title: "Director's Spotlight Split View", icon: MonitorPlay },
  { id: 'strip', label: '35mm Roll', title: '35mm Film Roll View', icon: Film },
] as const

const STUDIO_SPECS = [
  { icon: Camera, value: '4K / 6K RAW', label: 'ARRI & RED Cinema Rigging' },
  { icon: Film, value: 'ANAMORPHIC', label: 'Cooke & Leica Prime Optics' },
  { icon: SlidersHorizontal, value: 'WIDE GAMUT', label: 'DaVinci Resolve ACES Color' },
  { icon: Volume2, value: 'SPATIAL AUDIO', label: 'Dolby Atmos & Sub-Bass Foley' },
] as const

const DISCIPLINES = [
  'CINEMATOGRAPHY',
  '4K LOG-C PIPELINE',
  'ANAMORPHIC GLASS',
  'MEDIUM FORMAT STILLS',
  'DAVINCI RESOLVE ACES COLOR',
  'DOLBY ATMOS SOUND',
  'ROBOTIC MOTION CONTROL',
  'IKASLÉ PRODUCTIONS',
] as const

/** Three formats the studio delivers (wide, portrait, vertical), shown as the hero's contact sheet. */
const HERO_FRAMES = (['kinetic-brand-film', 'human-light', 'vertical-culture'] as const)
  .map((slug) => WORK_PROJECTS.find((project) => project.slug === slug))
  .filter((project): project is WorkProject => Boolean(project))

const pad2 = (n: number) => String(n).padStart(2, '0')

export default function Work() {
  usePageSEO(PAGE_SEO.work)

  const pageRef = useRef<HTMLDivElement>(null)
  useReveal(pageRef)

  // State management
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [spotlightProject, setSpotlightProject] = useState<WorkProject>(WORK_PROJECTS[0])
  const [inspectModalProject, setInspectModalProject] = useState<WorkProject | null>(null)
  const [btsIndex, setBtsIndex] = useState<number>(0)
  const [isFlipped, setIsFlipped] = useState<boolean>(false)
  // Views only play their swap-in animation after the visitor changes something, never on first load.
  const [hasSwapped, setHasSwapped] = useState<boolean>(false)

  const rollRef = useRef<HTMLDivElement | null>(null)
  const rollDrag = useRef({ active: false, moved: false, startX: 0, startScroll: 0 })
  const prefersReducedMotion = useRef(false)

  // Filter projects by category
  const filteredProjects = useMemo(() => {
    if (activeCategory === 'all') return WORK_PROJECTS
    return WORK_PROJECTS.filter((p) => p.categorySlug === activeCategory)
  }, [activeCategory])

  // The spotlight follows the filter: if the chosen project was filtered out, show the first one left.
  const activeSpotlight =
    filteredProjects.find((p) => p.slug === spotlightProject.slug) ?? filteredProjects[0] ?? spotlightProject

  const swapClass = hasSwapped ? ' is-swapped' : ''

  const handleSelectCategory = (id: string) => {
    if (id !== activeCategory) setHasSwapped(true)
    setActiveCategory(id)
    playCameraShutterSound()
  }

  const handleSelectView = (mode: ViewMode) => {
    if (mode !== viewMode) setHasSwapped(true)
    setViewMode(mode)
  }

  // Handle Inspect Frame modal
  const handleInspectFrame = (e: MouseEvent, project: WorkProject) => {
    e.preventDefault()
    e.stopPropagation()
    playCameraShutterSound()
    setInspectModalProject(project)
  }

  // Handle close inspect modal
  const handleCloseInspect = () => {
    setInspectModalProject(null)
  }

  // The hero's contact sheet drifts with the pointer; the offset is written as CSS variables, so nothing re-renders.
  const handleHeroPointerMove = (e: ReactPointerEvent<HTMLElement>) => {
    if (e.pointerType === 'touch' || prefersReducedMotion.current) return
    const rect = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--px', (((e.clientX - rect.left) / rect.width - 0.5) * 2).toFixed(3))
    e.currentTarget.style.setProperty('--py', (((e.clientY - rect.top) / rect.height - 0.5) * 2).toFixed(3))
  }

  const handleHeroPointerLeave = (e: ReactPointerEvent<HTMLElement>) => {
    e.currentTarget.style.setProperty('--px', '0')
    e.currentTarget.style.setProperty('--py', '0')
  }

  // 35mm roll: drag it with a mouse (touch and trackpads already scroll it natively).
  const handleRollPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse' || e.button !== 0 || !rollRef.current) return
    rollDrag.current = { active: true, moved: false, startX: e.clientX, startScroll: rollRef.current.scrollLeft }
  }

  const handleRollPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const drag = rollDrag.current
    const roll = rollRef.current
    if (!drag.active || !roll) return
    const dx = e.clientX - drag.startX
    if (!drag.moved) {
      if (Math.abs(dx) < 6) return
      drag.moved = true
      roll.dataset.dragging = 'true'
      roll.setPointerCapture(e.pointerId)
    }
    roll.scrollLeft = drag.startScroll - dx
  }

  const handleRollPointerEnd = (e: ReactPointerEvent<HTMLDivElement>) => {
    const drag = rollDrag.current
    const roll = rollRef.current
    if (!drag.active || !roll) return
    drag.active = false
    if (drag.moved) {
      delete roll.dataset.dragging
      if (roll.hasPointerCapture(e.pointerId)) roll.releasePointerCapture(e.pointerId)
    }
  }

  useEffect(() => {
    prefersReducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  // Keyboard navigation (Escape key)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && inspectModalProject) {
        handleCloseInspect()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [inspectModalProject])

  const currentBts = WORK_PROJECTS[btsIndex]
  const heroHud = HERO_FRAMES[0]?.hudData

  return (
    <div ref={pageRef} className="page work-page">
      {/* Atmosphere Glows */}
      <div className="work-atmosphere" aria-hidden="true">
        <div className="work-glow work-glow-1" />
        <div className="work-glow work-glow-2" />
        <div className="work-glow work-glow-3" />
      </div>

      {/* =====================================================================
          01 / HERO — title card with a contact sheet of the studio's formats
          ===================================================================== */}
      <header className="work-hero" onPointerMove={handleHeroPointerMove} onPointerLeave={handleHeroPointerLeave}>
        <LensArt
          image="/assets/camera/cinema-camera-placeholder.png"
          spin={false}
          imagePosition="72% 35%"
          className="fx-lens-soft fx-lens-ambient"
        />
        <div className="work-hero-grid">
          <div className="work-hero-copy">
            <div className="work-hero-badge-row" data-reveal>
              <div className="work-rec-indicator">
                <span className="work-rec-dot" aria-hidden="true" />
                <span>LIVE REC 00:24:16:08</span>
              </div>
              <p className="work-hero-eyebrow">PORTFOLIO / SELECTED FRAMES</p>
            </div>

            <SplitTitle
              as="h1"
              className="work-hero-title"
              lines={[{ text: 'FRAMES THAT MOVE.' }, { text: 'STORIES THAT REMAIN.', accent: true }]}
            />

            <p className="work-hero-desc" data-reveal style={revealDelay(4)}>
              From high-octane commercial films and sculpted editorial photography to modular social universes.
              Produced at our Coimbatore studio hub and deployed across South India with cinematic discipline and relentless craft.
            </p>
          </div>

          <div className="work-hero-collage" aria-hidden="true">
            {HERO_FRAMES.map((project, i) => (
              <figure
                key={project.slug}
                className={`work-hero-frame work-hero-frame-${i + 1}`}
                data-reveal
                style={revealDelay(3 + i * 2)}
              >
                <div className="work-hero-frame-inner work-hud">
                  <img src={project.image} alt="" loading="eager" decoding="async" draggable={false} />
                  <figcaption>
                    <span>{project.aspectRatio.split(' ')[0]}</span>
                    <span>{project.timecode}</span>
                  </figcaption>
                </div>
              </figure>
            ))}

            {heroHud && (
              <div className="work-hero-readout" data-reveal style={revealDelay(9)}>
                <span>{heroHud.fps} FPS</span>
                <span>{heroHud.iris}</span>
                <span>ISO {heroHud.iso}</span>
                <span>{heroHud.shutter}</span>
              </div>
            )}
          </div>
        </div>

        {/* Studio Specs Rail */}
        <div className="work-metrics-grid" aria-label="Studio technical highlights" data-reveal style={revealDelay(5)}>
          {STUDIO_SPECS.map(({ icon: Icon, value, label }) => (
            <div key={value} className="work-metric-item">
              <span className="work-metric-value">
                <Icon size={18} className="accent" /> {value}
              </span>
              <span className="work-metric-label">{label}</span>
            </div>
          ))}
        </div>
      </header>

      {/* =====================================================================
          02 / SELECTED FRAMES — filters + three ways to browse the work
          ===================================================================== */}
      <SectionDivider label="02 / SELECTED FRAMES" />
      <div className="work-showcase">
        <div className="section-head work-showcase-head">
          <div className="work-showcase-meta" data-reveal>
            <p className="eyebrow section-eyebrow">Index / {pad2(WORK_PROJECTS.length)} productions</p>
            <p className="work-showcase-count" aria-live="polite">
              <b>{pad2(filteredProjects.length)}</b> / {pad2(WORK_PROJECTS.length)} on screen
            </p>
          </div>
          <SplitTitle as="h2" lines={[{ text: 'A CURATED' }, { text: 'BODY OF WORK.', accent: true }]} />
        </div>

        {/* Controls Bar: Category Filters & View Modes */}
        <section className="work-controls-sticky" aria-label="Portfolio filters and display options">
          <div className="work-controls-container">
            {/* Category Tabs */}
            <nav className="work-categories-nav" aria-label="Work Categories">
              {WORK_CATEGORIES.map((cat) => {
                const count =
                  cat.id === 'all'
                    ? WORK_PROJECTS.length
                    : WORK_PROJECTS.filter((p) => p.categorySlug === cat.id).length
                return (
                  <button
                    key={cat.id}
                    type="button"
                    className={`work-category-tab ${activeCategory === cat.id ? 'active' : ''}`}
                    onClick={() => handleSelectCategory(cat.id)}
                    aria-pressed={activeCategory === cat.id}
                  >
                    <span>{cat.label}</span>
                    <span className="work-cat-count">{count}</span>
                  </button>
                )
              })}
            </nav>

            {/* View Modes */}
            <div className="work-view-modes" role="group" aria-label="View Modes">
              {VIEW_MODES.map(({ id, label, title, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  className={`work-view-btn ${viewMode === id ? 'active' : ''}`}
                  onClick={() => handleSelectView(id)}
                  aria-pressed={viewMode === id}
                  title={title}
                >
                  <Icon size={15} /> {label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------------
            VIEW 1: CINEMA TILES — an editorial grid: one poster, one split, a staggered trio
            --------------------------------------------------------------- */}
        {viewMode === 'grid' && (
          <section
            key={`grid-${activeCategory}`}
            className={`work-grid-view${swapClass}`}
            aria-label="Selected Works Grid"
          >
            {filteredProjects.map((project, idx) => (
              <article
                key={project.slug}
                className={`work-tile-card project-${project.tone} ${
                  idx === 0 ? 'is-feature' : idx === 1 ? 'is-split' : 'is-tall'
                }`}
                onPointerMove={trackPointer}
              >
                <span className="fx-spot" aria-hidden="true" />
                {/* Makes the whole card a click target; the visible "Explore Case Study" link stays the accessible one. */}
                <Link
                  to={`/work/${project.slug}`}
                  className="work-tile-hit"
                  aria-hidden="true"
                  tabIndex={-1}
                  draggable={false}
                />

                <div className="work-tile-media-wrap" onPointerMove={trackPointer}>
                  <img
                    src={project.image}
                    alt={project.title}
                    className="work-tile-img"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="work-tile-overlay" />

                  <div className="work-tile-top-chips">
                    <span className="work-tile-aspect-badge">{project.aspectRatio}</span>
                    <button
                      type="button"
                      className="work-tile-inspect-btn"
                      onClick={(e) => handleInspectFrame(e, project)}
                      aria-label={`Inspect ${project.title} camera frame`}
                    >
                      <Eye size={13} /> Inspect Frame
                    </button>
                  </div>

                  <span className="work-tile-view" aria-hidden="true">
                    View case <ArrowUpRight size={14} />
                  </span>
                </div>

                <div className="work-tile-content">
                  <div className="work-tile-meta-row">
                    <span className="work-tile-category">{project.category}</span>
                    <span className="work-tile-year">{project.year}</span>
                  </div>

                  <h2 className="work-tile-title">{project.title}</h2>
                  <p className="work-tile-summary">{project.summary}</p>

                  <div className="work-tile-specs-row" aria-label="Camera and lighting specifications">
                    <span className="work-tile-spec-tag">{project.cameraPackage}</span>
                    <span className="work-tile-spec-tag">{project.lensPackage}</span>
                    <span className="work-tile-spec-tag">{project.hudData.lut}</span>
                  </div>

                  <div className="work-tile-footer">
                    <Link to={`/work/${project.slug}`} className="work-tile-cta-link">
                      Explore Case Study <ArrowRight size={15} />
                    </Link>
                    <span className="work-tile-timecode">{project.timecode}</span>
                  </div>
                </div>
              </article>
            ))}
          </section>
        )}

        {/* ---------------------------------------------------------------
            VIEW 2: DIRECTOR'S SPOTLIGHT — a playlist beside a live monitor
            --------------------------------------------------------------- */}
        {viewMode === 'spotlight' && (
          <section
            key={`spotlight-${activeCategory}`}
            className={`work-spotlight-view${swapClass}`}
            aria-label="Director's Spotlight Console"
          >
            {/* Left: Project Selector List */}
            <div className="work-spotlight-list" role="tablist" aria-label="Project Selection">
              {filteredProjects.map((project, i) => {
                const isSelected = activeSpotlight.slug === project.slug
                return (
                  <button
                    key={project.slug}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    className={`work-spotlight-item project-${project.tone} ${isSelected ? 'active' : ''}`}
                    onClick={() => {
                      setSpotlightProject(project)
                      playCameraShutterSound()
                    }}
                    onMouseEnter={() => setSpotlightProject(project)}
                  >
                    <span className="work-spotlight-item-num" aria-hidden="true">
                      {pad2(i + 1)}
                    </span>
                    <span className="work-spotlight-item-left">
                      <span className="work-spotlight-item-index">{project.timecode}</span>
                      <h3 className="work-spotlight-item-title">{project.title}</h3>
                      <span className="work-spotlight-item-cat">{project.category}</span>
                    </span>
                    <span className="work-spotlight-item-arrow" aria-hidden="true">
                      <ArrowRight size={16} />
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Right: Live Monitor Viewport */}
            <div className="work-spotlight-monitor">
              <div key={activeSpotlight.slug} className="work-spotlight-preview-wrap work-hud">
                <img
                  src={activeSpotlight.image}
                  alt={activeSpotlight.title}
                  className="work-spotlight-preview-img"
                />
                <span className="work-spotlight-hud-badge">
                  {activeSpotlight.hudData.fps} · {activeSpotlight.aspectRatio} · ISO {activeSpotlight.hudData.iso}
                </span>
              </div>

              <div key={`${activeSpotlight.slug}-details`} className="work-spotlight-details">
                <div>
                  <p className="eyebrow">{activeSpotlight.category} / {activeSpotlight.client}</p>
                  <h2 className="work-spotlight-title">{activeSpotlight.title}</h2>
                  <p className="work-spotlight-summary">{activeSpotlight.summary}</p>
                </div>

                {/* Technical Specifications Matrix */}
                <div className="work-spotlight-spec-grid">
                  <div className="work-spotlight-spec-item">
                    <span className="work-spotlight-spec-label">Camera Package</span>
                    <span className="work-spotlight-spec-val">{activeSpotlight.cameraPackage}</span>
                  </div>
                  <div className="work-spotlight-spec-item">
                    <span className="work-spotlight-spec-label">Optical Glass</span>
                    <span className="work-spotlight-spec-val">{activeSpotlight.lensPackage}</span>
                  </div>
                  <div className="work-spotlight-spec-item">
                    <span className="work-spotlight-spec-label">Lighting Setup</span>
                    <span className="work-spotlight-spec-val">{activeSpotlight.lightingSetup}</span>
                  </div>
                  <div className="work-spotlight-spec-item">
                    <span className="work-spotlight-spec-label">Color Finishing</span>
                    <span className="work-spotlight-spec-val">{activeSpotlight.colorGrade}</span>
                  </div>
                </div>

                <div className="work-spotlight-actions">
                  <ButtonLink to={`/work/${activeSpotlight.slug}`}>
                    View Full Case Study
                  </ButtonLink>
                  <button
                    type="button"
                    className="button button-secondary"
                    onClick={(e) => handleInspectFrame(e, activeSpotlight)}
                  >
                    <Eye size={15} /> Inspect Frame HUD
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ---------------------------------------------------------------
            VIEW 3: 35MM FILM STRIP — a draggable negative roll
            --------------------------------------------------------------- */}
        {viewMode === 'strip' && (
          <section
            key={`strip-${activeCategory}`}
            className={`work-strip-view${swapClass}`}
            aria-label="35mm Motion Picture Roll"
          >
            {/* Top Sprocket Perforations */}
            <div className="film-sprocket-edge" aria-hidden="true">
              <div className="film-sprockets-row">
                {Array.from({ length: 48 }).map((_, i) => (
                  <span key={i} className="film-sprocket-hole" />
                ))}
              </div>
            </div>

            {/* Film Roll Items */}
            <div
              ref={rollRef}
              className="film-roll-container"
              role="group"
              aria-label="Film frames, scroll sideways"
              tabIndex={0}
              onPointerDown={handleRollPointerDown}
              onPointerMove={handleRollPointerMove}
              onPointerUp={handleRollPointerEnd}
              onPointerCancel={handleRollPointerEnd}
            >
              {filteredProjects.map((project, i) => (
                <div key={project.slug} className="film-roll-frame">
                  <div className="film-frame-header">
                    <span>KODAK 5219</span>
                    <span>FRAME {pad2(i + 1)}</span>
                    <span>{project.timecode}</span>
                  </div>

                  <div className="film-frame-media">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="film-frame-img"
                      loading="lazy"
                      decoding="async"
                      draggable={false}
                    />
                  </div>

                  <div className="film-frame-footer">
                    <span className="eyebrow film-frame-cat">{project.category}</span>
                    <h3 className="film-frame-title">{project.title}</h3>
                    <p className="film-frame-tagline">{project.tagline}</p>
                    <div className="film-frame-actions">
                      <Link to={`/work/${project.slug}`} className="button" draggable={false}>
                        Case Study
                      </Link>
                      <button
                        type="button"
                        className="button button-secondary"
                        onClick={(e) => handleInspectFrame(e, project)}
                      >
                        <Eye size={13} /> Inspect
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Sprocket Perforations */}
            <div className="film-sprocket-edge is-reverse" aria-hidden="true">
              <div className="film-sprockets-row">
                {Array.from({ length: 48 }).map((_, i) => (
                  <span key={i} className="film-sprocket-hole" />
                ))}
              </div>
            </div>
          </section>
        )}
      </div>

      {/* =====================================================================
          03 / BEHIND THE LENS — a project index beside the 3D FlipCard
          ===================================================================== */}
      <SectionDivider label="03 / BEHIND THE LENS" />
      <section className="work-bts-section" aria-label="Behind the Lens 3D Inspection">
        <div className="work-bts-layout">
          <div className="work-bts-side">
            <div className="work-bts-head">
              <p className="eyebrow section-eyebrow" data-reveal>DIRECTOR'S ARCHIVE / BEHIND THE LENS</p>
              <SplitTitle as="h2" lines={[{ text: '3D SPECIFICATION' }, { text: 'BREAKDOWN', accent: true }]} />
              <p data-reveal style={revealDelay(3)}>
                Flip through the technical blueprints of our selected productions: camera rigs, optical packages,
                lighting schematics, and color grading LUTs.
              </p>
            </div>

            {/* Project Selector */}
            <div
              className="work-bts-selector-row"
              role="tablist"
              aria-orientation="vertical"
              aria-label="Select production to inspect"
            >
              {WORK_PROJECTS.map((proj, idx) => (
                <button
                  key={proj.slug}
                  type="button"
                  role="tab"
                  aria-selected={btsIndex === idx}
                  className={`work-bts-nav-pill ${btsIndex === idx ? 'active' : ''}`}
                  onClick={() => {
                    setBtsIndex(idx)
                    setIsFlipped(false)
                    playCameraShutterSound()
                  }}
                >
                  <span className="work-bts-nav-index" aria-hidden="true">{pad2(idx + 1)}</span>
                  <span className="work-bts-nav-text">
                    <span className="work-bts-nav-title">{proj.title}</span>
                    <span className="work-bts-nav-cat">{proj.category}</span>
                  </span>
                  <ArrowRight size={15} className="work-bts-nav-arrow" aria-hidden="true" />
                </button>
              ))}
            </div>
          </div>

          {/* FlipCard Component */}
          <div className="work-bts-card-container">
            <FlipCard
              width="100%"
              height="calc(500px + var(--bts-extra, 0px))"
              radius={24}
              tiltMax={10}
              glareOpacity={0.25}
              shadowColor="#8b5cf6"
              shadowOpacity={0.2}
              flipped={isFlipped}
              onFlipChange={(flipped) => {
                setIsFlipped(flipped)
                if (flipped) playCameraShutterSound()
              }}
              front={
                <div className="work-flip-face-front work-hud">
                  <img
                    src={currentBts.image}
                    alt={currentBts.title}
                    className="work-flip-bg-img"
                  />
                  <div className="work-flip-overlay" />

                  <div className="work-flip-front-top">
                    <span className="eyebrow work-flip-eyebrow">{currentBts.category}</span>
                    <span className="work-flip-cue">
                      <Layers size={13} /> Click or Drag to Flip Specs
                    </span>
                  </div>

                  <div className="work-flip-front-bottom">
                    <h3 className="work-flip-title">{currentBts.title}</h3>
                    <p className="work-flip-tagline">{currentBts.tagline}</p>
                  </div>
                </div>
              }
              back={
                <div className="work-flip-face-back">
                  <div className="work-flip-back-top">
                    <span className="eyebrow work-flip-eyebrow">{currentBts.title} — TECHNICAL SHEET</span>
                    <span className="work-flip-cue">
                      <Layers size={13} /> Flip back to frame
                    </span>
                  </div>

                  <blockquote className="work-flip-quote">
                    "{currentBts.quote}"
                  </blockquote>

                  <div className="work-flip-spec-list">
                    <div className="work-flip-spec-row">
                      <span>Camera Body</span>
                      <strong>{currentBts.cameraPackage}</strong>
                    </div>
                    <div className="work-flip-spec-row">
                      <span>Optics</span>
                      <strong>{currentBts.lensPackage}</strong>
                    </div>
                    <div className="work-flip-spec-row">
                      <span>Lighting Setup</span>
                      <strong>{currentBts.lightingSetup}</strong>
                    </div>
                    <div className="work-flip-spec-row">
                      <span>Color Profile</span>
                      <strong>{currentBts.colorGrade}</strong>
                    </div>
                    <div className="work-flip-spec-row">
                      <span>Audio Design</span>
                      <strong>{currentBts.soundDesign}</strong>
                    </div>
                    <div className="work-flip-spec-row">
                      <span>Native Frame Aspect</span>
                      <strong>{currentBts.aspectRatio}</strong>
                    </div>
                  </div>

                  <div className="work-flip-back-foot">
                    <Link
                      to={`/work/${currentBts.slug}`}
                      className="button"
                      onClick={(e) => e.stopPropagation()}
                    >
                      View Project Case Study <ArrowRight size={15} />
                    </Link>
                    <span className="work-flip-timecode">{currentBts.timecode}</span>
                  </div>
                </div>
              }
            />

            <div className="work-bts-foot" aria-hidden="true">
              <span>
                <b>{pad2(btsIndex + 1)}</b> / {pad2(WORK_PROJECTS.length)}
              </span>
              <span>{currentBts.timecode}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Production Ribbon — an angled band of disciplines closing the chapters */}
      <div className="work-band" aria-hidden="true">
        <Marquee className="work-band-ticker" items={DISCIPLINES} duration={40} />
        <Marquee className="work-band-ghost" items={DISCIPLINES} duration={90} reverse outline />
      </div>

      {/* =====================================================================
          FRAME INSPECTOR MODAL (Full Viewfinder HUD)
          ===================================================================== */}
      {inspectModalProject &&
        createPortal(
          <div
            className="work-modal-backdrop"
            onClick={handleCloseInspect}
            role="dialog"
            aria-modal="true"
            aria-label={`Viewfinder Inspection: ${inspectModalProject.title}`}
          >
            <div className="work-modal-frame" onClick={(e) => e.stopPropagation()}>
              {/* Modal Top Bar */}
              <div className="work-modal-top">
                <div className="work-modal-rec">
                  <span className="work-rec-dot" />
                  <span className="work-modal-rec-text">
                    REC [PAUSED] · {inspectModalProject.timecode}
                  </span>
                </div>

                <div className="cine-specs-chips">
                  <span className="cine-spec-chip">ISO {inspectModalProject.hudData.iso}</span>
                  <span className="cine-spec-chip">{inspectModalProject.hudData.shutter}</span>
                  <span className="cine-spec-chip">{inspectModalProject.hudData.wb}</span>
                  <span className="cine-spec-chip">{inspectModalProject.hudData.iris}</span>
                  <span className="cine-spec-chip">{inspectModalProject.hudData.fps}</span>
                </div>

                <button
                  type="button"
                  className="cinema-tool-btn cinema-close-btn"
                  onClick={handleCloseInspect}
                  aria-label="Close viewfinder (Esc)"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Viewport with Live HUD Guides */}
              <div className="work-modal-viewport">
                <img
                  src={inspectModalProject.image}
                  alt={inspectModalProject.title}
                  className="work-modal-img"
                />

                <div className="cine-hud-overlay" aria-hidden="true">
                  <div className="cine-hud-corner tl" />
                  <div className="cine-hud-corner tr" />
                  <div className="cine-hud-corner bl" />
                  <div className="cine-hud-corner br" />
                  <div className="cine-hud-crosshair" />
                  <div className="cine-hud-rule-lines" />
                </div>
              </div>

              {/* Modal Bottom Metadata */}
              <div className="work-modal-bottom">
                <div className="work-modal-info">
                  <span className="eyebrow work-modal-eyebrow">
                    {inspectModalProject.category} / {inspectModalProject.aspectRatio}
                  </span>
                  <h3>{inspectModalProject.title}</h3>
                  <p>{inspectModalProject.summary}</p>
                </div>

                <div className="work-modal-actions">
                  <Link
                    to={`/work/${inspectModalProject.slug}`}
                    className="button"
                    onClick={handleCloseInspect}
                  >
                    Read Full Case Study <ArrowRight size={15} />
                  </Link>
                  <button
                    type="button"
                    className="button button-secondary"
                    onClick={handleCloseInspect}
                  >
                    Close Viewfinder
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* =====================================================================
          CALL TO ACTION — a clapperboard slate that claps shut as it arrives
          ===================================================================== */}
      <section className="work-slate" aria-labelledby="work-cta-title">
        <div className="work-slate-card" data-reveal>
          <div className="work-slate-arm" aria-hidden="true" />
          <div className="work-slate-bar" aria-hidden="true" />

          <div className="work-slate-body">
            <dl className="work-slate-fields" aria-hidden="true">
              <div>
                <dt>Prod.</dt>
                <dd>IKASLÉ Productions</dd>
              </div>
              <div>
                <dt>Scene</dt>
                <dd>01</dd>
              </div>
              <div>
                <dt>Take</dt>
                <dd>01</dd>
              </div>
            </dl>

            <div className="work-slate-main">
              <h2 id="work-cta-title" className="work-slate-title">
                HAVE A VISION<br />
                <span className="accent">TO BRING INTO FOCUS?</span>
              </h2>

              <div className="work-slate-aside">
                <p>
                  Whether you need a full commercial campaign, cinematic brand films, or high-end editorial
                  photography, our production studio is ready to frame your story.
                </p>
                <div className="work-slate-actions">
                  <ButtonLink to="/contact">Discuss your project</ButtonLink>
                  <ButtonLink to="/services" secondary>Explore Services</ButtonLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
