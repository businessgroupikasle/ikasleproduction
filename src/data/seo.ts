/**
 * Centralized SEO configuration and metadata for IKASLÉ Productions.
 * Structured for high-intent discovery, rich search snippets, and OpenGraph sharing.
 * Primary target location: Coimbatore, Tamil Nadu, India.
 */

export const SITE_META = {
  name: 'IKASLÉ Productions',
  legalName: 'IKASLÉ Productions Studio',
  url: 'https://ikasleproductions.com',
  email: 'ikasleproduction@gmail.com',
  phone: '+91 78451 32962',
  location: {
    city: 'Coimbatore',
    region: 'Tamil Nadu',
    country: 'India',
  },
  defaultTitle: 'IKASLÉ Productions — Creative Studio & Film Production in Coimbatore',
  titleTemplate: (pageTitle: string) =>
    pageTitle.includes('IKASLÉ') ? pageTitle : `${pageTitle} — IKASLÉ Productions`,
  defaultDescription:
    'IKASLÉ Productions is a premier creative studio in Coimbatore, Tamil Nadu specializing in commercial video production, brand films, editorial photography, and digital content creation with cinematic craft.',
  defaultKeywords: [
    'video production in Coimbatore',
    'commercial photographer Coimbatore',
    'creative studio Coimbatore',
    'film production company Coimbatore',
    'IKASLÉ Productions',
    'ad film makers Coimbatore',
    'editorial photography Coimbatore',
    'brand campaigns Tamil Nadu',
    'content creation agency Coimbatore',
    'cinematic storytelling South India',
    'creative direction Coimbatore',
  ],
  defaultImage: '/assets/brand/ikasle-mark.svg',
} as const

export interface PageSEOConfig {
  title: string
  description: string
  keywords: string[]
  canonicalPath: string
  image?: string
  type?: 'website' | 'article'
  noindex?: boolean
  structuredData?: Record<string, unknown>
}

