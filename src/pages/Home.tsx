import { Hero } from '../components/home/Hero'
import { HomeContent } from '../components/home/HomeSections'
import { usePageSEO } from '../hooks/usePageMeta'
import { PAGE_SEO } from '../data/seo'

export default function Home() {
  usePageSEO(PAGE_SEO.home)

  return (
    <>
      <Hero />
      <HomeContent />
    </>
  )
}
