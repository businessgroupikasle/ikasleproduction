import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Menu, X } from 'lucide-react'
import { NavLink, useLocation } from 'react-router'
import { Brand } from '../ui/Brand'

const links = [
  ['Home', '/'],
  ['About', '/about'],
  ['Services', '/services'],
  ['Portfolio', '/portfolio'],
  ['Contact', '/contact'],
] as const

export function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const trigger = useRef<HTMLButtonElement>(null)
  const location = useLocation()

  const isItemActive = (path: string, isActive: boolean) => {
    if (isActive) return true
    if (path === '/portfolio' && (location.pathname === '/work' || location.pathname.startsWith('/work/'))) {
      return true
    }
    return false
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        trigger.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <Brand />
      <nav className="desktop-nav nav-glass" aria-label="Primary navigation">
        {links.map(([label, path]) => (
          <NavLink
            key={path}
            end={path === '/'}
            to={path}
            className={({ isActive }) => (isItemActive(path, isActive) ? 'active' : undefined)}
          >
            {label}
          </NavLink>
        ))}
      </nav>
      <NavLink className="header-cta" to="/contact">
        Start a project
      </NavLink>
      <button
        ref={trigger}
        className="menu-trigger"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? 'Close menu' : 'Open menu'}
      >
        {open ? <X /> : <Menu />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-menu"
            className="mobile-nav"
            aria-label="Mobile navigation"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {links.map(([label, path], index) => (
              <motion.div
                key={path}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <NavLink
                  end={path === '/'}
                  to={path}
                  className={({ isActive }) => (isItemActive(path, isActive) ? 'active' : undefined)}
                  onClick={() => setOpen(false)}
                >
                  <span>0{index + 1}</span>
                  {label}
                </NavLink>
              </motion.div>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
