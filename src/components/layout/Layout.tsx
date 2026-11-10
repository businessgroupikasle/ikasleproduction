import { Outlet } from 'react-router'
import { Header } from './Header'
import { Footer } from './Footer'
import { SiteFx } from '../fx/SiteFx'

export function Layout() {
  return (
    <>
      <SiteFx />
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
