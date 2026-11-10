import { useEffect, useRef } from 'react'
import { AboutHero } from '../components/about/AboutHero'
import { AboutManifesto } from '../components/about/AboutManifesto'
import { AboutProcess } from '../components/about/AboutProcess'
import { Marquee } from '../components/fx/Marquee'
import { PageCTA } from '../components/page/PageCTA'
import { PageAtmosphere, SectionDivider } from '../components/page/PageChrome'
import { aboutCta, aboutHero } from '../data/about'
import { useReveal } from '../hooks/useReveal'
import { usePageSEO } from '../hooks/usePageMeta'
import { PAGE_SEO } from '../data/seo'

export default function About() {
  usePageSEO(PAGE_SEO.about)

  const pageRef = useRef<HTMLDivElement>(null)
  useReveal(pageRef)

  // Instant jump to top (the document uses smooth scrolling for anchors).
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [])

  return (
    <div ref={pageRef} className="page service-detail-page about-page">
      <PageAtmosphere />
      <AboutHero />
      <Marquee className="fx-band" items={aboutHero.metaTags} duration={44} reverse />
      <SectionDivider label="02 / THE APPROACH" />
      <AboutManifesto />
      <SectionDivider label="03 / HOW WE WORK" />
      <AboutProcess />
      <SectionDivider label="04 / START A PROJECT" />
      <PageCTA
        eyebrow={aboutCta.eyebrow}
        heading={
          <>
            BRING US THE SPARK. <br />
            <span className="accent">WE'LL BUILD THE FRAME.</span>
          </>
        }
        description={aboutCta.description}
        primaryLabel="Start a project"
        secondary={{ to: '/services', label: 'See What We Make' }}
      />
    </div>
  )
}
