import { useRef } from 'react'
import { LensArt } from '../components/fx/LensArt'
import { SplitTitle } from '../components/fx/SplitTitle'
import { revealDelay, useReveal } from '../hooks/useReveal'
import { usePageSEO } from '../hooks/usePageMeta'
import { PAGE_SEO } from '../data/seo'

interface Clause {
  title: string
  text: string
}

const PRIVACY_CLAUSES: readonly Clause[] = [
  {
    title: 'Introduction & Studio Scope',
    text: 'IKASLÉ Productions ("we", "us", or "our") operates a premier creative production studio and commercial filmmaking house based in Coimbatore, Tamil Nadu, India. This Privacy Policy details how we collect, handle, safeguard, and process your personal and project information when you visit ikasleproductions.com, submit creative project briefs, communicate with our producers, or commission our studio for photography, films, and digital campaigns.',
  },
  {
    title: 'Information We Collect',
    text: 'When you submit a production inquiry, request a quotation, or connect with our producer desk, we may collect your full name, business email address, phone number, company or brand name, project timeline, budget range, and creative specifications. Additionally, we automatically collect anonymous technical data such as browser type, operating system, and interaction analytics to optimize website performance and user experience.',
  },
  {
    title: 'How We Use Your Data',
    text: 'We collect information strictly for legitimate commercial and production purposes: responding to client inquiries, preparing bespoke creative treatments and quotation estimates, scheduling studio soundstage and on-location shoots, coordinating crew and equipment logistics, delivering client review cuts, and issuing invoices in compliance with Indian statutory accounting and GST regulations.',
  },
  {
    title: 'Client Confidentiality & Footage Protection',
    text: 'We understand the sensitivity of unreleased products, brand narratives, and proprietary creative concepts. All client scripts, treatment decks, raw camera takes (ARRI/RED RAW), audio stems, and project files are treated with strict confidentiality. No footage or finished media is published in our portfolio or social feeds prior to your official public broadcast, unless expressly authorized in writing.',
  },
  {
    title: 'Data Retention & Archival',
    text: 'Project correspondence, production briefs, and legal agreements are retained for the duration of the active client relationship and statutory record-keeping periods. Master deliverables and client archive assets are stored on secure local server arrays and encrypted cloud storage for agreed-upon warranty and retrieval windows.',
  },
  {
    title: 'Third-Party Processors & Subcontractors',
    text: 'We never sell, rent, or monetize your personal information to third parties. Information is shared solely with vetted production partners (such as dedicated soundstages, specialized gear rental houses, and encrypted media review systems like Frame.io) strictly on a need-to-know basis required to fulfill your production agreement.',
  },
  {
    title: 'Your Rights & Choices',
    text: 'Under applicable Indian data protection principles and international standards, you have the right to access, inspect, correct, or request deletion of your personal data held in our systems. You may also opt out of promotional announcements or request digital asset purges at any time.',
  },
  {
    title: 'Studio Data Contact & Inquiries',
    text: 'If you have questions, corrections, or privacy requests regarding our handling of your information, please contact our data desk at ikasleproduction@gmail.com, call +91 78451 32962, or visit our studio base in Coimbatore, Tamil Nadu, India.',
  },
]

