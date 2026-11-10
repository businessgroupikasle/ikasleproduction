export interface PhotographyService {
  id: string
  index: string
  title: string
  tagline: string
  description: string
  deliverables: string[]
  specs: string
  image: string
  alt: string
}

export const PHOTOGRAPHY_DELIVERABLES = [
  {
    title: 'Campaign and Editorial Photography',
    description: 'Visual treatment, on-set art direction, and key visual assets built for international brand rollouts and print publications.',
  },
  {
    title: 'Product and People Photography',
    description: 'Precision studio lighting, tactile material reflections, and expressive human portraiture directed with authentic craft.',
  },
  {
    title: 'Retouching and Colour Finishing',
    description: 'High-end frequency separation, calibrated color grading, chromatic balancing, and delivery of archival print & digital masters.',
  },
] as const

export const PHOTOGRAPHY_SERVICES: PhotographyService[] = [
  {
    id: 'product',
    index: '01',
    title: 'Product Photography',
    tagline: 'Sculpted reflections & tactile material truth',
    description:
      'Precision studio lighting, macro texture capture, and immaculate reflection control engineered for high-end packaging, e-commerce flagship listings, and global campaign launches.',
    deliverables: ['Hero studio staging', 'Macro texture plates', 'White-background e-commerce cutouts', '360° product rotations'],
    specs: '100MP Medium Format · Tilt-Shift Optics · Broncolor Lighting',
    image: '/assets/photography/product.jpg',
    alt: 'Luxury minimalist product staging with sculpted reflections',
  },
  {
    id: 'wedding',
    index: '02',
    title: 'Wedding Photography',
    tagline: 'Cinematic intimacy & unscripted emotion',
    description:
      'Documentary-first storytelling that captures the cadence, quiet romance, and raw energy of your celebration with timeless filmic tones and natural light mastery.',
    deliverables: ['Full-day unobtrusive coverage', 'Editorial couple portraits', 'Curated fine art archival albums', 'Same-day sneak peek gallery'],
    specs: 'Dual 35mm / 85mm Prime Rigs · Natural Ambient Light · Film Emulation Grade',
    image: '/assets/photography/wedding.jpg',
    alt: 'Cinematic editorial couple embrace during golden hour',
  },
  {
    id: 'event',
    index: '03',
    title: 'Event Photography',
    tagline: 'Atmospheric journalism & high-voltage presence',
    description:
      'High-speed, low-light visual documentation for private galas, international brand summits, exclusive premieres, and live cultural performances.',
    deliverables: ['Real-time press wire delivery', 'Keynote & guest experience coverage', 'VIP red carpet & step-and-repeat', 'Atmospheric venue & lighting captures'],
    specs: 'Ultra High ISO 4K Sensors · Fast f/1.2 Glass · Instant Tethered Export',
    image: '/assets/photography/event.jpg',
    alt: 'Atmospheric event staging with dramatic lighting and crowd energy',
  },
  {
    id: 'fashion',
    index: '04',
    title: 'Fashion Photography',
    tagline: 'Avant-garde silhouette & editorial art direction',
    description:
      'Narrative lookbooks, campaign editorials, and haute couture stories driven by deliberate color harmony, sculpted movement, and bold styling choreography.',
    deliverables: ['Seasonal lookbook creation', 'High-concept fashion editorials', 'Runway & backstage chronicles', 'Digital & print advertising assets'],
    specs: 'Hasselblad H6D · Profoto Softboxes · Custom Colour Harmonisation',
    image: '/assets/photography/fashion.jpg',
    alt: 'Editorial high fashion styling with sculpted studio lighting',
  },
  {
    id: 'corporate',
    index: '05',
    title: 'Corporate Photography',
    tagline: 'Commanding leadership & authentic workplace identity',
    description:
      'Executive portraits, board-level headshots, and documentary workplace narratives that elevate corporate credibility, annual reports, and investor relations.',
    deliverables: ['Executive C-suite portraiture', 'Environmental team lifestyle', 'Modern facility & campus imagery', 'Investor report visual packages'],
    specs: 'Calibrated Mobile Studio · Dual Key Setup · Uniform Brand Guidelines',
    image: '/assets/photography/corporate.jpg',
    alt: 'Polished modern executive portraiture in contemporary architectural environment',
  },
  {
    id: 'commercial',
    index: '06',
    title: 'Commercial Photography',
    tagline: 'High-conversion visual storytelling for global brands',
    description:
      'Full-scale commercial productions aligning brand strategy with arresting visuals designed to stop thumbs on social feeds and dominate physical billboards.',
    deliverables: ['Multi-channel campaign suites', 'Key visual (KV) master plates', 'Art-directed lifestyle scenarios', 'Modular crop variations (16:9, 4:5, 9:16)'],
    specs: 'Phase One IQ4 · Tethered Capture One Pro · Color Calibrated Proofing',
    image: '/assets/photography/commercial.jpg',
    alt: 'Commercial camera rig and production lighting setup on set',
  },
  {
    id: 'portrait',
    index: '07',
    title: 'Portrait Photography',
    tagline: 'Sculpted chiaroscuro & soul-stirring depth',
    description:
      'Intimate, expressive character portraits exploring identity, expression, and light sculpting. Crafted for artists, visionaries, and editorial publications.',
    deliverables: ['Fine art studio portraits', 'Editorial artist features', 'Custom monochrome grading', 'Archival museum-grade prints'],
    specs: '85mm f/1.2 Lenses · Rembrandt Lighting · Chiaroscuro Contrast Curves',
    image: '/assets/photography/portrait.jpg',
    alt: 'Striking black and white sculpted studio portrait',
  },
  {
    id: 'food',
    index: '08',
    title: 'Food Photography',
    tagline: 'Sensory plating, steam & culinary allure',
    description:
      'Gastronomic visual poetry for Michelin-starred establishments, bespoke beverage brands, and culinary publications, highlighting fresh textures and rich palettes.',
    deliverables: ['Hero dish & tasting menu plates', 'Atmospheric beverage & cocktail pours', 'Kitchen craft & chef documentary', 'Menu & editorial recipe layouts'],
    specs: 'Macro Art Lenses · Directional Backlighting · Heat & Steam Capture',
    image: '/assets/photography/food.jpg',
    alt: 'Gourmet culinary presentation with atmospheric directional lighting',
  },
  {
    id: 'architectural',
    index: '09',
    title: 'Architectural Photography',
    tagline: 'Spatial harmony, geometric purity & daylight studies',
    description:
      'Rigorous documentation of built environments for architects, interior designers, and luxury developers, celebrating geometry, material, and ambient atmosphere.',
    deliverables: ['Interior spatial composition', 'Exterior twilight & daytime studies', 'Structural details & material textures', 'Perspective-corrected master files'],
    specs: '17mm & 24mm Tilt-Shift Lenses · HDR Multi-Bracket · Zero Optical Distortion',
    image: '/assets/photography/architectural.jpg',
    alt: 'Minimalist modern architecture with dramatic lines and spatial depth',
  },
  {
    id: 'industrial',
    index: '10',
    title: 'Industrial Photography',
    tagline: 'Monumental machinery, heat & human ingenuity',
    description:
      'Raw, powerful imagery of advanced manufacturing facilities, aerospace hangars, cleanrooms, and civil engineering feats captured under strict safety protocols.',
    deliverables: ['High-tech manufacturing processes', 'On-site workforce safety narratives', 'Heavy machinery & robotic lines', 'Investor ESG & capability books'],
    specs: 'Weather-Sealed Tough Rigs · High Dynamic Range · Ambient Sparks & Steam',
    image: '/assets/photography/industrial.jpg',
    alt: 'Industrial precision manufacturing with dramatic mechanical atmosphere',
  },
]

