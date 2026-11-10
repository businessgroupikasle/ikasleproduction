import { useEffect, useRef } from 'react'
import type { ServiceDetailConfig } from '../../data/serviceDetails'
import { useReveal } from '../../hooks/useReveal'
import { Marquee } from '../fx/Marquee'
import { PageCTA } from '../page/PageCTA'
import { PageAtmosphere, SectionDivider } from '../page/PageChrome'
import { ServiceDisciplines } from './ServiceDisciplines'
import { ServiceHero } from './ServiceHero'

/**
 * The shared layout for every service detail page:
 * hero + deliverables, interactive disciplines, and a closing call to action.
 * Content, imagery and the signature effect all come from `config`.
 */
export function ServiceDetailView({ config }: { config: ServiceDetailConfig }) {
  const pageRef = useRef<HTMLDivElement>(null)
  useReveal(pageRef)

  // Instant jump to top (the document uses smooth scrolling for anchors).
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [])

  return (
    <div
      ref={pageRef}
      className="page service-detail-page"
      data-service={config.slug}
      data-effect={config.signature.effect}
    >
      <PageAtmosphere />
      <ServiceHero config={config} />
      <Marquee className="fx-band" items={config.metaTags} duration={44} />
      <SectionDivider label="02 / SERVICES LIST" />
      <ServiceDisciplines config={config} />
      <SectionDivider label="03 / START A PRODUCTION" />
      <PageCTA description={config.cta.description} />
    </div>
  )
}
