import { Link } from 'react-router'
import {
  ArrowUpRight,
  ArrowUp,
  MapPin,
  Phone,
  Mail,
} from 'lucide-react'
import { Brand } from '../ui/Brand'
import { WhatsAppIcon } from '../ui/WhatsAppIcon'
import { services } from '../../data/site'

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="footer footer-cinema" role="contentinfo">
      {/* Ambient background glow & atmospheric grid */}
      <div className="footer-ambient" aria-hidden="true">
        <div className="footer-glow footer-glow-primary" />
        <div className="footer-glow footer-glow-secondary" />
        <div className="footer-grid-overlay" />
      </div>

      <div className="footer-container">
        {/* Main Multi-Column Studio Grid */}
        <div className="footer-main-grid">
          {/* Col 1: Identity & Location */}
          <div className="footer-col footer-col-brand footer-lead">
            <Brand />
            <p className="footer-mission">
              Creative production for ideas that deserve to be felt, not just seen. Shaped frame by frame with purposeful direction and visual craft.
            </p>

            <div className="footer-meta-cards">
              <div className="footer-meta-card">
                <MapPin size={15} className="footer-meta-icon" aria-hidden="true" />
                <div>
                  <span className="footer-meta-label">STUDIO BASE</span>
                  <strong className="footer-meta-value">1639/ A, 2nd Floor, Hopes, Coimbatore, India- 641004</strong>
                  <small className="footer-meta-hint">Deployable across South India & worldwide</small>
                </div>
              </div>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="footer-col footer-col-nav">
            <h3 className="footer-col-title">Navigate</h3>
            <nav className="footer-links-list" aria-label="Footer navigation">
              <Link to="/about" className="footer-nav-link">
                <span>About</span>
                <ArrowUpRight size={13} className="footer-nav-arrow" aria-hidden="true" />
              </Link>
              <Link to="/services" className="footer-nav-link">
                <span>Services</span>
                <ArrowUpRight size={13} className="footer-nav-arrow" aria-hidden="true" />
              </Link>
              <Link to="/portfolio" className="footer-nav-link">
                <span>Portfolio</span>
                <ArrowUpRight size={13} className="footer-nav-arrow" aria-hidden="true" />
              </Link>
              <Link to="/contact" className="footer-nav-link">
                <span>Contact</span>
                <ArrowUpRight size={13} className="footer-nav-arrow" aria-hidden="true" />
              </Link>
              <Link to="/contact#faq" className="footer-nav-link">
                <span>FAQ</span>
                <ArrowUpRight size={13} className="footer-nav-arrow" aria-hidden="true" />
              </Link>
            </nav>
          </div>

          {/* Col 3: Services / Crafts */}
          <div className="footer-col footer-col-services">
            <h3 className="footer-col-title">Services</h3>
            <nav className="footer-links-list" aria-label="Footer services">
              {services.map((service) => (
                <Link
                  key={service.slug}
                  to={`/services/${service.slug}`}
                  className="footer-nav-link"
                >
                  <span className="footer-craft-index">{service.index}</span>
                  <span>{service.title}</span>
                  <ArrowUpRight size={13} className="footer-nav-arrow" aria-hidden="true" />
                </Link>
              ))}
            </nav>
          </div>

          {/* Col 4: Direct Desk & Channels */}
          <div className="footer-col footer-col-contact">
            <h3 className="footer-col-title">Information</h3>

            <div className="footer-contact-actions">
              {/* Direct email line */}
              <a href="mailto:ikasleproduction@gmail.com" className="footer-contact-pill">
                <Mail size={14} aria-hidden="true" />
                <span>ikasleproduction@gmail.com</span>
              </a>

              {/* Direct phone line */}
              <a href="tel:+917845132962" className="footer-contact-pill">
                <Phone size={14} aria-hidden="true" />
                <span>+91 78451 32962</span>
              </a>
            </div>

            <div className="footer-socials-block">
              <span className="footer-socials-label">COMMUNITY & FEEDS</span>
              <div className="footer-social-chips">
                <a
                  href="https://www.instagram.com/ikasleproductions"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-chip"
                >
                  <span>Instagram</span>
                  <ArrowUpRight size={12} aria-hidden="true" />
                </a>
                <a
                  href="https://www.youtube.com/@ikasleproductions"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-chip"
                >
                  <span>YouTube</span>
                  <ArrowUpRight size={12} aria-hidden="true" />
                </a>
                <a
                  href="https://vimeo.com/ikasleproductions"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-chip"
                >
                  <span>Vimeo</span>
                  <ArrowUpRight size={12} aria-hidden="true" />
                </a>
                <a
                  href="https://wa.me/917845132962?text=Hi%20IKASL%C3%89%20Productions%2C%20I%20would%20like%20to%20enquire%20about%20a%20production%20project"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-chip"
                >
                  <WhatsAppIcon size={12} aria-hidden="true" />
                  <span>WhatsApp</span>
                  <ArrowUpRight size={12} aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Back to Top */}
        <div className="footer-bottom footer-bottom-bar">
          <div className="footer-bottom-left">
            <span>© {new Date().getFullYear()} IKASLÉ Productions</span>
          </div>

          <div className="footer-bottom-center">
            <Link to="/privacy-policy" className="footer-legal-link">Privacy policy</Link>
            <span className="footer-bullet">·</span>
            <Link to="/terms-and-conditions" className="footer-legal-link">Terms & conditions</Link>
            <span className="footer-bullet">·</span>
            <span className="muted">Coimbatore</span>
          </div>

          <div className="footer-bottom-right">
            <button
              type="button"
              onClick={scrollToTop}
              className="footer-back-to-top"
              aria-label="Scroll back to top of page"
            >
              <span>Back to top</span>
              <ArrowUp size={14} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
