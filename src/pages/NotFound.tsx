import { useRef } from 'react'
import { SplitTitle } from '../components/fx/SplitTitle'
import { ButtonLink } from '../components/ui/ButtonLink'
import { usePageSEO } from '../hooks/usePageMeta'
import { PAGE_SEO } from '../data/seo'
import { useReveal } from '../hooks/useReveal'

export default function NotFound() {
  usePageSEO(PAGE_SEO.notFound)
  const pageRef = useRef<HTMLDivElement>(null)
  useReveal(pageRef)

  return (
    <div ref={pageRef} className="not-found">
      {/* A film-leader countdown that loops behind the message. */}
      <div className="lost-leader" aria-hidden="true">
        <i className="lost-ring" />
        <i className="lost-ring lost-ring-inner" />
        <i className="lost-sweep" />
        <i className="lost-cross" />
        <b>3</b>
        <b>2</b>
        <b>1</b>
      </div>
      <span className="lost-code" data-text="404">
        404
      </span>
      <p className="eyebrow">FRAME NOT FOUND</p>
      <SplitTitle as="h1" lines={[{ text: "THIS SHOT DIDN'T" }, { text: 'MAKE THE FINAL CUT.' }]} />
      <ButtonLink to="/">Return home</ButtonLink>
    </div>
  )
}