export const PAGE_SEO: Record<string, PageSEOConfig> = {
  home: {
    title: 'IKASLÉ Productions — Creative Studio & Film Production in Coimbatore',
    description:
      'Coimbatore premier creative studio: commercial video production, brand films, editorial photography, and digital content creation with cinema-grade craft.',
    keywords: [
      'video production in Coimbatore',
      'commercial photographer Coimbatore',
      'creative studio Coimbatore',
      'film production company Coimbatore',
      'IKASLÉ Productions',
      'ad film makers Coimbatore',
      'brand films Tamil Nadu',
      'content creation agency Coimbatore',
      'cinematic storytelling South India',
      'photography studio Coimbatore',
    ],
    canonicalPath: '/',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'ProfessionalService',
      name: 'IKASLÉ Productions',
      url: 'https://ikasleproductions.com/',
      logo: 'https://ikasleproductions.com/assets/brand/ikasle-mark.svg',
      image: 'https://ikasleproductions.com/assets/brand/ikasle-mark.svg',
      description:
        'IKASLÉ Productions is a premier creative studio in Coimbatore producing commercial films, editorial photography, and digital content with cinematic craft.',
      telephone: '+91 78451 32962',
      email: 'ikasleproduction@gmail.com',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Coimbatore',
        addressRegion: 'Tamil Nadu',
        addressCountry: 'IN',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: '11.0168',
        longitude: '76.9558',
      },
      areaServed: [
        {
          '@type': 'City',
          name: 'Coimbatore',
        },
        {
          '@type': 'State',
          name: 'Tamil Nadu',
        },
        {
          '@type': 'Country',
          name: 'India',
        },
      ],
      sameAs: [
        'https://wa.me/917845132962',
      ],
      priceRange: '$$$',
    },
  },

  about: {
    title: 'About Our Coimbatore Studio — Philosophy, Team & Craft',
    description:
      'Meet the creative minds and production craft behind IKASLÉ Productions in Coimbatore. Discover our disciplined filmmaking workflow, soundstages, and visual storytelling philosophy.',
    keywords: [
      'about IKASLÉ Productions',
      'creative studio Coimbatore',
      'film production team Coimbatore',
      'cinematography studio Tamil Nadu',
      'production philosophy',
      'visual storytelling South India',
      'creative agency Coimbatore',
    ],
    canonicalPath: '/about',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'AboutPage',
      name: 'About IKASLÉ Productions',
      url: 'https://ikasleproductions.com/about',
      description:
        'IKASLÉ Productions brings photography, filmmaking, content, and creative thinking together under one production-minded approach in Coimbatore.',
    },
  },

  services: {
    title: 'Production Services in Coimbatore — Photography, Film & Content',
    description:
      'Explore IKASLÉ Productions services in Coimbatore: Commercial Photography, Cinematic Video Production, Social Content Creation, and Strategic Creative Solutions.',
    keywords: [
      'video production services Coimbatore',
      'commercial photography services Coimbatore',
      'content creation agency Coimbatore',
      'creative direction services Tamil Nadu',
      'brand video agency Coimbatore',
      'post-production color grading Coimbatore',
    ],
    canonicalPath: '/services',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'Service',
      serviceType: 'Creative Production & Filmmaking',
      provider: {
        '@type': 'ProfessionalService',
        name: 'IKASLÉ Productions',
        url: 'https://ikasleproductions.com',
      },
      areaServed: {
        '@type': 'City',
        name: 'Coimbatore',
      },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Production Services',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Photography',
              description: 'Commercial, campaign, editorial, and product photography in Coimbatore.',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Video Production',
              description: 'Commercial films, brand documentaries, and high-impact motion in Coimbatore.',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Content Creation',
              description: 'Short-form digital content, modular reels, and episodic systems in Coimbatore.',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Creative Solutions',
              description: 'Visual direction, treatments, storyboards, and concept development.',
            },
          },
        ],
      },
    },
  },

  photography: {
    title: 'Commercial & Editorial Photography Services in Coimbatore',
    description:
      'High-end commercial, fashion, editorial, portrait, and product photography with precision studio lighting and master-grade retouching based in Coimbatore.',
    keywords: [
      'commercial photographer Coimbatore',
      'product photography studio Coimbatore',
      'editorial portrait photography Coimbatore',
      'fashion photographer Coimbatore',
      'advertising photography Tamil Nadu',
      'studio lighting Coimbatore',
      'retouching and colour grading',
    ],
    canonicalPath: '/services/photography',
    image: '/assets/services/photography/hero.jpg',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Photography Services — IKASLÉ Productions Coimbatore',
      serviceType: 'Commercial & Editorial Photography',
      provider: {
        '@type': 'ProfessionalService',
        name: 'IKASLÉ Productions',
      },
      areaServed: {
        '@type': 'City',
        name: 'Coimbatore',
      },
      description:
        'Purposeful image-making for brands, products, portraits, and editorial stories — from visual planning through the final grade.',
    },
  },

  videoProduction: {
    title: 'Cinematic Video Production & Commercial Films in Coimbatore',
    description:
      'Full-spectrum film production based in Coimbatore: high-impact commercial TVCs, brand documentaries, cinematic promotional films, high-speed filming, and theatrical color grading.',
    keywords: [
      'video production company in Coimbatore',
      'ad film production Coimbatore',
      'commercial filmmakers Coimbatore',
      'brand documentary Tamil Nadu',
      'promotional video company Coimbatore',
      'corporate films Coimbatore',
      'post production colour grading Coimbatore',
    ],
    canonicalPath: '/services/video-production',
    image: '/assets/services/video-production/cine-wide.jpg',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Video Production Services — IKASLÉ Productions Coimbatore',
      serviceType: 'Commercial Video Production & Filmmaking',
      provider: {
        '@type': 'ProfessionalService',
        name: 'IKASLÉ Productions',
      },
      areaServed: {
        '@type': 'City',
        name: 'Coimbatore',
      },
      description:
        'End-to-end film production shaped around the idea: treatments, crews, shoots, edits, sound, colour, and delivery.',
    },
  },

  contentCreation: {
    title: 'Social-First Content Creation & Short-Form Video in Coimbatore',
    description:
      'Repeatable, high-engagement content systems for modern brands: Instagram Reels, TikTok campaigns, episodic micro-stories, and modular multi-format assets produced in Coimbatore.',
    keywords: [
      'content creation agency Coimbatore',
      'social media video production Coimbatore',
      'vertical video 9:16 Coimbatore',
      'Instagram Reels production Coimbatore',
      'brand content agency Tamil Nadu',
      'creator content systems',
      'short-form video production',
    ],
    canonicalPath: '/services/content-creation',
    image: '/assets/services/content-creation/reels.jpg',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Content Creation Services — IKASLÉ Productions Coimbatore',
      serviceType: 'Digital & Social Content Creation',
      provider: {
        '@type': 'ProfessionalService',
        name: 'IKASLÉ Productions',
      },
      areaServed: {
        '@type': 'City',
        name: 'Coimbatore',
      },
      description:
        'A repeatable content system with platform-aware concepts, flexible formats, and a consistent visual voice.',
    },
  },

  creativeSolutions: {
    title: 'Creative Direction & Production Design in Coimbatore',
    description:
      'Production-led creative direction connecting bold briefs to executable visual worlds: treatments, storyboards, art direction, and comprehensive brand visual systems based in Coimbatore.',
    keywords: [
      'creative direction studio Coimbatore',
      'concept development Coimbatore',
      'visual treatments Tamil Nadu',
      'storyboarding pre-visualization',
      'production design Coimbatore',
      'brand visual systems',
      'commercial art direction',
    ],
    canonicalPath: '/services/creative-solutions',
    image: '/assets/services/creative-solutions/direction.jpg',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Creative Solutions — IKASLÉ Productions Coimbatore',
      serviceType: 'Creative Direction & Concept Development',
      provider: {
        '@type': 'ProfessionalService',
        name: 'IKASLÉ Productions',
      },
      areaServed: {
        '@type': 'City',
        name: 'Coimbatore',
      },
      description:
        'Creative direction that connects the brief to a practical, production-ready visual world.',
    },
  },

  work: {
    title: 'Portfolio & Selected Works — IKASLÉ Productions Coimbatore',
    description:
      'Explore our curated portfolio of commercial films, editorial photography, high-speed brand campaigns, and vertical content produced by IKASLÉ Productions in Coimbatore.',
    keywords: [
      'commercial film portfolio Coimbatore',
      'photography portfolio Coimbatore',
      'director showreel Coimbatore',
      'brand campaign case studies Tamil Nadu',
      'cinematic video showcase',
      'IKASLÉ work portfolio',
    ],
    canonicalPath: '/portfolio',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Portfolio — IKASLÉ Productions Coimbatore',
      url: 'https://ikasleproductions.com/portfolio',
      description:
        'Explore IKASLÉ Productions selected frames — commercial films, editorial photography, brand campaigns, and creative productions.',
    },
  },

  portfolio: {
    title: 'Portfolio & Selected Works — IKASLÉ Productions Coimbatore',
    description:
      'Explore our curated portfolio of commercial films, editorial photography, high-speed brand campaigns, and vertical content produced by IKASLÉ Productions in Coimbatore.',
    keywords: [
      'commercial film portfolio Coimbatore',
      'photography portfolio Coimbatore',
      'director showreel Coimbatore',
      'brand campaign case studies Tamil Nadu',
      'cinematic video showcase',
      'IKASLÉ work portfolio',
    ],
    canonicalPath: '/portfolio',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: 'Portfolio — IKASLÉ Productions Coimbatore',
      url: 'https://ikasleproductions.com/portfolio',
      description:
        'Explore IKASLÉ Productions selected frames — commercial films, editorial photography, brand campaigns, and creative productions.',
    },
  },

  contact: {
    title: 'Contact Our Coimbatore Production Studio — Start a Project',
    description:
      'Commission your next project with IKASLÉ Productions in Coimbatore, Tamil Nadu. Inquire about commercial video shoots, editorial photo sessions, or creative direction scoping.',
    keywords: [
      'hire video production company Coimbatore',
      'commercial photographer contact Coimbatore',
      'film production Coimbatore phone',
      'production inquiry Tamil Nadu',
      'IKASLÉ Productions contact Coimbatore',
      'Coimbatore film studio soundstage',
    ],
    canonicalPath: '/contact',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'ContactPage',
      name: 'Contact IKASLÉ Productions Coimbatore',
      url: 'https://ikasleproductions.com/contact',
      description:
        'Start a photography, commercial film, brand campaign, or creative production with IKASLÉ Productions in Coimbatore, Tamil Nadu.',
    },
  },

  privacy: {
    title: 'Privacy Policy',
    description:
      'Read the privacy policy of IKASLÉ Productions. Learn how we handle, protect, and respect your personal information.',
    keywords: ['privacy policy', 'IKASLÉ Productions privacy', 'data protection'],
    canonicalPath: '/privacy-policy',
  },

  terms: {
    title: 'Terms & Conditions',
    description:
      'Review the commercial engagement terms, client production agreements, and usage conditions for IKASLÉ Productions.',
    keywords: ['terms and conditions', 'production terms of service', 'client agreement'],
    canonicalPath: '/terms-and-conditions',
  },

  notFound: {
    title: '404 — Frame Not Found',
    description: 'The requested page or shot did not make the final cut. Return to the home feed.',
    keywords: ['404 not found'],
    canonicalPath: '/404',
    noindex: true,
  },
}

/**
 * Helper to generate SEO metadata for individual portfolio project detail pages.
 */
export function getProjectSEO(project: {
  slug: string
  title: string
  summary: string
  category: string
  image?: string
  tagline?: string
}): PageSEOConfig {
  return {
    title: `${project.title} — ${project.category} Portfolio Case Study`,
    description: `${project.summary} ${project.tagline ? project.tagline : ''} Produced by IKASLÉ Productions, Coimbatore.`.trim(),
    keywords: [
      project.title,
      project.category,
      'case study',
      'commercial production Coimbatore',
      'IKASLÉ Productions',
      'cinematic showcase Tamil Nadu',
    ],
    canonicalPath: `/work/${project.slug}`,
    image: project.image,
    type: 'article',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      name: project.title,
      headline: project.title,
      description: project.summary,
      image: project.image ? `https://ikasleproductions.com${project.image}` : undefined,
      creator: {
        '@type': 'Organization',
        name: 'IKASLÉ Productions',
        location: {
          '@type': 'Place',
          name: 'Coimbatore, Tamil Nadu, India',
        },
      },
    },
  }
}
