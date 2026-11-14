import { Navigate, useParams, Link } from 'react-router'
import { ArrowLeft, ArrowRight, Camera, Clapperboard, Film, Layers, Lightbulb } from 'lucide-react'
import { LensArt } from '../components/fx/LensArt'
import { ButtonLink } from '../components/ui/ButtonLink'
import { usePageMeta } from '../hooks/usePageMeta'
import { getProjectSEO } from '../data/seo'
import { WORK_PROJECTS } from '../data/workProjects'
import { projects } from '../data/site'

export default function ProjectDetail() {
  const { slug } = useParams()
  const richProject = WORK_PROJECTS.find((item) => item.slug === slug)
  const fallbackProject = projects.find((item) => item.slug === slug)

  const projectTitle = richProject?.title ?? fallbackProject?.title ?? 'Project'
  const projectSummary = richProject?.summary ?? fallbackProject?.summary ?? 'IKASLÉ Productions project.'
  const projectSEO = richProject
    ? getProjectSEO(richProject)
    : fallbackProject
      ? getProjectSEO(fallbackProject)
      : undefined

  usePageMeta(
    projectSEO?.title ?? projectTitle,
    projectSEO?.description ?? projectSummary,
    projectSEO
      ? {
          keywords: projectSEO.keywords,
          image: projectSEO.image,
          type: projectSEO.type,
          canonicalPath: projectSEO.canonicalPath,
          structuredData: projectSEO.structuredData,
        }
      : undefined,
  )

  if (!richProject && !fallbackProject) {
    return <Navigate to="/404" replace />
  }

  const tone = richProject?.tone ?? fallbackProject?.tone ?? 'violet'
  const category = richProject?.category ?? fallbackProject?.category ?? 'Production'
  const year = richProject?.year ?? fallbackProject?.year ?? '2025'
  const image = richProject?.image ?? (fallbackProject && 'image' in fallbackProject ? (fallbackProject.image as string) : undefined)

  // Next and previous projects for navigation
  const currentIndex = WORK_PROJECTS.findIndex((p) => p.slug === slug)
  const nextProject = currentIndex >= 0 ? WORK_PROJECTS[(currentIndex + 1) % WORK_PROJECTS.length] : WORK_PROJECTS[0]
  const prevProject = currentIndex > 0 ? WORK_PROJECTS[currentIndex - 1] : WORK_PROJECTS[WORK_PROJECTS.length - 1]

  return (
    <div className={`page project-detail project-detail-page project-${tone}`}>
      {/* Back Link */}
      <Link className="back-link" to="/portfolio">
        <ArrowLeft size={16} /> All Selected Work
      </Link>

      {/* Hero Header with Media Overlay */}
      <header className={`project-detail-hero project-${tone}`}>
        {image && (
          <div className="project-detail-hero-bg" aria-hidden="true">
            <img src={image} alt="" className="project-detail-hero-img" />
            <div className="project-detail-hero-gradient" />
          </div>
        )}
        <LensArt image="/assets/services/camera-lens.jpg" className="fx-lens-soft" />

        <div className="project-detail-hero-inner">
          <div className="project-detail-chips">
            <span className="sample-chip">PRODUCTION CASE STUDY</span>
            {richProject?.aspectRatio && (
              <span className="sample-chip">{richProject.aspectRatio}</span>
            )}
            {richProject?.timecode && (
              <span className="sample-chip font-mono">{richProject.timecode}</span>
            )}
          </div>

          <p className="project-detail-eyebrow">
            {category} / {year} {richProject?.client ? `— ${richProject.client}` : ''}
          </p>

          <h1 className="project-detail-heading">{projectTitle}</h1>

          {richProject?.tagline && (
            <p className="project-detail-tagline">{richProject.tagline}</p>
          )}
        </div>
      </header>

      {/* The Premise & Technical Pipeline */}
      <section className="case-grid">
        <div>
          <p className="eyebrow">THE PREMISE & VISION</p>
          <h2>Crafted for visual resonance and emotional gravity.</h2>
          {richProject?.quote && (
            <blockquote className="project-quote-block">
              "{richProject.quote}"
            </blockquote>
          )}
        </div>

        <div>
          <p className="project-lead-summary">{projectSummary}</p>
          <p>
            From the initial treatment through to the final deliverable, this project was developed
            under IKASLÉ's unified production system—ensuring technical precision, nuanced lighting,
            and an authentic visual signature.
          </p>

          {/* Deliverables List */}
          {richProject?.deliverables && (
            <div className="project-deliverables-box">
              <span className="eyebrow" style={{ color: '#c4a2ff' }}>DELIVERABLES & ASSETS</span>
              <ul className="project-deliverables-list">
                {richProject.deliverables.map((item, idx) => (
                  <li key={idx}>
                    <span className="deliverable-bullet">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* Technical Specifications Matrix */}
      {richProject && (
        <section className="project-specs-section">
          <div className="project-specs-container">
            <div className="project-specs-header">
              <p className="eyebrow">PRODUCTION SHEET / TECHNICAL SPECIFICATIONS</p>
              <h2>BEHIND THE CAMERA</h2>
            </div>

            <div className="project-specs-cards-grid">
              <div className="project-spec-card">
                <div className="project-spec-card-icon"><Camera size={20} /></div>
                <span className="project-spec-card-label">Camera Package</span>
                <strong className="project-spec-card-val">{richProject.cameraPackage}</strong>
                <small className="project-spec-card-hint">Native ISO & Sensor Package</small>
              </div>

              <div className="project-spec-card">
                <div className="project-spec-card-icon"><Film size={20} /></div>
                <span className="project-spec-card-label">Optical Glass</span>
                <strong className="project-spec-card-val">{richProject.lensPackage}</strong>
                <small className="project-spec-card-hint">Prime Cinema Anamorphic</small>
              </div>

              <div className="project-spec-card">
                <div className="project-spec-card-icon"><Lightbulb size={20} /></div>
                <span className="project-spec-card-label">Lighting Design</span>
                <strong className="project-spec-card-val">{richProject.lightingSetup}</strong>
                <small className="project-spec-card-hint">Key, Fill & Atmospheric FX</small>
              </div>

              <div className="project-spec-card">
                <div className="project-spec-card-icon"><Layers size={20} /></div>
                <span className="project-spec-card-label">Color Finishing</span>
                <strong className="project-spec-card-val">{richProject.colorGrade}</strong>
                <small className="project-spec-card-hint">ACES & DaVinci Wide Gamut</small>
              </div>
            </div>

            {/* Behind the scenes plate if present */}
            {richProject.btsImage && (
              <div className="project-bts-plate">
                <div className="project-bts-media">
                  <img src={richProject.btsImage} alt={richProject.btsTitle} className="project-bts-img" />
                </div>
                <div className="project-bts-copy">
                  <span className="eyebrow" style={{ color: '#c4a2ff' }}>ON SET FIELD NOTE</span>
                  <h3>{richProject.btsTitle}</h3>
                  <p>{richProject.btsDescription}</p>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Next / Previous Project Navigation */}
      <section className="project-nav-bar">
        <Link to={`/work/${prevProject.slug}`} className="project-nav-btn prev">
          <ArrowLeft size={16} />
          <div>
            <small>PREVIOUS FRAME</small>
            <span>{prevProject.title}</span>
          </div>
        </Link>

        <Link to="/portfolio" className="project-nav-all">
          <Clapperboard size={18} />
          <span>ALL WORK</span>
        </Link>

        <Link to={`/work/${nextProject.slug}`} className="project-nav-btn next">
          <div>
            <small>NEXT FRAME</small>
            <span>{nextProject.title}</span>
          </div>
          <ArrowRight size={16} />
        </Link>
      </section>

      {/* CTA */}
      <section className="page-cta">
        <h2>
          HAVE A STORY<br />
          <span className="accent">TO PUT IN FRAME?</span>
        </h2>
        <ButtonLink to="/contact">Let's make it</ButtonLink>
      </section>
    </div>
  )
}