const TERMS_CLAUSES: readonly Clause[] = [
  {
    title: 'Agreement & Acceptance of Terms',
    text: 'By visiting, browsing, or utilizing ikasleproductions.com, or by commissioning creative production services with IKASLÉ Productions ("the Studio"), you agree to be bound by these Terms and Conditions and our Privacy Policy. If you do not agree to these terms, please refrain from using this website or engaging our studio services.',
  },
  {
    title: 'Intellectual Property & Website Content',
    text: 'All content featured on this website—including showreels, commercial video edits, editorial photography, sound design, visual graphics, trademarks, logos, copy, and layout designs—is the proprietary intellectual property of IKASLÉ Productions and protected under Indian and international copyright laws. No material may be downloaded, reproduced, copied, or broadcast without prior written studio consent.',
  },
  {
    title: 'Creative Commissions & Scope of Work',
    text: 'All commercial production projects—including brand photography, commercial films, corporate documentaries, modular social systems, and art direction—are governed by a formal written Statement of Work (SOW), project brief, or Production Agreement. Any scope additions, additional shoot days, or script revisions beyond the approved treatment will be scoped and billed accordingly.',
  },
  {
    title: 'Retainers, Milestone Billing & Cancellation',
    text: 'Production bookings are secured upon receipt of an agreed initial mobilization retainer, which covers pre-production planning, soundstage holds, crew reservation, and equipment logistics. In the event of a client-initiated cancellation or postponement, expenses incurred prior to written notice—including non-refundable studio holds and equipment reservations—remain non-refundable and due in full.',
  },
  {
    title: 'Ownership, Usage Licenses & Rights',
    text: 'Upon full settlement of all contractual fees, the client is granted the specific commercial usage rights, broadcasting territories, and license terms specified in their project agreement. Raw camera footage, ungraded takes, project files, and unused concepts remain the intellectual property of IKASLÉ Productions unless full buyout terms are explicitly agreed upon in writing. The studio reserves the right to showcase finished, publicly released work in studio portfolios and award submissions.',
  },
  {
    title: 'Production Deliverables & Revision Protocol',
    text: 'Final deliverables will be provided in industry-standard broadcast and digital formats (e.g., ProRes 422 HQ, H.265/H.264, 4K UHD, master color grades, and optimized vertical ratios). Client reviews are conducted via timestamped digital links. Each engagement includes the agreed rounds of creative revisions outlined in the project agreement; revisions exceeding this scope are billed at studio hourly rates.',
  },
  {
    title: 'Limitation of Liability & Force Majeure',
    text: 'IKASLÉ Productions will not be liable for any indirect, incidental, special, or consequential damages resulting from website downtime or unforeseen production interruptions. The studio is excused from contractual delays caused by events beyond reasonable control (force majeure), including severe weather disruptions, regional filming restrictions, civil emergencies, or power grid failures.',
  },
  {
    title: 'Governing Law & Dispute Jurisdiction',
    text: 'These Terms and Conditions and any disputes arising out of website usage or commissioned production contracts shall be governed by and construed in accordance with the laws of the Republic of India. The courts of Coimbatore, Tamil Nadu, India, shall have exclusive territorial jurisdiction over any legal proceedings.',
  },
  {
    title: 'Contact & Official Notices',
    text: 'For formal contract notices, copyright permissions, or service inquiries, please contact IKASLÉ Productions via email at ikasleproduction@gmail.com, by telephone at +91 78451 32962, or visit our studio base in Coimbatore, Tamil Nadu, India.',
  },
]

export default function Legal({ type }: { type: 'privacy' | 'terms' }) {
  const privacy = type === 'privacy'
  const pageRef = useRef<HTMLDivElement>(null)
  useReveal(pageRef)

  usePageSEO(privacy ? PAGE_SEO.privacy : PAGE_SEO.terms)

  const clauses = privacy ? PRIVACY_CLAUSES : TERMS_CLAUSES

  return (
    // Keyed by type so switching between the two documents replays the reveal.
    <div ref={pageRef} key={type} className="page legal-page">
      <header className="page-hero">
        <LensArt className="fx-lens-soft" />
        <p className="eyebrow section-eyebrow" data-reveal>
          {privacy ? 'LEGAL & COMPLIANCE // PRIVACY NOTICE' : 'LEGAL & COMPLIANCE // TERMS OF SERVICE'}
        </p>
        <SplitTitle as="h1" lines={[{ text: privacy ? 'PRIVACY POLICY' : 'TERMS & CONDITIONS' }]} />
      </header>

      <article className="legal-copy">
        <p className="legal-notice" data-reveal>
          {privacy
            ? 'IKASLÉ Productions operates a registered commercial film and photography studio based in Coimbatore, Tamil Nadu, India. This Privacy Policy outlines our transparent commitment to your data security, client confidentiality, and creative rights.'
            : 'These Terms & Conditions govern your access to ikasleproductions.com and all creative production contracts, commercial film commissions, and editorial photography engagements with IKASLÉ Productions, Coimbatore, Tamil Nadu, India.'}
        </p>

        {clauses.map((clause, index) => (
          <section key={clause.title} className="legal-clause" data-reveal style={revealDelay(index > 0 ? 1 : 0)}>
            <h2>{clause.title}</h2>
            <p>{clause.text}</p>
          </section>
        ))}
      </article>
    </div>
  )
}
