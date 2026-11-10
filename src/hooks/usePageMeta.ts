import { useEffect } from 'react'
import { SITE_META, type PageSEOConfig } from '../data/seo'

export interface PageMetaOptions {
  keywords?: string | string[]
  image?: string
  type?: 'website' | 'article'
  canonicalPath?: string
  noindex?: boolean
  structuredData?: Record<string, unknown>
}

function setMetaTag(selector: string, attrName: 'name' | 'property', attrVal: string, content: string) {
  let tag = document.querySelector<HTMLMetaElement>(selector)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute(attrName, attrVal)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content)
}

function setCanonical(url: string) {
  let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!link) {
    link = document.createElement('link')
    link.setAttribute('rel', 'canonical')
    document.head.appendChild(link)
  }
  link.setAttribute('href', url)
}

function setStructuredData(data?: Record<string, unknown>) {
  const SCRIPT_ID = 'structured-data-page'
  let script = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null

  if (!data) {
    if (script) script.remove()
    return
  }

  if (!script) {
    script = document.createElement('script')
    script.id = SCRIPT_ID
    script.type = 'application/ld+json'
    document.head.appendChild(script)
  }

  script.textContent = JSON.stringify(data)
}

/**
 * Hook to dynamically update full document metadata, OpenGraph, Twitter Cards,
 * canonical URLs, keywords, and JSON-LD structured data for SEO.
 */
export function usePageMeta(title: string, description: string, options?: PageMetaOptions) {
  useEffect(() => {
    // 1. Page Title
    const fullTitle = SITE_META.titleTemplate(title)
    document.title = fullTitle

    // 2. Primary Meta Description
    setMetaTag('meta[name="description"]', 'name', 'description', description)

    // 3. Keywords
    const keywordsVal = options?.keywords
      ? Array.isArray(options.keywords)
        ? options.keywords.join(', ')
        : options.keywords
      : SITE_META.defaultKeywords.join(', ')
    setMetaTag('meta[name="keywords"]', 'name', 'keywords', keywordsVal)

    // 4. Robots indexing
    const robotsVal = options?.noindex
      ? 'noindex, nofollow'
      : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
    setMetaTag('meta[name="robots"]', 'name', 'robots', robotsVal)

    // 5. Canonical URL
    const canonicalPath = options?.canonicalPath ?? window.location.pathname
    const canonicalUrl = `${SITE_META.url}${canonicalPath.startsWith('/') ? canonicalPath : `/${canonicalPath}`}`
    setCanonical(canonicalUrl)

    // 6. Image URL
    const rawImage = options?.image ?? SITE_META.defaultImage
    const fullImageUrl = rawImage.startsWith('http') ? rawImage : `${SITE_META.url}${rawImage.startsWith('/') ? rawImage : `/${rawImage}`}`

    // 7. OpenGraph
    setMetaTag('meta[property="og:title"]', 'property', 'og:title', fullTitle)
    setMetaTag('meta[property="og:description"]', 'property', 'og:description', description)
    setMetaTag('meta[property="og:type"]', 'property', 'og:type', options?.type ?? 'website')
    setMetaTag('meta[property="og:url"]', 'property', 'og:url', canonicalUrl)
    setMetaTag('meta[property="og:image"]', 'property', 'og:image', fullImageUrl)
    setMetaTag('meta[property="og:site_name"]', 'property', 'og:site_name', SITE_META.name)

    // 8. Twitter Cards
    setMetaTag('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image')
    setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', fullTitle)
    setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', description)
    setMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', fullImageUrl)

    // 9. Structured Data JSON-LD
    setStructuredData(options?.structuredData)

    // Scroll to top
    window.scrollTo({ top: 0 })
  }, [
    title,
    description,
    options?.keywords,
    options?.image,
    options?.type,
    options?.canonicalPath,
    options?.noindex,
    options?.structuredData,
  ])
}

/**
 * Convenience hook that takes a PageSEOConfig directly.
 */
export function usePageSEO(config: PageSEOConfig) {
  usePageMeta(config.title, config.description, {
    keywords: config.keywords,
    image: config.image,
    type: config.type,
    canonicalPath: config.canonicalPath,
    noindex: config.noindex,
    structuredData: config.structuredData,
  })
}
