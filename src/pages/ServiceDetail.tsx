import { Navigate, useParams } from 'react-router'
import { services } from '../data/site'
import { serviceDetails } from '../data/serviceDetails'
import { ServiceDetailView } from '../components/service/ServiceDetailView'
import { usePageMeta } from '../hooks/usePageMeta'
import { PAGE_SEO, type PageSEOConfig } from '../data/seo'

const SERVICE_SEO_MAP: Record<string, PageSEOConfig> = {
  photography: PAGE_SEO.photography,
  'video-production': PAGE_SEO.videoProduction,
  'content-creation': PAGE_SEO.contentCreation,
  'creative-solutions': PAGE_SEO.creativeSolutions,
}

export default function ServiceDetail() {
  const { slug } = useParams()
  const service = services.find((item) => item.slug === slug)
  const config = slug ? serviceDetails[slug] : undefined
  const seoConfig = slug && SERVICE_SEO_MAP[slug] ? SERVICE_SEO_MAP[slug] : undefined

  const pageTitle = seoConfig?.title ?? service?.title ?? 'Service'
  const pageDescription =
    seoConfig?.description ?? config?.metaDescription ?? service?.description ?? 'IKASLÉ Productions service.'

  usePageMeta(pageTitle, pageDescription, {
    keywords: seoConfig?.keywords,
    image: seoConfig?.image,
    canonicalPath: seoConfig?.canonicalPath ?? (slug ? `/services/${slug}` : undefined),
    structuredData: seoConfig?.structuredData,
  })

  if (!service || !config) return <Navigate to="/404" replace />

  // Keyed by slug so switching services resets the active discipline and effects.
  return <ServiceDetailView key={config.slug} config={config} />
}
