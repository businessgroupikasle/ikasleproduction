import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router'
import { motion } from 'motion/react'
import { Layout } from '../components/layout/Layout'

const Home = lazy(() => import('../pages/Home'))
const About = lazy(() => import('../pages/About'))
const Services = lazy(() => import('../pages/Services'))
const ServiceDetail = lazy(() => import('../pages/ServiceDetail'))
const Work = lazy(() => import('../pages/Work'))
const ProjectDetail = lazy(() => import('../pages/ProjectDetail'))
const Contact = lazy(() => import('../pages/Contact'))
const Legal = lazy(() => import('../pages/Legal'))
const NotFound = lazy(() => import('../pages/NotFound'))

export default function App() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.24 }}>
      <Suspense fallback={<div className="page-loader">IKASLÉ</div>}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/:slug" element={<ServiceDetail />} />
            <Route path="/portfolio" element={<Work />} />
            <Route path="/portfolio/:slug" element={<ProjectDetail />} />
            <Route path="/work" element={<Work />} />
            <Route path="/work/:slug" element={<ProjectDetail />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy-policy" element={<Legal type="privacy" />} />
            <Route path="/terms-and-conditions" element={<Legal type="terms" />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </motion.div>
  )
}
